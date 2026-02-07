---
title: The Well Grounded Java Developer 2nd Edition Has Been Published
description: A big announcement today - the 2nd Edition of my very first book, "The Well-Grounded Java Developer" has been published.
image: posts/library-book-stacks.jpg
layout: post
pubdate: 2022-11-20
tags: [books, java, announcement]
author: kittylyst
---

A big announcement today - the 2nd Edition of my very first book, "The Well-Grounded Java Developer" has been published.
The book is all about helping developers to move from the "middle tier" to the top level! 

[More Info About The Book & Buy With A Discount](https://www.manning.com/books/the-well-grounded-java-developer-second-edition?utm_source=kittylyst&utm_medium=affiliate&utm_campaign=book_evans2_wellgrounded_12_8_20&a_aid=kittylyst&a_bid=d07f0670)

The first edition of this book started life (over 10 years ago) as a set of training notes written for new developers joining the foreign exchange (FX) department of a bank.
I looked at the existing books on the market and found a lack of up-to-date material aimed at Java developers who wanted to level up.
As a result, partway through writing the training material, I found I was writing that missing book

The original title was suggested by the publisher, who was riffing on an existing book - "The Well-Grounded Rubyist".

### What's in the book?

There are 5 parts to the book:

1. From 8 to 11 to 17
2. Under the Hood (bytecode, concurrency fundamentals, performance)
3. Non-Java Languages on the JVM
4. Build and Deployment
5. New Frontiers (advanced functional programming, advanced concurrency)

While the book aims to provide an overview, and a starting point for your further explorations, lots of the material in Part 5 (in particular) expects that you've understood Parts 2 and 3.
It isn't strictly necessary to read it cover to cover, but there is some flow and connection between the parts that may not be obvious in the Table of Contents.

Two major themes are concurrency and functional programming (FP).

The book covers both concurrency APIs that Java has - the low-level / "classic" / 1.0 API (Thread & the language-level primitives like synchronized) and the "new" java.util.concurrent API (since Java 5).
We also cover newer innovations such as CompleteableFuture, which is similar to a Promise in other languages.
Also the Fork/Join framework and some discussion of some different techniques used in the non-Java languages (e.g. Kotlin coroutines).

FP is discussed in several different ways - we assume that the reader is familiar with Java 8 lambdas and streams (although we include a recap in an Appendix, just in case).
The new FP-related Java 17 language features (such as Sealed Types and Switch Expressions) are discussed early on, and when we meet the non-Java languages (Kotlin and Clojure), we look in detail at how those languages approach FP.

In Part 5, we move beyond the "slightly functional" style of map-filter-reduce that Java 8 introduced and consider what we mean by FP.
We then discuss how functional a language Java really is, and introduce some new concepts, as well as some interesting functional techniques used by Kotlin and Clojure that have no real parallel in Java.

### Why Read The Book?

A question we have been asked is: "In the modern era, what differentiates your book in comparison with the ton of information on the Internet and in other Java books?"

It's a fair question.

I believe that becoming a better programmer is not about learning disconnected facts and snippets of knowledge.
To truly level up, you need to understand the deeper connections between aspects of what you already know - and the things that move you beyond where you are now.

The book tries to do this - by building on foundations, to talk about deep topics that matter - concurrency and functional programming in particular.
We also use non-Java languages - Kotlin and Clojure - to help you understand different viewpoints on these topics - which will make you a better programmer in any language that you choose to program in.

[More Info About The Book & Buy With A Discount](https://www.manning.com/books/the-well-grounded-java-developer-second-edition?utm_source=kittylyst&utm_medium=affiliate&utm_campaign=book_evans2_wellgrounded_12_8_20&a_aid=kittylyst&a_bid=d07f0670)

