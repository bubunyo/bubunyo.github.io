---
layout: post
title: "How to not build your application"
description: "how to build your application"
comments: true
keywords: "how to build your application, startup, ghana"
published: true
---

Every now and then i get asked by brilliant people to help them test their products, and most of the time I leave those encounter feeling less enthusiastic about using the product or service than I was before I came into the meeting. Yes your idea is good, I want to use your product but does your product do what you say it does? Most of the time it doesn't. Here are a few tips on what to do and what not to to do for creating your first product based on my short experience doing so.

#### Build Version 1 before Version 100

As simple as this statement is, a lot of people make this critical mistake. People want to release a product that is fully baked as an initial version. This leads to a lot of assumptions about what users want, leading to features, nobody needs. I think the first version of your product should do one thing and one thing only; doing exactly what your value proposition says. If your value proposition is helping people easily file tax returns to save them time and money, you have no business building a feature that shows them how they spent their money over a year. When you are successful in helping people properly file their tax returns, then you can take up other features based on the usage patterns.

#### Version 1 shouldn’t take longer than 1 month to build.

The first iteration of you product should never take more than a month to build even if its one man doing all the work. If it does, you are probably doing it wrong. Unless you are building yet another payment platform, then you have your work cut out for you. But there are 5001 other payment platforms, what are you building that the others have not. I digress. This point ties itself to the initial point i made. You initial application should not do anything beyond what your value proposition says. If it does, perharp, you don’t properly understand what you are doing in the market you are in.

#### Listen to your users. But don’t build features they request.

> It’s really hard to design products by focus groups. A lot of times, people don’t know what they want until you show it to them. — **Steve Jobs**

If there is one thing users are good for it is identifying what the problem is. But when it comes to solutions, they are the last people you should listen to. This is because the kind of solutions users propose is biased towards the experience they have, and lack the nuance required to optimally solve a particular problem of this nature. I experienced this when I built an inventory system for a client some time ago. On the page on which I listed all his inventory, the content on the page was paginated. It was a no brainer. But he called me later and demanded the pagination be removed and instead, have about all 100 plus listed on a single page. I asked why he wanted it that way and he told me so that when he scrolls to the bottom of the screen he can know exactly how many items he has based on the number of the last item. I just easily added this number to top of the screen and he admitted it was a better solution.

#### Outsource all the parts of your app you can to services.

Part of getting your product out the door within the first month is knowing exaclty what to build and what not to build. Saying you don't trust a particular service is a sign of amateur hour. Use [cloudinary](https://cloudinary.com) to handle file uploads. Remove the complications with setting up an s3 bucket, keys and the unnecessary complications you will have to deal with.

You have no business implementing search in your app. Use [Algolia](https://www.algolia.com). if you dont, chances are you are going to do it wrong and it can cripple your app. Yes search is that difficult. Do you need login, use Facebook Login, Github login, LinkedIn Login, even Snapchat login. One less password to remember is good for the planet.

#### Use UI frameworks

When i talk to people, in their bid to build something that looks unique, they spend eons writing styling rules that don't have any bearing on the solution they are about to offer. Dont spend anytime on figuring out the right shade of blue. It doesnt have to be too pretty. It just has to be functional. Having a unique design is not part of your value proposition. If it is, you are doing it wrong. What happens when the next person out designs you. It is for this reason ui frameworks were created. They contain commonly used components and you can easily come up with a beautiful product just by putting together a few of these components. Some popular ui frameworks include [semactic-ui](https://semantic-ui.com), [bootstrap](https://getbootstrap.com), [UI-kit](https://getuikit.com) and [Cube UI](https://didi.github.io/cube-ui/#/en-US). Some people on the internet took their time to put them together. Take advantage of them and thank them.

#### If the answer to why you are building a feature starts with “I think the user would like to…”, dont build it.

Even when you build solutions to solve your own problems, the time you spend on your project makes you loose sight of everything else in your peripherials. You are then no more the user. You dont know what the user thinks. Get your product out the door and let the real user decide if what you think the user is thinking is actually what the user is thinking.

#### You dont have scaling issues. Dont build to scale.

Another common theme amongst first time product creators is the misconception that you need to build with scaling in mind. Scaling is an issue you cannot simply build for when you have never had the experience. If you are not google your initial product will not get to the intial scale your are thinking. Thinking this way only leads to complicating what your are building, which might sometimes result in your app never making it out the door in the first place. All want to achieve scale. Few people achieve scale, and when you do thank the stars. But by the time you do you will have the resources necessary to solve your scaling issues, and even if you don't, there will be people willing to throw resources your way to solve this problem.

#### Tech is not your solution. Tech scales your solution.

[After evaluating the problem you are going to solve and deciding what you are going to build](https://medium.com/@bubunyo/take-a-step-back-grow-up-for-a-second-a12548a8a8a8), most first time founders get easily confused about the role of tech in the business they are going to try to build. Unless you business is an encryption algorithm, facial recognition software or a machine learning module built on the blockchain that takes advantage of sever-less cloud infrastructure then there is a good chance your solution can stand without the tech. How do you know this? Think through you product and you will realise that without tech you can also provide the same solutions as you would with the tech, though it might be slow and painful. Eg. Payments. The basics of payments involves taking money from one person and giving it to the other. If you make the physical journeys to fulfil this request, you are solving the same problems. This is only one example but I implore you to think about what your solution is and how you are using tech to optimise the delivery of that solution. This helps you understand which part of our product to abstract with [doing things that dont scale.](http://paulgraham.com/ds.html)

#### Track everything, and create funnels from your tracking data

In my opinion this is the only way through which you should build features. Everything that can be clicked on should be tracked, along with contextual data. Mixpanel is a good place that can help you start this. Events in google analytics is also a good. Tracking events in your app should be in place from day 1. This will help you figure out the most performed actions, the number of steps people take to perform particular actions and where people are dropping off when they are performing an action. This informs you on how you can easily optimise for frequently used features and make you app better.

------

This is by no means an exhaustive or holistic approach to building the first version of your applications, but this is a very good starting point. Take into consideration what you are building and for who, and let it influence your decisions. At the end of the day all I am saying is, try to significantly reduce the amount of work you need to do to get your app out the door, because getting it out is the only true litmus test of your idea.

If you have any other thoughts or ideas on this subject please feel free to share them on twitter. You can find me [@kiddbubu](https://twitter.com/kiddbubu)

**Thanks** to [Andrew Smith](https://twitter.com/silentworks) and [Yaw Boakye](https://twitter.com/ejnbo) all of [DevCongress](https://twitter.com/DevCongress) for reading through this and suggesting edits.