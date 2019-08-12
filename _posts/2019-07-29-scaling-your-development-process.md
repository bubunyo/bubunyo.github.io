---
layout: post
title: "Payment"
description: "A development process that scales."
comments: true
keywords: "devcongress, tech, meetup"
published: false
---

Every so often as app developers when we develop our apps, one question we constant try to answer is how will this app scale.  This is lead us to take some steps and measures to optimize our apps in the hope that when we get 5000 user on launch day, our severs dont go down. We rarely ever get 5,000 user on launch day. So if we build to handle traffic from 5,000 people, or 5,000 request per second it becomes premature optimisation. And what do they say about premature optimization? It is the root of all evil. 

One thing programmers often over look is how well their development process scales over time. I think rather than write you apps that scale from the get go, you should create a development process that scales from the get go. And why is why i think so. Through out the life of an existing applications, developers will make decission based on choices presented and depending on the choices made it leads down a particular path. As wonderful as the human brain is, one thing is for sure, you cannot bet on it to recollect all the small details that went into the taking of a particular decission. The reason for some decision transcends code. When your development process help convey the most important of this reasons in a way that makes it easy to comback to, pick up and continue, it relieves developers of the cognitive load in thinking through various decisions as you go along. The weight of this congnitive load breeds anxiety and anxiety begets decsions made without confidence, and people start to feel like shit. They start enjoying the whole experience less and general technical debt grows, in magnitude. This way of development is also way more expensive. When people feel like shit at their jobs they leave. When people leave you loose a chunk of time in going through the hiring process. Getting new people up to speed on a current project is a very expensive process, especially if a current process has knowledge gaps. New hires will have to constantly ask questions and depending on the number of questions they have and how early they get answered, it is all time ataken away from how early they can get productive. When you create a development process that scales, all things sort of fall in place and in the long term, it becomes very easy to optimize your app to scale as time goes on. It also way less expensive in terms of resources including development time, down time and time spent hiring new people. All of this translate to money for a business, but most importantly, people are happy at the work because the will enjoy it.

So what do i mean by creating a development process that scales.

Before i go on to explain what i mean by a development process that scales, I want to establish a few things. First and formost, the main focus of this post is to inform and advise on what to do at the early stage of your development cycle. From starting the project to just before there is more than 1 person working on it. That is not to say this cannot be applied to you if you have already started a project. You should bare in mind that, as time goes on. It because more expensive and difficult to change course, and cost is one of the things that should be balanced with all if this changes beacuase it can and might ultimately be the death of a business. But if you think you can absorb the cost of the change in your existing process, you are most welcome to do so. All the comments and advices in this post should be taken with your specific context in consideration because context is a huge factor in what makes the same decision right or wrong for 2 similar use cases. 

Now lets talk about what i mean by creating a development process that scales. 

When you build version 1 of your app to handle 5000 request per second, that is not what i term a scallable develpment process. Here are a few characteristics of a development process that scales. How these characteristics apply to your project signifies how scallable your development process is. I dont view scallability of the development process as a binary parameter. You do or do not have a scallable development process. I view the scalability of you process as a spectrum when your try to optimize your process to increase the scalability parameter. 

1. When new team members are added to the project, the where to find resources, how to change resources and what resources are doing is easy. The time it takes for new team members to start making meaningful contributions to the whole project remains inversly proportional to the scalability of your development process. Because developers are expensive and the less time they spend understanding the system, the earlier you can get your monies worth. Yes, there are systems so huge that it takes months to understand the whole thing before you can make a contribution. But that is outside the scope of this post. 
2. The next major telling factor in how scallable your process is how easily you can refactor and deploy changes without worry about issues that regress. Is your confidence level in how well the changes stick high enough that you can deploy on a friday night? This is what i call the friday deploy confidence factor. If the last thing you do on a friday before you go out for drinks with friends on a friday is deployment of a new feature, How convidence are you that it will stick. The anxiety deployments come with is bad enough, and to deploy on a friday makes is worse enough. No matter how high your friday deploy confidence is, please dont deploy on a friday. Go out, have some drinks and enjoy life. 
3. Another telling factor which determines how scallable your process is how easily you can swith out a component of your app and replace it with equivalient systems and trust that it will all come together nicely. A typical example is payments. If your business lead should succeed in negotiating better payment terms with a deifferent payment partner, how easily and early can you switch to the new systems, knowing very well, the apis will be different. The way you answer this tells alot about how your entire sytem comes together. Other components that you should be able to switch out include, loggers, caching layers amongs a few. 
4. If you have a very scalable development process, one thing that tells is how much confidence you have in letting juniors contribute to and entire system knowing that you have processes in place to catch them when they messup. Juniors messup up. It is the God given right to. It is the only way they will learn. For a lot of people without a scallable development process, they give juniors mundane tasks to perform and slowly watch as they work to know exactly how ready they are to do the big stuff. If you have to watch them perform before you give them meaningful tasks, you are most likely doing something wrong. This is because you watch them because you are sure if they goof up, your systems, will most likely come crushing. and the trust element is put in the human beings. But humans err, and if you dont have  checks to catch potential errs, some one will most likely err and more often more than once. 
5. As fallible creatures, we will most definitely err. And when we do, how early we are in noticing, replicating, understanding, fixing and deploying patches is a key factor in how our development process scales. If a single request crashes your app, does the whole system come down with it? Do you have sytems in place that notify you of crashes before users call you to tell you your app is crushing? In this particular case being proactive about it prevents being caught by surprise and having to drop all you are doing unexpectedly. Also the longer you stay down, the more money you loose. 

This list is by no means exhaustive, but one idea I am trying to put across is that, your whole process should be one of proactiveness rather than being a reactive one. Being proactive gives you the advantage of planning out how you approach issues. Unlike when you are reactive, where you do things base on issues that spring up. When you are proactive, you are easily able to determine cost for each process, and execute in a manner that makes in most importantly enjoyable. 

Now that we know what it means to have a development process that scales, lets talk about a few strategies that can be used to increase the scallability of your development process. 

### 1. Spend alot of time on your archetecture

The architecture of your application is one of the most crucial aspects of your application. Get it right and everything feels like magic. Get it wrong and you dread making changes to your app. I cannot over emphasize the importance of getting this particular step right. In the past, I have spent close to a week on deciding what the architecture for a project should be, gone on to test it to see if it is right. If you do use a frame work like laravel or rails, these components come with a predefined architecture, and changing it means more pain than it is worth. For non-opinionated framworks like expressjs, you will have to spend considerable more time in thinking through how you structure your folder structure naming conventions and how you send messages accross componets. How do you know you have a good archetecture? I am tempted to say "it makes sense" but unfortunately that phrase doesnt mean the same thing to everyone. The next is how data flows through your app. When you architecture is setup properly, data flows in a top down/approach. Side effects are controlled into easy to determine sinks and are deterministics. Errors are propageted at the right level with enough information to know exaclty what went wrong and most importantly where. It is so efficient that when you see and error, without a lot of context you know exatly which component is failing and they enough reason for developers to know why, but it is vague enough for the majority of bad actors to now understand what it means. one successful strategy used for error propagation in a good architecture is to have error codes and a reference for what the codes mean. This way when an error code is received you can check the reference and know exactly what is wrong. I think there are two main kinds of architectures, if you ask me and the architecture should be decided by how data flows through a system, weather its is data driven like in websites apps, or event driven like in mobile apps. For more info on architectures, you can refer to [this](https://techbeacon.com/app-dev-testing/top-5-software-architecture-patterns-how-make-right-choice) article. I cannot tell you how to build the right architecture or if your architecture is right, but as time goes on, with a little bit of experience, you will know. 

### 3. Maintaining Environments

Enivironments are logically issolated instance of space in which exact versions of you app will run. Most developers maintain a development environment and a production environment, obviously because you can not develop on the machine that serves users/customers. One critical ommision people make is understating the importance of a staging environment. And even if they do, they set it up wrong. Staging is 

### 4. Maintaining Automated Pipelines for version deliveries.

Setup a pipeline that makes it impossible to deliver a new version of your code to production witout delivering it on a staging environment. 



### 5. Preserving the sanctity of databases

Databases will hold all the data for your business. As such maintaining the integrity of your database is a huge factor in how you can easyly make changes in the future. On maintianing the integrity of your database, there are two main rules you should apply, and they will apply mainly to SQL type of databases. They will also apply to NoSQL type of databases where the rules apply. The first rule of thumb is; Create a migration document and keep it holy. If you dont know what a migration is; it is basically a document or a set or documents that preserves the current state of you database. Migrations dont store data. They store state. This makes it easy for new members of a team to easy run that and get their databases up to date on all associated tables that have been created. I have often seen people skip the creation of migrations and go directly to edit databases. STOP IT!!!. And it you are on a team that allows this. The early you leave, the better you will sleep at night. Some frameworks such as Rails and Laravel help you easily deal with migrations. If your setup does not have a migration setup, stop what ever you are doing and create one. If you dont know how to go about it, talk to some senior developers in your team or community. If you have access ot none of those, developers are DevCongress are more than happy to help. 

The second rule of thumbs: connect a single app to a single database. As requirements for an app grows, sometimes it becomes neccessary to seperate some of them into an their own entire app seperately. A typical example in have client apps, and administrative apps. Sometimes we are tempted to connect both to the same database because well, they are both feeding off data from the same source. This is a simple solution that well easily come down to bite you in the future. With two apps, concerns are easily treated as two entirely seperate concerns and when they diverge, that is when the issues start. Features are easily added to the database with one app in context and when context it switched you have to do the hard work of dealing with the side effects of this concern. That is when you start to add features in code in your app that have nothing to do with new features but dealing with the side effects of one app. The congnitive load involved in dealing with a side effect in one app from another app is not worth two seperate apps talking to the same database. This is time spent away from building new and exciting features. 

Another huge issue with have two apps connected to the database has to do with security. Image having two taps connected to a barrel of water. You constantly have to monitor two taps for the flow of water. And when there a leak you have to do the extra work of figure out which of the two taps is causing the leaks.  In the case of database, its a lot worse because we store a lot of sensitive data too.

If you need to consume data from a second, implement an api interface through which you can consume data. This way you can controll exactly how and to whom data flows from your database. This improves security and improves the way you work forward. 

###6. Measure, profile and track. 

start out with platforms as a service. never deploy on aws ecs. take advantage of scaling parameters. 

write test. 

Every package that is added should be vetted. 

You most likely dont need a microservice. If you can start with a monolith. 

dont try and catch everything. 

once you start growing on infrastructure, use terraform. 

code code review. 

be weary of new technologies. use tried and tested and old. technologies. 

Understand constraints before you build a new feature. 

use todo's and only fix items on the todos. 

pick the right language. 

use linters and lint checks. 

avoid callbacks. 

Asways to a postmortem. 