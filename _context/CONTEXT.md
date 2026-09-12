# Project Context: kittylyst-roq

## What this project is
Personal website for **Ben Evans** (kittylyst.com), built as a static site using **Quarkus + Roq** (a Quarkus-based SSG). It replaced an older Gatsby/React site. Content is authored in HTML fragments or Markdown with YAML front matter; pages are rendered via Qute templates; CSS is handled by Tailwind (via the Quarkus Web Bundler).

## Technology stack
| Layer | Technology | Version |
|---|---|---|
| Language | Java | 21 |
| Framework | Quarkus | 3.36.3 |
| SSG plugin | quarkus-roq | 2.1.4 |
| Web bundler | quarkus-web-bundler + tailwindcss | 2.3.2 |
| Tagging | quarkus-roq-plugin-tagging | 2.1.4 |
| Template engine | Qute | (Quarkus built-in) |
| Build tool | Maven (mvnw wrapper) | |
| Hosting | Netlify (deployed via GitHub Actions) | |

## Repository layout
```
content/            # All site pages and collection documents
  articles/         # 100+ markdown articles (published writing)
  books/            # 8 HTML book pages
  videos/           # 27 HTML video pages
  posts/            # Blog posts (HTML with front matter)
  upcoming/         # Upcoming events/talks (HTML with front matter)
  *.html            # Top-level pages: index, about, books, articles, videos, posts, search, 404
templates/
  layouts/          # default, post, booklist, withcarousel
  partials/         # navbar, footer, analytics
  tags/             # postCard
data/
  authors.yml       # Author metadata
public/
  images/           # Static image assets
src/main/resources/
  application.properties   # Collection config + prod site URL
.github/workflows/
  deploy.yml        # CI: build with quarkus-roq action → deploy to Netlify
netlify.toml        # Netlify routing, headers, cache rules
docs/               # Project documentation (summaries, migration notes)
```

## Collections (application.properties)
All collections have `future=true` so future-dated content is included.

| Collection | Layout | Notes |
|---|---|---|
| `articles` | `book` | Published journalism/writing |
| `books` | `book` | Authored books |
| `posts` | `post` | Blog posts |
| `upcoming` | `book` | Upcoming events/talks |
| `videos` | `book` | Conference talks / training videos |

## Content front matter conventions
```yaml
---
title: "Post title"
description: "Short description"
image: posts/image.jpg          # relative to public/images/
layout: post                    # or book, etc.
pubdate: 2026-02-12
tags: [tag1, tag2]
author: kittylyst
published: true                 # used by upcoming collection
---
```

## Templates
- **`layouts/default.html`** — base wrapper: navbar + footer + Tailwind CDN + dark-mode init script
- **`layouts/post.html`** — blog post layout with metadata section
- **`layouts/booklist.html`** — list-style pages; includes `toggleHidden()` JS for collapsible rows
- **`layouts/withcarousel.html`** — pages with richer carousel/list behaviour
- **`partials/navbar.html`** — desktop nav + mobile hamburger (Tailwind responsive)
- **`partials/footer.html`** — copyright + Roq attribution
- **`tags/postCard.html`** — card partial used for listing posts

## Deployment pipeline
Push to `main` →
1. GitHub Actions: `quarkiverse/quarkus-roq@v1` action builds static site to `target/roq/`
2. `netlify.toml` is copied into `target/roq/`
3. Artifact uploaded, then deployed to Netlify via `nwtgck/actions-netlify@v3`

Secrets required in GitHub repo: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` (Netlify API Site ID).

## Dev workflow
```bash
./mvnw quarkus:dev      # dev mode with live reload — http://localhost:8080
./mvnw package          # build static site to target/roq/
```

## Key implementation notes
- `content/index.html` — home hero is a 3-image auto-advancing carousel with prev/next controls, keyboard and swipe support, pause-on-hover
- `content/upcoming.html` — client-side filtering: only shows items where `published: true` AND `pubdate` is in the future; supports `?debugUpcoming=1` query param for debug view
- Netlify `netlify.toml` is configured to **reject Netlify-side builds** (build command intentionally `exit 1`); all builds happen in GitHub Actions
- Cache headers: `/static/*` → 1 year immutable; `/images/*` → 30 days
- Security headers set in `netlify.toml`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
