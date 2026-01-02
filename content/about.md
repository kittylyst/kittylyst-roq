---
layout: default
title: About
description: |
  Roq is a powerful static site generator that combines the best features of tools like Jekyll and Hugo, but within the Java ecosystem. It offers a modern approach with Quarkus at its core, requiring zero configuration to get started —ideal for developers who want to jump right in, while still being flexible enough for advanced users to hook into Java for deeper customization.
---

# About Roq

Roq is a powerful static site generator that combines the best features of tools like Jekyll and Hugo, but within the Java ecosystem. It offers a modern approach with Quarkus at its core, requiring zero configuration to get started —ideal for developers who want to jump right in, while still being flexible enough for advanced users to hook into Java for deeper customization.

## Authors


<div class="authors">
  <!-- layout: :theme/page -->
  <!-- authors.yml is in the data/ -->
  {#for id in cdi:authors.fields}
    {#let author=cdi:authors.get(id)}
  {/for}
</div>

