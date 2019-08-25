---
layout: post
title: "A scalable development process - Part 1"
description: "A scalable development process - Part 1"
comments: true
keywords: "devcongress, tech, meetup, scaling, scalable development process"
published: false
---

Every so often when we build apps, one question we constantly try to answer is "How will this app scale?".  This leads us to take some steps and measures to optimize our apps in the hope that when we get 5,000 users on launch day or 5,000 api request per second on launch day, and our servers dont go down. Unless you operate at the scale of Google or Facebook, you will not get 5,000 user on launch day. So if you build to handle traffic from 5,000 people or 5,000 requests per second it becomes premature optimization. And in the words of Donald Knuth himself, [premature optimization? It is the root of all evil.](https://en.wikiquote.org/wiki/Donald_Knuth)

One thing programmers often overlook is how well their development process scales over time. I think rather than write your apps to scale from the get go, you should create a development process that scales. Throughout the life of an existing application, we make decisions based on choices presented with a singular context in mind. The choices made with said context will lead down a particular development path that becomes a part of "the architecture". 

As wonderful as the human brain is, one thing is for sure; we cannot recollect every single detail that went into the making of a particular decision. The reason for some decisions transcend code. When your development process helps convey the most important reasons in a way that makes it easy to comback to, pick up and continue, it relieves developers of the cognitive load in thinking through various decisions as you go along. The weight of this cognitive load breeds anxiety and anxiety begets decisions made without confidence, and that is when people start to feel like shit. They start disliking the development experience and the bad decisions may result in the increase of general technical debt. 

This way of development is also way more expensive. When people feel like shit at their jobs they leave. When people leave, you lose a chunk of time going through the hiring process. Getting new people up to speed on a current project is a very expensive process, especially if the current process has knowledge gaps. New hires will have to constantly ask questions and depending on the number of questions they have and how early they get answered, it is all time taken away from immediate productivity. When you create a development process that scales, all things sort of fall in place and in the long term, it becomes very easy to optimize your app to scale. It also way less expensive in terms of resources including development time, down time and time spent hiring new people. All of this translates to money for a business but most importantly, people are happy at work because they will enjoy it.

So what do I mean by creating a development process that scales.

Before I go on to explain what I mean by a "development process that scales", I want to establish. 

The main focus of this series of posts is to inform and advise developers on what to do at the early stages of their development cycle. From starting the project to just before there is more than 1 person working on it. That is not to say this cannot be applied to you if you have already started a project. You should bear in mind that as time goes on. It becomes more expensive and difficult to change course. But if you think you can absorb the cost of the change in your existing process, you are most welcome to do so. All the comments and advice in this post should be taken with your specific context in consideration because context is a huge factor in what makes the same decision right or wrong for 2 similar use cases. 


When you build version 1 of your app to handle 5000 requests per second, that is not what I term a scalable development process. 

Here are a few characteristics of a development process that scales. How these characteristics apply to your project signifies how scalable your development process is. I dont view scalability of the development process as a binary parameter. I view the scalability of your process as a spectrum when your trying to optimize your process to increase the scalability parameter. 

1. When new team members are added to the project, the where to find resources, how to change resources and what resources are doing is easy. The time it takes for new team members to start making meaningful contributions to the whole project remains inversely proportional to the scalability of your development process. Because developers are expensive and the less time they spend understanding the system, the earlier you can get your monies worth. Yes, there are systems so huge that it takes months to understand the whole thing before you can make a contribution. But that is outside the scope of this post.

2. The next major telling factor in how scalable your process is how easily you can refactor and deploy changes without worrying about issues that regress? Are you confident enough in your changes that you can deploy on a friday night? This is what I call the friday deploy confidence factor. If the last thing you do on a friday before you go out for drinks with friends is the deployment of a new feature, how confident are you that it will stick. The anxiety deployment comes with is bad enough, and to deploy on a friday makes it worse enough. No matter how high your friday deploy confidence is, please dont deploy on a friday. Go out, have some drinks and enjoy life.

3. Another telling factor which determines how scalable your process is how easily you can switch out a component of your app and replace it with equivalent systems and trust that it will all come together nicely. A typical example is Payments. If your business succeeds in negotiating better payment terms with a different payment partner, how quickly can you switch to the new systems, knowing very well that the APIs will be different. The way you answer this tells alot about how your entire system comes together. Other components that you should be able to switch out include, loggers, caching layers amongst a few.

4. If you have a very scalable development process, one thing that tells is how much confidence you have in letting juniors contribute to an entire system knowing that you have processes in place to catch them when they messup. Juniors messup up. It is the God given right to. It is the only way they will learn. For a lot of people without a scalable development process, they give juniors mundane tasks to perform and slowly watch as they work, to gauge their readiness to take on the big stuff. If you have to watch them perform before you give them meaningful tasks, you are most likely doing something wrong. This is because you watch them because you are sure if they goof up, your systems, will most likely come crushing. and the trust element is put in the human beings. But humans err, and if you dont have checks to catch potential errs, someone will.

5. When mistakes are made, how early we are in noticing, replicating, understanding, fixing and deploying patches is a key factor in how our development process scales. If a single request crashes your app, does the whole system come down with it? Do you have systems in place that notify you of crashes before users report them? In this particular case, being proactive prevents being caught by surprise and having to drop all you are doing unexpectedly. Also the longer you stay down, the more money you lose. 

This list is by no means exhaustive, but one idea I am trying to put across is that your whole process should be one of proactiveness rather than a reactive one. Being proactive gives you the advantage of planning out how you approach issues. When you are reactive, you do things based on issues that spring up. When you are proactive, you are able to determine the cost for each process and execute in a manner that makes it enjoyable. 

Essentially this is a series on things that reduce the cognitive load on developers, that way they have increased confidence in what they are working on and can deliver faster. In the end you should employ strategies that alleviate the cognitive load on your developers. 

Now that we know what it means to have a development process that scales, we can talk about some strategies you can use to increase the scalability of your development process in no particular order. 

