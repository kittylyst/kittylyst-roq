# kittylyst-roq — Project Wiki

## Overview

**kittylyst-roq** is the personal website of **Ben Evans**, a Java author, speaker, and software engineer. The site lives at [kittylyst.com](https://kittylyst.com) and showcases his published articles, books, videos, upcoming events, and blog posts.

The site was migrated from a **Gatsby** (React/Node) stack to **Quarkus + Roq**, a Java-based Static Site Generator built on top of Quarkus with Qute templates and Tailwind CSS.

---

## Technology Stack

| Concern | Technology |
|---|---|
| Language | Java 21 |
| Application framework | Quarkus 3.36.3 |
| Static site generator | quarkus-roq 2.1.4 |
| CSS framework | Tailwind CSS (via quarkus-web-bundler 2.3.2) |
| Template engine | Qute (Quarkus built-in) |
| Tagging | quarkus-roq-plugin-tagging 2.1.4 |
| Build tool | Maven (mvnw wrapper) |
| CI/CD | GitHub Actions |
| Hosting | Netlify |

---

## Running Locally

```bash
# Dev mode — live reload at http://localhost:8080
./mvnw quarkus:dev

# Build static site (output: target/roq/)
./mvnw package
```

A Quarkus Dev UI is available at `http://localhost:8080/q/dev/` in dev mode.

---

## Project Structure

```
kittylyst-roq/
├── content/                    # Site content (all pages + collections)
│   ├── articles/               # 100+ published journalism/writing (Markdown)
│   ├── books/                  # Authored books (HTML)
│   ├── videos/                 # Conference talks & training videos (HTML)
│   ├── posts/                  # Blog posts (HTML with front matter)
│   ├── upcoming/               # Upcoming events and talks (HTML)
│   └── *.html                  # Top-level pages: index, about, books, articles,
│                               #   videos, posts, search, upcoming, 404, rss.xml
├── templates/
│   ├── layouts/                # Page layout templates
│   │   ├── default.html        # Base wrapper (navbar, footer, Tailwind, dark mode)
│   │   ├── post.html           # Blog post layout
│   │   ├── booklist.html       # List-style page (books, articles)
│   │   └── withcarousel.html   # Pages with carousel/list behaviour
│   ├── partials/
│   │   ├── navbar.html         # Responsive navigation
│   │   ├── footer.html         # Site footer
│   │   └── analytics.html      # Analytics snippet
│   └── tags/
│       └── postCard.html       # Blog post card partial
├── data/
│   └── authors.yml             # Author metadata
├── public/
│   └── images/                 # Static images served at /images/
├── src/main/resources/
│   └── application.properties  # Collection config, prod site URL
├── docs/                       # Internal project documentation
├── .github/workflows/
│   └── deploy.yml              # CI: build → deploy to Netlify
└── netlify.toml                # Netlify routing, headers, and cache rules
```

---

## Content Collections

Collections are configured in [`src/main/resources/application.properties`](../src/main/resources/application.properties). All collections have `future=true`, which means content with future `pubdate` values is included in the build.

| Collection | Source dir | Layout | Content format | Count |
|---|---|---|---|---|
| `articles` | `content/articles/` | `book` | Markdown | 100+ |
| `books` | `content/books/` | `book` | HTML | 8 |
| `posts` | `content/posts/` | `post` | HTML | ~10 |
| `upcoming` | `content/upcoming/` | `book` | HTML | ~4 |
| `videos` | `content/videos/` | `book` | HTML | 27 |

### Front Matter Fields

Every content file starts with a YAML front matter block:

```yaml
---
title: "The Article Title"
description: "Short summary shown in listings."
image: posts/my-image.jpg          # path relative to public/images/
layout: post                        # matches a file in templates/layouts/
pubdate: 2026-02-12                 # publication date (ISO 8601)
tags: [java, performance]           # used by the tagging plugin
author: kittylyst                   # key from data/authors.yml
published: true                     # required for upcoming items to appear
---
```

---

## Templates

### Layouts

- **`default.html`** — The base page shell. Includes `<head>`, navbar partial, footer partial, Tailwind CSS (via web bundler), and a dark-mode initialisation script.
- **`post.html`** — Extends default. Adds a blog post metadata header (date, tags, author).
- **`booklist.html`** — Extends default. Adds a `toggleHidden()` JavaScript function for collapsible book/article rows in list pages.
- **`withcarousel.html`** — Extends default. Used on pages that require richer list or carousel UI.

### Partials

- **`navbar.html`** — Desktop nav (`md:flex`) with a mobile hamburger button and a toggleable slide-out panel (`md:hidden`).
- **`footer.html`** — Copyright notice and Roq framework attribution.
- **`analytics.html`** — Analytics tracking snippet (injected by default layout).

---

## Notable Pages

### Home (`content/index.html`)
The hero section is a **3-image auto-advancing carousel**:
- `/images/main/another-place.jpg`
- `/images/main/devoxx2019.jpg`
- `/images/main/bje_still_optimizing_java.png`

Features: prev/next controls, dot indicators, keyboard arrow support, touch/swipe support, pause-on-hover.

### Upcoming Events (`content/upcoming.html`)
Items are rendered client-side with two visibility filters:
1. `published: true` in front matter
2. `pubdate` must be **in the future** (evaluated at page load time)

Empty-state message shown when no events match. Debug mode available via `?debugUpcoming=1` query param — shows per-item visibility status and reason.

---

## Deployment

### GitHub Actions (`.github/workflows/deploy.yml`)

Triggered on push to `main` or manual dispatch.

1. Checkout repository
2. Build static site using the `quarkiverse/quarkus-roq@v1` GitHub Action → output to `target/roq/`
3. Copy `netlify.toml` into `target/roq/`
4. Upload `target/roq/` as a build artifact (`retention-days: 3`)
5. Download artifact, deploy `./site` to Netlify using `nwtgck/actions-netlify@v3` (production deploy)

Required GitHub Secrets:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID` — must be the Netlify **API Site ID**, not the site name

### Netlify (`netlify.toml`)

Netlify-side builds are **intentionally disabled** — the build command is set to `exit 1`. All builds run in GitHub Actions only.

| Rule | Value |
|---|---|
| Pretty URLs | enabled |
| 404 redirect | `/404/index.html` |
| `/static/*` cache | 1 year, immutable |
| `/images/*` cache | 30 days |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

---

## Adding New Content

### New blog post
Create `content/posts/YYYY-MM-DD-slug.html` with front matter and an HTML fragment body:

```html
---
title: My Post Title
description: A short description.
image: posts/my-image.jpg
layout: post
pubdate: 2026-01-01
tags: [java, quarkus]
author: kittylyst
---

<p>Post content goes here as HTML fragments.</p>
```

### New article
Create `content/articles/YYYY-MM-DD-slug.md` with Markdown body. The `layout` field defaults from `application.properties` so it can be omitted.

### New video
Create `content/videos/slug.html` with appropriate front matter fields (title, description, pubdate, etc.) and embed HTML in the body.

### New upcoming event
Create `content/upcoming/YYYY-MM-DD-slug.html` with `published: true` and a `pubdate` set to the event date. The page will automatically hide it once that date has passed.

---

## Blog Post Image Credits

Thumbnails in `public/images/posts/` are from Wikimedia Commons (Creative Commons / public domain), downloaded by `scripts/download-blog-images-cc.py`.

| File | Description | Licence |
|---|---|---|
| `typewriter-keyboard.jpg` | Typewriter keyboard, by Maksym Kozlenko | CC BY-SA 4.0 |
| `cryptocurrency-logos.jpg` | Cryptocurrency logos | CC0 |
| `programming-code.jpg` | Programming (code on screen), Lorenzo Cafaro / Pixabay | CC0 |
| `library-book-stacks.jpg` | Library book stacks, Gwyneth Perry | CC0 |

---

## Coupled-System Visualization (`viz/`)

A standalone, browser-viewable D3.js XY line graph that visualizes a **coupled oscillator system** over time. No build step required — open `viz/index.html` directly in a browser.

### Waveform — System 1

One cycle consists of four sequential phases:

| Phase | Behaviour |
|---|---|
| **Rest** | Signal sits flat at `0` for a configurable duration |
| **Rise** | Signal ramps linearly up to `+amplitude` over a configurable duration |
| **Crash** | Signal drops instantaneously to `−amplitude` (represented as two points at the same `t`, producing a vertical line in D3) |
| **Recover** | Signal ramps linearly back to `0` over a configurable duration |

`amplitude` is shared between the positive peak and the negative crash (always symmetrical). The default time window shows at least **6 full cycles**.

### Configurable Parameters

| Parameter | Description |
|---|---|
| `amplitude` | Peak height (crash depth = amplitude) |
| `restDuration` | Duration of the flat-at-zero phase |
| `riseDuration` | Duration of the linear rise phase |
| `recoverDuration` | Duration of the linear recovery phase |

Default values: `amplitude=1`, `restDuration=2`, `riseDuration=3`, `recoverDuration=1` (arbitrary time units).
Total time window = `(restDuration + riseDuration + recoverDuration) × 6`.

All parameters are exposed as sliders + number inputs that update the graph in real time.

### Implementation Plan (Stage 1)

| Sub-task | Description | Status |
|---|---|---|
| 1 — Scaffold | `viz/index.html` + `viz/viz.js` stub, D3 from CDN | pending |
| 2 — Data generator | Pure `generateSystem1(params, totalTime)` → `[{t, v}]` | pending |
| 3 — D3 rendering | SVG line chart with labelled X/Y axes | pending |
| 4 — Pan & zoom | X-axis only zoom/pan via `d3.zoom()`, clip path, Reset button | pending |
| 5 — Controls UI | Four label + slider + number-input groups, bidirectionally synced | pending |

### Future Stages (out of scope)

- **Stage 2**: Add System 2 with its own waveform and parameters
- **Stage 3**: Coupling logic — one system's state influences the other
- **Stage 4**: Visual differentiation (colours, legend, per-system toggle)

---

## History

This site is a rewrite of an older **Gatsby 5** (React/Node.js) site. The migration involved:

- Converting React components → Qute templates
- Converting Bootstrap 5 CSS → Tailwind CSS
- Converting GraphQL content queries → Roq content collections
- Converting ~100 article markdown files to Roq front matter format
- Replacing Netlify-side builds with GitHub Actions CI

Key features from the old site **not carried over**: full-text FlexSearch, GetForm.io contact form, year-grouped article view, PWA manifest.
