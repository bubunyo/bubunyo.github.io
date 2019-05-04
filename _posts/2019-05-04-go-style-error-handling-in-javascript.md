---
layout: post
title: 'Golang style error handling pattern in Javascript'
description: 'Golang style error handling pattern in Javascript'
comments: true
keywords: 'devcongress, tech, ghana, error handling, golang exceptions, javascript, tech'
published: true
---

When I first learnt there was no try-catch in golang, I was sceptical. What could be better than a simple try-catch block. I soon realized that what golang had was much better for many reasons. In other for me to put my point across, let's first explore the anatomy of a typical try-catch block.

A simple `try-catch` block takes this form.

```
try {
  /*
   * a block of code that is expected to throw an exception.
   */
} catch(ex: ExceptionType) {
  /*
   * handle the exception that you are expecting
   */
} finally() {
  /*
   * release resources that we held before exception was thrown.
   */
}
```

The first part of a `try-catch` is the try block. Most of the expressions in a try block is used to acquire a volatile resource that is expected to throw an exception. When these exceptions are thrown, you handle them inside the catch block, which is the second part of the try-catch block. Once an exception has been handled in a catch block, the finally block of the try-catch block preforms all operations necessary to cover, close and or terminate resources (to avoid leak). Most people omit the finally block entirely, and go on to perform resource terminations after the entire try-catch block has completed execution. I am not entirely for or against this pattern, because there are cases where they make sense and there are cases where they dont.

Most typical try blocks contain more than one expression that acquire different types of volatile resources. Which means if you have two expression of that nature, throwing exceptions of different types, you might need to account for the types and handle them differently inside the catch block. But different programming languages help handle this differently.

The main difference is between strongly typed and weakly typed languages. With strongly typed languages you can specify the type of the exception to catch and the rest is taken care of.

In strongly-typed language like Java you can have multiple catch blocks like this:

```java
try {

    Obj1 obj1 = GetObj1(); // might throw Exception1
    Obj2 obj2 = GetObj2(obj1) // might throw Exception2
    // do something with obj2

} catch(Exception1 ex) {

    // do whatever with ex of type Exception 1

} catch(Exception1 ex) {

    // do whatever with ex of type Exception 2

}
```

You can even go as far as condensing multiple catch block into one like this:

```java
...
  catch(Exception1 | Exception 2 ex) {
    ...
  }
```

If you have different ways of handling the different exceptions you will have to check the type of the exception. So your catch block might end up like this:

```java
  ....
  catch(Exception1 | Exception 2 ex) {
    if(ex instanceOf Exception1){
    // handle ex of type Exception1
    } else if (ex instanceOf Exception2) {
    // handle ex of type Excetpion2
    }
  }
```

Handling exceptions in weakly typed languages like JavaScript is closer to the catch block condensation above. Because there are no explicit types, you are forced to type check.

The main problem with this is how you don't know which expressions are throwing what exceptions.

If you run the program and an exception is not thrown, how do you know what can throw? The easy solution here is to add comments. But if you truely believe `good code must explain itself`, then this might not be an ideal answer.

Another solution would be to have individual try-catch blocks for each throwable expression. Doing this litters your code with numerous try-catch blocks. This makes your code difficult to read and maintain. It will definitely not be beautiful.

Another issue with this method is it relegates error handling to the bottom but this is a crucial part of the code and must be treated of the utmost importance.

> I think error handling at the bottom of a function should be labeled an anti-pattern.

The third issue is the mental toll it takes to understand this block of code.

When reading code and you see a try block, you instinctively know there is a catch block but you dont see that next. So you make a mental note to look at what the error handling case is. If the try block becomes long or easily meanders, you can easily loose that train of thought.

If you are writing the code, the intuition is to write the catch block first and then deal with the try block. But this is not how you read code. If you read code like this, once you loose "the catch" train of thoughts, it makes the code more difficult to understand.

Golang avoids these three problems entirely by handling errors/exceptions atomically. To put it simply, it is a more lovely form of the multiple try-catch block answer stated above. A typical error handling in golang looks like this.

```golang
res, err := http.Get("http://example.com/api")
if err != nil {
  // handle `err`
}
// do something with res
```

The first thing this pattern establishes is you know which singular expression can error out, and you know exactly how that is dealt with.

Secondly, you are forced to think about errors as a first class citizen. You are assured that once something below this line is executed, everything above is fine.

Thirdly, if typical try catch block composition involve handling exceptions first, why don't we entrench that pattern? This prevents the mental overhead necessary to keep track of what can throw. The mental impact of this is low. You get an error, you deal with it, you move on. Now, you can do other things.

This might not seem like massive gains but as your codebase grows in size and complexity, you realize that these little wins compound to make the codebase easier to reason about and maintain.

My job these days at AF Radio involves writing a ton of JavaScript and I set out to create a pattern like this in our codebase.

In our code base, most of the expressions that are expected to throw exceptions are Promises and rightly so. JS helps with the catch block of a promise. A typical promise execution looks like this:

```javascript
fetch('https://example.com/api')
  .then(res => {
    // do something with `res`
  })
  .catch(err => {
    // handle `err`
  });
```

I'm not a fan of this method for promise execution. It forces you to implement logic in then-blocks while making it difficult to read. This method also exhibits the three issues listed above.

I prefer async-await, as they are much cleaner and easier to read. The fetch function above as an async-await will look like this.

```javascript
const res = await fetch('https://example.com/api');
// do something with res.
```

When we wrap it in a try-catch it looks like this.

```javascript
try {
  const res = await fetch('https://example.com/api');
  // do something with res.
} catch (ex) {
  // handle exception here
}
```

In other to turn this try-catch expression into the golang error handling pattern I mentioned earlier, I implemented a custom fetch function.

```javascript
async function fetchable(url) {
  try {
    let res = await fetch(url);
    return [null, res];
  } catch (err) {
    return [err, null];
  }
}
```

To use this function we can easily call it like this:

```javascript
const [ex, res] = await fetchable('https://example.com/api');
if (ex) {
  // handle exception.
}
// do something with res and exit
```

What happens is, one of two objects are always returned and never both. If the `ex` is truthy, the `res` object will not exist, and vice versa. If the underlying function throws, it will be captured in `ex`.

You can easily extend the `fetchable` function to take in more arguments.

You can also implement a utility function which takes a promise as an argument and returns a golang error handling pattern like this:

```javascript
async function Executable(promise) {
  try {
    let res = await promise();
    return [null, res];
  } catch (err) {
    return [err, null];
  }
}
```

You can use this function multiple times like this:

```javascript
const [ex1, res] = await Executable(fetch('https://example.com/api'));
if (ex1) {
  // handle exception.
}
// do something with res

const [ex2, data] = await Executable(db.query('SELECT * FROM USERS'));
if (ex2) {
  // handle exception.
}
// do something with data
```

This approach to error handling makes it very easy to understand the different failure points in your code and handle them appropriately without relegating it to some obscure levels in your code. 

Let me know what you think. You can reach me on twitter [@KiddBubu](https://twitter.com/KiddBubu).

Thanks to [Chiamaka Nwolisa](https://twitter.com/Mz_Chi) for reading through with her super editing powers.
