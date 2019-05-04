---
layout: post
title: "Payment"
description: "A Sensible Node Express Api Architecture: Rocket Api"
comments: true
keywords: "devcongress, tech, meetup"
published: false
---

When you learn to build webapps, it teaches you to value convention over configuration. And it is for the very reason amongst other that makes rails a popular choice. Convention over configuration means you spend very little time thinking about where you put your code and more time actually writting the code. It also means, for new developers who join your team, the learning curve is extremely short because everything is where it is expected to be. 

The same cannot be said for any js framework, include express api. When we started to rewrite the backed api at AF Radio, we spent a long time iterating between folder and file architecture that we thaough was going to make sense. These are a key key priorites we had and how we strutured our folder and file system to solve these problems. , 

1. Keeping relevant and related logic in the same place. The key advantage for us was to be abel to work on different multiple subsystems without necessarily cause a huge merge confict. Team members could be assinged work in subsystems and all of it would fit nicely. 
2. Test files should not be far from the files they are testing. 
3. It should be intuitive. 