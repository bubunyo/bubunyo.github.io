---
layout: post
title: "What is in a String... In Go"
description: "Understanding how strings work in Go: memory management, immutability, and performance considerations when manipulating strings."
comments: true
keywords: "golang, go, strings, performance, garbage collection, tech"
published: true
---

Strings are ubiquitous. You use them everywhere; Logs, APIs, user input, configuration, serialization. They feel like a primitive type. You declare them, concatenate them, pass them around, and it all just works.

`C` doesnt have strings. In Java, strings are not a primitive type. That is because strings are not as simple as `int` or `bool`. Under the hood, a string is a composite structure: a pointer to some bytes and a length. Go does a lot of heavy lifting to make strings feel seamless, and that is a good thing. But this convenience has a cost. Most engineers never take the time to understand how strings actually work, and they end up writing code that is slower than it needs to be.

For a type that feels so simple, that is surprising. But once you understand what is happening under the hood, it makes perfect sense.

That is what we are going to try to unpack.

Before we get there, we need to talk about two things: garbage collection and slices. These two concepts are critical to understanding why strings are what they are in Go, and why the choices you make when manipulating them matter. It also bears to note that, while the concepts presented here are specific to Go, they are broadly applicable to most programming languages even though the implementation details might be different. 

Go has two memory regions where your data can live: the [stack and the heap](https://go.dev/doc/faq#stack_or_heap).

The stack is the easy one. When you call a function, Go allocates space for local variables on the stack. When the function returns, that space is automatically reclaimed. No cleanup required. It is fast and cheap.

The heap is different. When data needs to outlive the function that created it, or when the compiler cannot determine the size at compile time, that data goes on the heap. The heap is managed by Go's [garbage collector](https://go.dev/doc/gc-guide). The garbage collector periodically scans the heap, figures out what is still being used, and frees what is not.

This is where things get interesting. Modern Go uses a [concurrent, tri-color mark-and-sweep garbage collector](https://go.dev/blog/ismmkeynote). While it does have brief stop-the-world phases, most of its work runs concurrently with your program. However, the more garbage you create, the more work the collector has to do, and the more CPU time it consumes.

The key insight here is that allocations are not free. Every time you allocate something on the heap, you are creating future work for the garbage collector. This might seem like a minor concern for small programs, but at scale, GC pressure becomes one of the primary performance bottlenecks. It is impossible to prescribe where your variable should go. That is the job of [escape analysis](https://go.dev/doc/faq#stack_or_heap), but depending on how you write your code, you can "make a convincing argument" to the escape analyzer at compile time. 

Arrays in Go are fixed-size, value types. ie, the size is a part of the type. When you pass an array to a function, the entire thing gets copied. Because of this, [arrays are rarely used directly](https://go.dev/blog/slices-intro). Instead, we use slices.

A slice is a descriptor that points to an underlying array. Under the hood, a slice is a struct with three fields (see [`reflect.SliceHeader`](https://pkg.go.dev/reflect#SliceHeader)):

```go
type SliceHeader struct {
    Data uintptr  // pointer to the underlying array
    Len  int      // number of elements in the slice
    Cap  int      // capacity of the underlying array
}
```

When you create a slice like this:

```go
s := make([]byte, 3, 5)
s[0], s[1], s[2] = 'a', 'b', 'c'
```

You get a slice header pointing to a backing array of 5 elements, with the first 3 populated. The slice knows its length is 3 and its capacity is 5.

This design has a consequence that trips people up: multiple slices can share the same backing array.

```go
arr := [5]byte{'a', 'b', 'c', 'd', 'e'}
s1 := arr[0:3]  // [a, b, c]
s2 := arr[1:4]  // [b, c, d]
```

Both `s1` and `s2` point to the same underlying array. If you modify `s1[1]`, you are also modifying `s2[0]`. They overlap.

The other thing to understand is what happens when you append beyond capacity. If you have a slice at capacity and you append to it, Go allocates a new, larger backing array, copies all the elements over, and returns a new slice pointing to this new array. The old array becomes garbage.

```go
s := make([]byte, 3, 3)  // len=3, cap=3
s = append(s, 'd')       // new backing array allocated
```

This is important. Every time you exceed capacity, you pay for an allocation and a copy. The old backing array is now garbage waiting to be collected.

Now we can talk about strings.

A string in Go is a read-only slice of bytes. Under the hood, it looks like this (see [`reflect.StringHeader`](https://pkg.go.dev/reflect#StringHeader)):

```go
type StringHeader struct {
    Data uintptr  // pointer to the underlying bytes
    Len  int      // number of bytes
}
```

Notice what is missing: there is no `Cap` field. A slice has pointer, length, and capacity. A string only has pointer and length.

Why no capacity? Because strings are immutable. You can never append to a string in place. You can never modify its contents. If you cannot grow a string, you do not need to track how much room there is to grow into.

This is what Go hides from you. When you write `s := "hello"`, you are not just storing five characters. You are creating a struct with a pointer to those bytes and a length. The simplicity is a facade.

This immutability is a deliberate design choice. It makes strings safe to share across goroutines without locks. It makes them safe to use as map keys (see the [Go spec on string types](https://go.dev/ref/spec#String_types)). But it comes with costs.

What happens when you concatenate two strings?

```go
s := "hello"
s = s + " world"
```

Since strings are immutable, Go cannot modify the original string. Instead, it allocates a new backing array large enough to hold both strings, copies the bytes from both into the new array, and returns a new string pointing to it. The old backing array becomes garbage.

Every concatenation is an allocation and a copy.

This seems fine for a single concatenation. But consider this:

```go
var s string
for i := 0; i < 1000; i++ {
    s += "a"
}
```

How many allocations happen here? One thousand. Each iteration allocates a new backing array slightly larger than the last, copies all the existing bytes plus the new one, and discards the old array.

But it gets worse. This is not just O(n) allocations, it is O(n^2) copying. On the first iteration, you copy 1 byte. On the second, 2 bytes. On the third, 3 bytes. By the end, you have copied 1 + 2 + 3 + ... + 1000 = 500,500 bytes. For a 1000-byte string.

This is why string concatenation in a loop is one of the most common performance mistakes in Go. And it is why [`strings.Builder`](https://pkg.go.dev/strings#Builder) exists.

```go
var b strings.Builder
for i := 0; i < 1000; i++ {
    b.WriteString("a")
}
s := b.String()
```

`strings.Builder` maintains an internal byte slice that grows using the same doubling strategy as `append`. When you call `String()`, it converts the byte slice to a string without copying, using an [`unsafe` trick](https://pkg.go.dev/unsafe). One allocation for the final string, plus a handful of allocations as the internal buffer grows. Orders of magnitude better.

If you know the final size ahead of time, you can do even better:

```go
var b strings.Builder
b.Grow(1000)  // pre-allocate
for i := 0; i < 1000; i++ {
    b.WriteString("a")
}
s := b.String()
```

Now you have exactly one allocation.

Go does some clever things to reduce allocations for string literals. When you write:

```go
a := "hello"
b := "hello"
```

Both `a` and `b` point to the same backing array. The compiler [interns string literals](https://go.dev/ref/spec#String_literals). It recognizes that these are the same string and stores it once in the binary's read-only data section. No heap allocation at all.

But this only works for compile-time constants. If you build the same string at runtime:

```go
a := "hel" + "lo"  // compiler folds this to "hello", interned
b := strings.Join([]string{"hel", "lo"}, "")  // runtime, not interned
```

The first one gets interned because the compiler can evaluate the concatenation at compile time. The second one happens at runtime, so it allocates.

This also has implications for string comparison. Comparing two strings is O(n), Go compares byte by byte. If you are using strings as map keys, every lookup pays this cost. For short strings, this is negligible. For long strings used as keys in hot paths, it adds up.

Converting between strings and byte slices is another source of hidden allocations.

```go
s := "hello"
b := []byte(s)  // allocates
```

Why does this allocate? Because strings are immutable and byte slices are not. If `b` shared the same backing array as `s`, you could do `b[0] = 'X'` and suddenly `s` would contain "Xello". That would break the immutability guarantee.

So Go copies. Every time you convert a string to a byte slice, you get a new allocation. Every time you convert a byte slice to a string, you get a new allocation.

```go
b := []byte("hello")  // allocation
s := string(b)        // allocation
```

There are unsafe ways around this if you really need them, but you should not reach for them unless you have profiled and identified this as an actual bottleneck. The compiler also optimizes some cases. For example, `[]byte(s)` used immediately in a read-only context may avoid the copy. But do not count on it.

If you take away nothing else from this article, remember this: every string modification is a heap allocation, and heap allocations are GC work.

When building strings incrementally, use `strings.Builder`. Pre-size with `Grow()` if you know the final length.

```go
var b strings.Builder
b.Grow(estimatedSize)
for _, part := range parts {
    b.WriteString(part)
}
result := b.String()
```

If you need the result as `[]byte` rather than `string`, use [`bytes.Buffer`](https://pkg.go.dev/bytes#Buffer) instead:

```go
var b bytes.Buffer
b.Grow(estimatedSize)
for _, part := range parts {
    b.WriteString(part)
}
result := b.Bytes()
```

If you are holding a small substring of a much larger string, be aware that the substring shares the backing array of the original. The large string cannot be garbage collected until all substrings are gone. Use [`strings.Clone()`](https://pkg.go.dev/strings#Clone) to get an independent copy:

```go
large := getLargeString()  // 10MB string
small := large[0:10]       // still references the 10MB backing array
small = strings.Clone(small)  // now has its own 10-byte backing array
```

For high-throughput scenarios where you are creating many short-lived strings, consider [`sync.Pool`](https://pkg.go.dev/sync#Pool) to reuse buffers:

```go
var builderPool = sync.Pool{
    New: func() interface{} {
        return new(strings.Builder)
    },
}

func process(parts []string) string {
    b := builderPool.Get().(*strings.Builder)
    b.Reset()
    defer builderPool.Put(b)
    
    for _, part := range parts {
        b.WriteString(part)
    }
    return b.String()
}
```

Strings feel simple, but they are not. Under the hood, a string is a pointer and a length, and every modification means a new allocation. Go chose to make strings immutable, which makes them safe and easy to reason about, but it means every modification creates garbage.

The mental model is straightforward: string modification equals heap allocation equals GC pressure. Once you internalize this, you start seeing the problems before they bite you.

The next time you see a `+` inside a loop, pause. That is probably where half your allocations are coming from.
