---
layout: post
title: "Payment"
description: "How I migrated my database from Mongo DB to Postgres with zero down time"
comments: true
keywords: "devcongress, tech, meetup"
published: false
---

Yes.
It was scary
But, I did it. 
And i succeeded.

The idea if simple porting your production database from one system to another can be down right freightning to the point that people prefer to outsource the process and blame to external contractors. At AF Radio i go to a point where I had to do this is i wanted to sleep properly at night, but with hundreds of megabytes of data that were being querried at at least 12 times per second, and a 1 man team to excute this daunting task, there was no room for failure or down time. 

### Background

I have been writing code seriously for a little over 4 years. Like many of us I started with PHP-MySql. It was like the unspoken entry level stack for newbies. While it was fun while it lasted PHP scarred me, emotionally. I quickly jumped onto Android. As much as java was verbose, it did exactly what it had to do and more more. I can not whole heartedly say same for PHP. I became good at it. Then i switched to Ruby on Rails. Rails was fun. Convention over configuration made everything predictable, easy to learn and easy to find a solution when you were stuck. Postgres was like the unspoken database for rails. I picked that up. With a background in MySQL, there was not a lot that was different. But as time went on i soon realised it edged over MySQL in little places. It was less confusing. It had a single engine if it has any engines. I was thrown into the javascript pool at the deep end. I was stuck with a project and with very little JS knowledge, I had to make it work. My ideology was simple. I know the basic constructs of programming. Just apply it to JS just as i did the Ruby. The project i inherited came with MongoDB. I quickly grew to love it. There were no query statements, no constraints, no restrictions, and all the free reigns. There was even a time I believed there was no database superior to MongoDB. Then it all came crushing down. 

### How I ended up with a MongoDB Monster.

As time went on, the project I inherited grew phenomenally. From a single request every 3 hours to about 12 requests per second. The first problem with mongo db started to creep out. At 12 request per second, we were querying and returning large data sets and there was a problem; the result was never consistent. The same same queries were returning very different results, and for the life of me i could never figure out why. Up until now. This was a major problem, but at the particular moment, we could live with the inconsistencies. 

Feature developments were scaling inversely to the growth of my app. Because there were no tests, every new update was a different battle on its own. Very few people could contribute because with every new feature that was introduced, 2 others broke. It was a battle to contain those bug fixes on it own. And as in the lifetime of most app and entire app re-write was upon us. I had learnt from my past mistakes. Now I would do it better. In the new re-write, the single thing I was going to get right without compromise was app architecture that made it possible to easily test and make it easy for new developers to jump in and be productive as early as possible. 

With the new re-write we decided to stick with Mongo DB. As much as we were having issues, there were not major yet. We were also familiar with mongo db and we envisioned it would shorten the app development time.

### The process

When i realized i needed to port my database i needed a way to check if my data set was working effectively. The solution that came to mind was tests. I had never written tests, and inbetween TDD and unit tests, i didnt know which tests to write or how. So i did some research and i realized what i needed was integration tests. I settled on this for a few reasons. At the end of the day, an api, is a complicated abstraction to an underlying database. So in other to know if my migration had worked in needed to check if the data inserted into the database was the same thing i was getting in the api result. I did it first with MongoDB as my database so that if all tests, passed porting over to postgres will let me know what i was getting wrong by the tests that were failing. This is a key step in the process. My tests were simple and they followed this simple process. 

1. Clean the database. 
2. Setup - Insert data into data base using database api. eg. `User.create({ name: "Jon Snow"})`
3. Query data through Api endpoints in tests.
4. Asert that the payload being returned what the critical keys and critical values. 

I spent the next week writing this same test for all my endpoints. I also wrote test for failure points; what error messages i was to receive if i put in wrong data through the api. 

Once all my test were green, I now actually had to switch out the underlying database system from MongoDB to Postgres. With Mongodb i was using the mongoos