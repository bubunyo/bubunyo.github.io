---
layout: post
title: "Payment"
description: "A Sensible Node Express Api Architecture: Rocket Api"
comments: true
keywords: "devcongress, tech, meetup"
published: false
---

When you run a startup and need things to just work, you very easily and quickly become weary of new technologies. Because the old ones while the work alright and enough pain in the lower back side. When i first heard about flutter, my thoughs where, well google is trying to give dart one more shot before it dies. I didnt pay much mind to it. A few weeks ago Don Felker wrote this piece on why he thinks flutter might work. Having been a long time listener to the fragmented podcast, I knew if he though flutter would work, i owed his just a read. I was expecting much but the arguments made sense so i did the next thing and took flutter for a spin in that very weekend. To say my mind was blown will be to put is slightly and let me share a little bit about why. 

I started programming android in 2013. I was always trying to build an app and never really got good at it until 3 years later where i could comfortably call myself an android developer. If you have programmed android before you will know how resource intensive the whole experience it. You need a lot of ram. 8 gigs of memory will work but will leave you tearing your eyes out who you have to compile and run on an emulator. 

The problem with android. 

## 1. Android Studio

Android Studio is a Java behomoth that requires all the ram it can get. With 8 gigs of ram when you click on the android studio icon, it can take you from any where between 8 mins and 30 good mins before you can actually write code.

## 2. Gradle

The least said the better. God forbid you have to add a package to your poject, compiles will eat up everything from CPU to Memory and even battrey.

## 3. The Android Api

It still baffles me to this day that to be able to perform a network call you need a whole host of networking libraries. Anytime I ask this question somebody gives me a legitimate answer of some sort but it still remains, network calls are essential parts of almost any viable app, why doesnt the android framework include one originally. 

Loading images in android and extreme sport. When you do it by just loading resources from drawable, if the image is large enough, you get the almighty Out of Memory Exception throws. and to load one over the network is even more of an extreme sport. And for this simple tasks you also need and external libraries. If you need to do load libraries to do import and and mundane stuff, what the heck do you need the android framework for. 

## 4. It is not iOS

When you buil and android app, you are basically accepting the simple fact that you are only building an app for half of your market. For a long time, I have accepted this truth because there has never been a solution that builds for both platforms and came close to the performance gains like if you did natively for both platforms. React Native comes close, but that is also not without issues. 

# Enter Flutter

The first time I tried my hands on flutter my mind was blown. 

##1. Hot Reload

As an android engineer you quickly get used to the fact that after every single change you make you will need to wait about 30 to 45 seconds to see your changes reflected on a device. If you think it is a short time, try holding your breath for that long and you will know exactly how long that is. 

## 2. Everything is a widget

When everything becomes a widget it becomes extremely easy to know what is expected at each point and to pass everything around. 

##3. 

## 3. It runs everywhere

