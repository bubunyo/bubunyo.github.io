---
layout: post
title: "Golang style error handling in Javascript"
description: "Golang style error handling in Javascript"
comments: true
keywords: "devcongress, tech, ghana, error handling, golang exceptions, javascript, tech"
published: false
---

When I first learnt there was no  try-catch in golang, I was sceptical. What could be better than a simple try-catch block. I realized what glang had was way better for many reasons. In other for me to put my point  accross, lets first explore the anatomy of a typical try-catch block. 

A simple try catch block takes this form. 

```
try{
  /*
   *a block of code of code that is expected to throw an exception. 
   */
} catch(ex: ExceptionType){
  /*
   *handle the exception that you were expecting
   */
} finally() {
  /*
   * release resources that we held before exception was thrown. 
   */
}
```



The first part of a `try-catch` is the try block. Most of the expressions in a try block is used to acquire a volatile resources that is expected to throw an exception. When these exceptions are thrown, you handle them inside the catch block, which is the second part of the try-catch block. Once an exception has been handled in a catch block, the finally block and thrid part of the try-catch block preforms all operations, necessary to cover, close and or terminate resources, to avoid them leaking. Most people omit the finally block entirely, and go on to perform resource terminations after the entire try-catch block has completed execution. I am not entirely for or against this parterns because there are places where this makes sense and there are cases when it doesnt.

Most typical try blocks contain more than one expression that acquire different types of volatile resources. Which means if you have two expression of that nature, throwing exceptions of different types, you might need to account for the types and handle them differently inside the catch block. But different programming languages help handle this differently. 

The main difference is between strongly-typed and weakly typed languages. With strongly typed languages you can specify the type of the exception to catch and the rest is taken care of. 

In strongly-typed language like java you can have multiple catch blocks like this. 

```java
try{
  
    Obj1 obj1 = GetObj1(); // might throw Exception1
    Obj2 obj2 = GetObj2(obj1) // might throw Exception2
    // do something with obj2
      
} catch(Exception1 ex){
  
    // do whatever with ex of type Exception 1
  
} catch(Exception1 ex){
  
    // do whatever with ex of type Exception 2
  
}
```

You can even go as far as to condense multiple catch block into one like this. 

```java
...
  catch(Exception1 | Exception 2 ex){
    ...
  }
```

if you have different ways of handling the different exceptions you will have to check the type of the exception. So your catch block might end up like

```java
  ....
  catch(Exception1 | Exception 2 ex){
    if(ex instanceOf Exception1){
    // handle ex of type Exception1
    } else if (ex instanceOf Exception2) {
    // handle ex of type Excetpion2
    }
  }
```

Handling exceptions in weakly typed languages like javascript is closer to the catch block condensation above. Because there are no explicit types, you are forced to type check. 

The main problem with this for me is, how do you know which expressions are throwing what exceptions. If you run the program and an exception is not thrown how do you know what can throw.  The easy answer here is to add comments. But if you truely believe good code must explain itself, then this might not be an ideal answer. Another answer will be to have individual try-catch blocks for each throwable expression. Doing this litters your code with numerous try-catch blocks. This not only makes your code difficult to read, but really awful on the eyes. It will definitely not be beautiful. 

Another issue I have with this method is, it relegates error handling to the bottom. But this is a crucial part of the code and must be treated with the utmost importance. (I think error handling at the bottom of a function should be labled as an anti-pattern.)

The third issue I have with this is the mental toll it takes to understand this block. When you see a try block you instinctively know there is a catch block but you dont see that next. So you make a mental note to look at what the error handling case is. If the try block becomes long or easily meanders, you can easily loose that train of thought. If you are writing the code, the intution is the write the catch block first and then go up to deal with the try block. But this is not how you read code. If you read code like this, once you loose the catch train of thoughts, it makes the code more difficult to understand. 

Golang avoids this three problems entirely by handling errors/exceptions atomically. To put it simply, it is a more lovely form of the multiple try-catch block answer stated above. A typical error handling in golang looks like this. 

```golang
res, err := http.Get("http://example.com/")
if err != nil {
  // handle `err`
}
// do something with res
```

The first thing this pattern establishes is you know which singular expression can err, and you know exaclty how that is dealt with. Once you get this our of the way, you can deal with the real meat of the situation. As much as the error type is not expressly stated, you might not even need to know what that is. 

The second thing is, you are forced to think about errors as a first class situation. You are assured that ones something below this line is executed, everything above is fine. 

Thirdly, if typical try catch block composition involves handling exceptions first, why don't we entrench that pattern. This prvents the mental overhead necessary to keep track of what can throw. The mental impact of this is low. You get an error, you deal with it, you move on. Now, you can do other things. 

This might not seem like singnificant gains but as your code grows in length and complexity, you realize that these little wins, compound to make the work being done easier to think through and do.



My job these days at AF Radio involves writing javascript most of the time and I set out to create a pattern like this in our code base with some success. 

In our javascritp code base, most of the expressions that are expected to throw exceptions are promises and rightly so. Javascript help this with the catch block of a promise. A typical promise execution looks like this. 

```javascript
fetch("https://example.com")
    .then(res => {
      // do something with `res`
    })
    .catch(err => {
      // handle `err`
    });
```

I for one, am not a fan of this method of promise execution. It forces you to implement logic in then-blocks while making it difficult to read, This way also exhibits the three main issues with exception handling stated above and more. 

i prefer async-await, as they are much cleaner and easier to read. The fetch function above as an async-await will look like this. 

```javascript
const res = await fetch("https://example.com")
// do something with res.
```

When we wrap it in a try-catch it looks like this. 

```javascript
try{
  const res = await fetch("https://example.com")
  // do something with res.
} catch(ex){
  // handle exception here
}
```

In other to turn this simple try-catch expression into the go style error handling pattern I mentioned earlier,  I implemented a custom utitility fetch function. 

```javascript
async function fetchable(url){
  try {
    let res = await fetch(url);
    return [null, res];
  } catch (err) {
    return [err, null]
  }
}
```

To use this simple function you just easily call it like this.

```javascript
const [ex, res] = await fetchable("https://example.com");
if(ex){
  // handle exception.
}
// do something with res as it will exit
```

What essentially happens in this new function is, one of two objects are always returned and never both. If the `ex` is truthy, the `res` object will not exist, and vice versa. If the underlying function throws, it will be captured in `ex`. 

You can easily extend the `fetchable` function to take in more arguments. 

You can also implement a utitlity functon that takes in a promise and turns it into this golang style error handling pattern like this. 

```javascript
async function Executable(promise){
  try {
    let res = await promise();
    return [null, res];
  } catch (err) {
    return [err, null]
  }
}
```

You can easily use this function multiple times like this. 

```javascript
const [ex1, res] = await Executable(fetch("https://example.com"));
if(ex1){
  // handle exception.
}
// do something with res

const [ex2, data] = await Executable(db.query("SELECT * FROM USERS"));
if(ex2){
  // handle exception.
}
// do something with data
```

Whith this approach you know exactly what you are getting where. The straigth fowardness also helps in easily understanding how error cases are handled in expressions that can err, withour relagating them to the bottom. 

Let me know what you think. You can reach me on twitter [@KiddBubu](https://twitter.com/KiddBubu).

