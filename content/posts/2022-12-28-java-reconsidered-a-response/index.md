---
title: Java Reconsidered - A Response
description: A response to a blog post about relearning Java, discussing Java's performance characteristics and design choices.
image: blogpostW.jpg
layout: default
pubdate: 2022-12-28
tags: [java, performance, opinion]
author: kittylyst
---

I recently read this blog post (https://foo.zone/gemfeed/2022-12-24-ultrarelearning-java-my-takeaways.html) which was sparked from this discussion on Mastodon (...).

It piqued my interest for several reasons, but one of them that is perhaps notable is because (as some of you may not know) my first jobs as a professional programmer were writing Perl (and C) backends for websites. Yes, readers who are younger than ~25 years old - I was writing websites in C before you were born.

Perl was the 3rd (or 4th?) language that I learned properly, and it paid my bills for many years. It is rather forgotten and disregarded now, but it was - once upon a time - the new hotness.

This is the way / So it goes / Sic transit gloria mundi.

Perl, like Java, had much to recommend it and also contained many design choices that made sense at the time, but which did not stand the test of time.

What attracted me to Perl, as later with Java, was the people. 

I keep in contact 

### A Weird Version of Java

Despite being written in Dec 2022, the version that was evaluated was Java 18 - a version that is just as unsupported as Perl 5.10 (the last one that I seriously wrote in)

### Performance, and Parallel Streams in Particular

Folks that aren't familiar with Java and its underbelly may not know

1. Java Performance is fundamentally different to languages like C / C++ / Rust
2. Java cosplays as a compiled language (b/c it has javac) but is actually much closer to Smalltalk or Perl - in some regards - which does not include its approach to OO, btw
3. The above 2 things mean that "evaluating the performance" of a small amount of Java code essentially tells you nothing about the overall impact of it, due to inlining and other sophisticated behaviours of the JIT compiler.

Parallel streams look like free money, and in isolated benchmarks they seem to show that.

However, by default, they use a shared threadpool to achieve the "magic speedup".

This means that threadpool is a contended resource.

So, even if your code is scrupulous about its use of it - what about the rest of the application? What about the libraries that you depend upon?

None of that usage will show up in an isolated benchmark - and how would you even audit it?

The first rule of performance 

