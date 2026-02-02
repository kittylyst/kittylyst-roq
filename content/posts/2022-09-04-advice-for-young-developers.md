---
title: Advice For Young Developers
description: This post collects some of my thoughts about what skills a good entry-level developer needs, and the transition into being a professional software developer.
image: posts/blogpost3.jpg
layout: post
pubdate: 2022-09-04
tags: [career, advice, development]
author: kittylyst
---

This post collects some of my thoughts about what skills a good entry-level developer needs, and the transition into being a professional software developer.

This subject comes up extremely frequently, especially on forums such as Reddit, and there is a lot of bad advice out there.

In particular, new members of the software industry misunderstand the nature of software development - they see it as a fundamentally technical activity.
This may have been true once upon a time, but the last 25 years have seen two major trends:

* The advent of widespread use of the web and mobile devices with apps

* A massive increase in the complexity and capability of software systems

These trends have combined to make virtually any realistic application codebase, such as a new developer might work on, larger than any single person can completely understand.
Software development is therefore best understood as primarily a collaborative, human, and social activity that uses technical tools and abstract constructions.

The things that actually matter the most are rarely specific programming languages, but instead:

* General abstract reasoning

* Ability and desire to learn new things

* Communication skills (spoken and written)

* Ability to listen to, and understand, your teammates

* Being easy to get along and work with in a professional context

All of these are totally independent of language, and fortunately all can be taught.
They are also essential skills that will allow you to adapt to *any* new technology or stack that arrives in the future - they are a basic toolkit.

### But What About Actual Technical Skills?

If you insist.

There are certain tech skills that are not only transferrable between different tech stacks but that are basically evergreen: 

* Git

* Operating on the command line (i.e. Linux shell)

* Basic TCP/IP networking

* A working knowledge of application-layer protocols, such as HTTP

* SQL

* General modern dev practice, including CI/CD & TDD

In each of these, the aim is to build a foundational toolkit that can be applied to _anything_ that you might encounter in your career.

Let's take a look at each in turn:

Learn git _properly_ - if at all possible from the command line and not a graphical tool.
There's a free book - https://git-scm.com/book/en/v2 - which is OK, and very good value for its cover price.
Reading the whole book will take you a bit deeper into git than most developers manage, into at least the basics of the internals.
Understanding these aspects, and the data structures that git uses will pay off handsomely in the long run.
Personally, I very rarely use a graphical tool for Git.
I prefer to see exactly what's going on, and I have quite often dug colleagues out of problems they'd accidentally made by using a git GUI.

Operating in the Linux shell is of enormous help - because it ingrains the _how_ of the way the OS primitives operate.
Even Windows developers now have access to WSL (and I'm told Powershell is also extremely useful and based on similar ideas if you spend most of your time in the Windows environment).
Learning the low-level commands & understanding the nature of the basic Unix API of files, processes and sockets is the ultimate goal here.

The basics of TCP/IP (IPv4 is currently sufficient, but is steadily being replaced by IPv6, which is significantly more complicated) allows you to understand the layers of a network stack and *how* bits get from place to place.

Application-layer protocols, which is everything that runs above the network transport layer (e.g. TCP/IP) are of immense importance.
Writing in 2022, HTTP and the protocols built on top of it, are of immense importance, so you should understand how HTTP traffic actually works - to start with in theoretical outline.
As you will discover later on, this theoretical view is idealized and does not reflect the actual reality of how modern Internet systems operate, especially at scale.

One useful exercise is to be able to trace the steps involved when you type a URL into the address bar of your browser and press Enter.
(Spoiler: This question can be answered in an increasingly detailed manner as you consider the various layers that are involved).

Remember also that while HTTP-based protocols are extremely important, they are *not* the only game in town, and there are plenty of network protocols that are radically different from HTTP.

SQL remains the backbone of data query languages - although non-relational databases have gained in popularity in recent years, they have largely failed to live up to their initial hype and they have not succeeded in replacing the SQL-based relational database (RDBMS). In fact, the "NoSQL" databases have entered a period of consolidation where they are adding features and characteristics of traditional relational DBs - becoming "NotOnlySQL" databases.

In modern application development, our role does not end with "writing the code", or even with the writing of unit tests and documentation.
Instead, the build and deployment of applications has become a major part of current practice.
This is a side-effect of the complexification of modern applications.
It is therefore important that a developer quickly learns about build and deploy - including such topics as Continuous Integration (CI) and Continuous Deployment (CD).

As Cloud-based deployment is becoming the norm, packaging and deployment technologies for Cloud environments are currently important.
However, this is one area where there is still fairly rapid change - so this part of the technology space may not be as evergreen as the other areas discussed.

### Conclusions

Overall, the big benefit of learning these skills is that when you put the pieces together you can see the structure that makes systems work.
The fact that: 

* Linux shell pipelines are really a form of functional programming

* A big chunk of Unix I/O operations are atomic or almost-atomic

* git is really a clever form of a specific data structure

can be used as the building blocks for even-deeper understanding.

From a theoretical standpoint, then two books that I recommend every serious programmer buy are: Introduction to Algorithms by Cormen, Rivest et al. and Computer Architecture by Hennessey et al.
These are reasonably common University textbooks but are both of continuing usefulness to the working practitioner.

As a closing thought - Never be intimidated by jargon or unfamiliar concepts.
If the person talking to you cannot break their vision down into the fundamentals then they do not understand what they're selling either.

