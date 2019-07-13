---
layout: post
title: "Understanding Memory Leaks in Android"
description: "A Sensible Node Express Api Architecture: Rocket Api"
comments: true
keywords: "devcongress, tech, meetup"
published: false
---

> The key to learning is understanding - Unknown

Memory leaks are one of the most difficlt bugs to learn how to fix in android development. This largly stems from the fact that people dont really  understand what a memory leaks is and  why it occurs.

For newbies, the topic of memory leak can sometimes be a little bit difficult to understand because almost all the articles on Memory leaks are written by people who understand it properly and are suffering from the [curse of knowledge](https://en.wikipedia.org/wiki/Curse_of_knowledge).

In this essay i will try to explain the basic anatomy of a momory leak how to identify potential memory leaks and how to fix them. 

### What is a memory leak?

If you keep borrowing books from your local library without returning them, very soon, your library is going to run out of books to lend to you. Think of the books as memory blocks and the librarian as your operating system, in this case, android and you as the android app. In android the librarian has a maximum  amount of books that can lend to you.  If you are allowed to borrow only 10 books, when you come for the 11th one, he will tell you you he cant lend you a new book. That is he throwing an `OutOfMemory Exception`. In this case Out of Books Exception. The liberian knows there is something wrong with you and he is trying to bring your attention to it. In other for him to get their books back, he will need to kill you. So, when he kills you, your app crashes and all the books are retuned. But when you are an app and you can restart the whole process. 

###What leads to memory leaks in android

A typical android app should return all the memory it as finised using so that it can be reallocated. When Your app fails to do this, that is when your app throws an `Out Of Memory Exception`. Android runs on the Java Virtual Machine (JVM) and it has a Gabbage Collector (GC) that helps with returing all memory blocks that are done with. Using the library analogy with the JVM, the GC is the one who collectes the books when you dont return them. If the sign for you being finished with a book is you clossing the book, then the GC will not collect books if it is still open.

So how does the GC know exactly which memory blocks you are done with? In the JVM, the GC simply builds a tree of all the things you have refferenced from the starting point of your app. All the things that are in your memory block but are not in its tree are classified as dead objects. These are the ones it gabarge collects. 

### Should i care about a memory leak in my app? 

The surprising answer is no. The GC is smart enough to find objects that have leaked and can clean those app. The ones you should care about are the ones that are bad enough to cripple your app.  While an app runs, If the Android OS relizes it is comming short on memory for you, it dispatches a [Minor GC](https://plumbr.io/handbook/garbage-collection-in-java/minor-gc-major-gc-full-gc)  on a seperate thread that cleans up after you. When the GC runs, your application thread has to stop for about 4 milliseconds. This is refered to as [stop-the-world-pauses](https://en.wikipedia.org/wiki/Tracing_garbage_collection#Stop-the-world_vs._incremental_vs._concurrent)  These Minor GC run pauses are not long enough to hurt your app. But the more they run, the pauses compound and the less performant your app becomes. That is when apps begin to fill laggy and jumpy. If the Minor GC runs is still not abel to reclaim memory, a Major GC run occurs. Theses are more expensive and last for about 100 milliseconds. This is when your app becomes seriously larry and completely unusable. When this is still not able to reclaim memory, allocations continue to happen until there is no memory to give you app, and that is when the dreaded Out of Memory Exception occurs. 

### Common Memory Leak Scenarios and fixes. 

#####Culprit No.1 -  Listener Implementation.

Most memory leaks occur when listeners in your android apps are not unregistered. Listeners are used to easily defere execution of code blocks until something that takes a bit of time to execute happens. The two most common culprits in this case are `BroadCast Receivers` and the` LocationManagers`. These are system services that provide some feedback into your app. To use these resouces, you will haave to get it from the OS via the the android context most offen and pass an instance of an interface created in your activity to the services. If for some reason your app should close, the onDestroy method in your Activity lifecylce is called to assist the GC collect the memory that was allocated to that Activity. But because the Service is still running, and has a refference to the Activity, the GC thinks the activity is still in use and will not collect the activities memory blocks. When the activity is restrated, A whole new set of memory blocks are allocated to the new activity while the old one is still in memory. The memory allocated for the activity is leaking. The solution to this is rather simple. Anytime you registes some sort of listeners in you activity always immidiately go to the corresponding closing block to unregister it. 

##### Culprit No.2 - Inner Classes

Take a look at this piece of code 

```kotlin
class MyActivity:Activity() {
  
  private val result:TextView
  
  override fun onCreate(savedInstanceState:Bundle) {
    super.onCreate(savedInstanceState)
    
    setContentView(R.layout.layout_my_activity)
    mMessageView = findViewById(R.id.resultTextView)
    
    LongRunningTask().execute()
  
  }
  
  public inner class LongRunningTask:AsyncTask<Void, Void, String>() {
    
    protected fun doInBackground(vararg params:Void):String {
      Thread.sleep(500)
      return "We are back baby"
    }
    
    protected fun onPostExecute(result:String) {
      result.setText(result)
    }
  }
}
```

This is a simple activity that executes a long running task such as a database query or a network call and displays the result in a simple text view. Simple right? 

Not so much. If the screen is rotated while the LongRunningTask is still executing, the activity get destroyed, and the GC tries to clean the memroy, it wont be abel to do so because the LongRunningTask is still holds s strong reference to the Activity. If you want to create an instance of `LongRunningTask`, you can only do it by access it though `new MyActivity().LongRunningTask()`. Thus the creationg of an instance of  LongRunningTask is not possible until you create an instance of MyActivity. This is what is referend to as a strong reference. The solution to this is to make LongRunningTask static. But that will mean you cannot easily reference `result` TextView when the LongRunningTask finishes executing. Instead you should replace your `LongRunningTask` with an implementation that looks like this

```kotlin
private class LongRunningTask(result:TextView):AsyncTask<Void, Void, String?>() {
  private val resultViewReference:WeakReference<TextView>
  init{
    this.resultViewReference = WeakReference(result)
  }
  overide fun doInBackground(vararg params:Void):String? {
    val message:String? = null
    if (!isCancelled()){
      message = "We are really back baby!"
    }
    return message
  }
  overide fun onPostExecute(result:String?) {
    val view = resultViewReference.get()
    if (view != null)    {
      view.setText(result)
    }
  }
}
```

The `LongRunningTask` is started like this. 

```kotlin
LongRunningTask(result).execute()
```

What this does is create a weak reference to the `result` TextView. Making it easier for the GC to collect memory blocks when the activity is destroyed. 

##### Culprit No. 3 - Anonymous Classes



#####Culprit No.4 - Singletons

Singletons are largely not problems untill you pass a context object to it. Singletons are static objects that exist in memory while your app is alive from when it was started. If you instantiate a singleton object with an activity context, because the singleton exists in perpertuity, the context object being held makes it impossilbe for the memory blocks allocated to the activity to be garbage collected when the activity is destroyed. This solve this, you can instantiate singletons with an application context rather than an activity context. You can also implement a callback in the singleton to set the activity context to null and call it in  `onStop` of the Activity lifesycle methods. `onDestroy` [is not guaranteed to be called](https://developer.android.com/reference/android/app/Activity.html#onDestroy%28%29) 

##### Culprit No. 5 - Bitmaps

Every image you see on your screen is a Bitmap object. Bitmaps are quite heavy and when you dont properly deal with them, they will easily result in and OutOfMemory Exceptions. If you need to know exaclty how to handle bitmaps, this [article](https://developer.android.com/topic/performance/graphics/manage-memory) is a good starting point. Otherwise relegate this task to good image libraries such as [Picasso](https://square.github.io/picasso/) and [Glide](https://github.com/bumptech/glide) that do this for you efficiently. 

## Detecting Memory Leaks

Using the Android Studio Memory profiller 



## Summary

This might not be an exhaustive list of situations that will result in `OutOfMemory Exceptions`. To keep it simple when a a context based activity is being passed to an interface implementation, there is always a danger of memroy leaks. Always double check. 

