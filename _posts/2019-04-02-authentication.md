---
layout: post
title: "Authentication"
description: "Any time you think about authentication you think about username and passwords. "
comments: true
keywords: "authentication, tech"
published: false
---

Anytime you build an app and think about authentication, you think user name and password. You creeate a user model, attche an email & password field apply some default pre prescribed form of encryption to your password and lump it into your database. People really think about authentication in the perpective of where it is supposed to be used. In this post i want to explore how i think through building authentication systems depending on what the particular need of the app you are working on is. 

As important as authentications are, i try to relegate authentication to be performed by a service that is dedicated to the particular service. Auth0 & Firebase Authentication are examples of such good services. 

### Basic Do's and Dont't of Authentication

Email and Password for authentication should be what you resort to last. Only use emails and passwords if nothing else fits your particular needs. This is because when you ask people to create credentials of this type the probabiliy. Most people have a singular password they they use for all their services. The less tech savy a person is, the worse the case is. So it means if an attacker can get the password of a particular user, he can compromise any and every account the particular user as. 

### Use One time passwords(OTP) using phone numbers. 

##Use Authentication Systems. 

Most apps these days fall under a particular category





As much as email is a tool for communication, the average African sees email as a tool to activate the iOS device / Android Device and log into Facebook. Beyond that emails sit and collect dust. In these parts, people hardly read newsletters. This means if you are building an Africa facing product and see your email authentication as a way to remarket your product through some form of email marketting, your are going to be very dissspointed in your conversion rate. You will have a better chance with SMS. 

In Africa, there are more mobile phones than there are heads. Which means the average African is capable of receiving an SMS. This makes authentication using phonenumber my most favourite form of authentication. Because users have one less password to remeber and they are more likely to read your offers when it comes in the form of an SMS. For this you can use Twillio of Firebase.  