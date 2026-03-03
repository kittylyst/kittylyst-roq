# Project Summary: kittylyst-roq

## Overview

**kittylyst-roq** is a personal site for Ben Evans built as a static site with **Quarkus + Roq**.
It uses content collections (articles, books, videos, posts, upcoming), Qute templates, and Tailwind utility classes.

## Current Stack

- **Java**: 21
- **Quarkus**: 3.30.4
- **Roq**: 2.0.3
- **Template engine**: Qute
- **CSS**: Tailwind via CDN
- **Build tool**: Maven (`mvnw`)

## Repository Structure

```text
kittylyst-roq/
├── content/                    # Site pages + collection documents
│   ├── articles/               # 103 markdown docs
│   ├── books/                  # 8 HTML docs
│   ├── videos/                 # 27 HTML docs
│   ├── posts/                  # 5 HTML docs
│   ├── upcoming/               # 4 HTML docs
│   └── *.html                  # index/about/listing pages/404
├── templates/
│   ├── layouts/                # default, page, post, booklist, withcarousel
│   ├── partials/               # navbar, footer
│   └── tags/                   # postCard
├── data/
│   └── authors.yml
├── public/
│   └── images/
├── src/main/resources/
│   └── application.properties  # collection config
├── .github/workflows/
│   └── deploy.yml
├── netlify.toml
└── docs/
```

## Collection Configuration

From `src/main/resources/application.properties`:

- `site.collections.articles=true`, layout `"book"`, `future=true`
- `site.collections.books=true`, layout `"book"`, `future=true`
- `site.collections.posts=true`, layout `"post"`, `future=true`
- `site.collections.upcoming=true`, layout `"book"`, `future=true`
- `site.collections.videos=true`, layout `"book"`, `future=true`

## Key Templates and Behavior

### Layouts

- `templates/layouts/default.html`
  - Base wrapper with navbar/footer
  - Tailwind CDN
  - Dark-mode initialization script
- `templates/layouts/booklist.html`
  - Used for list-style pages (books/articles)
  - Includes `toggleHidden()` for hidden book rows
- `templates/layouts/withcarousel.html`
  - Used on pages that include richer list/carousel behavior
- `templates/layouts/post.html`
  - Blog post layout + metadata section

### Partials

- `templates/partials/navbar.html`
  - Desktop nav (`md:flex`)
  - Mobile hamburger + toggleable mobile panel (`md:hidden`)
- `templates/partials/footer.html`
  - Copyright + Roq attribution

### Main Page-Specific Logic

- `content/index.html`
  - Home hero is now a 3-image auto-advancing carousel:
    - `/images/main/another-place.jpg`
    - `/images/main/devoxx2019.jpg`
    - `/images/main/bje_still_optimizing_java.png`
  - Includes prev/next controls, dots, keyboard arrows, swipe support, pause-on-hover/touch
  - Uses fixed `aspect-video` viewport with `object-cover` cropping

- `content/upcoming.html`
  - Renders all upcoming items in a 3-column row layout
  - Applies **client-side filtering**: only show events where:
    - `published: true`
    - `pubdate` is in the future
  - Includes empty-state message
  - Includes debug mode via query param:
    - `/upcoming?debugUpcoming=1`
    - Shows per-item reason for hidden/visible status

## Content Status (Current Counts)

- **Articles**: 103
- **Books**: 8
- **Videos**: 27
- **Posts**: 5
- **Upcoming**: 4

Notes:
- Upcoming items currently include `published: true` front matter.
- A new upcoming item for JNation 2026 exists.
- A new YouTube Live video item was added.

## Deployment

### GitHub Actions (`.github/workflows/deploy.yml`)

Pipeline:
1. Checkout code
2. Build static site using `quarkiverse/quarkus-roq@v1`
3. Copy `netlify.toml` into `target/roq/`
4. Upload artifact
5. Download artifact in deploy job
6. Deploy `./site` to Netlify using `nwtgck/actions-netlify@v3`

Secrets required:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID` (must be Netlify **API Site ID**)

### Netlify config (`netlify.toml`)

- Explicit fail command to prevent accidental Netlify-side builds:
  - `command = "echo 'Build runs on GitHub Actions, not Netlify' && exit 1"`
- Pretty URLs enabled
- Custom 404 redirect to `/404/index.html`
- Security headers:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Cache headers:
  - `/static/*`: 1 year, immutable
  - `/images/*`: 30 days

## Development Commands

### Dev mode

```bash
./mvnw quarkus:dev
```

### Build site

```bash
./mvnw package
```

## Notes

- Content files in collection folders are front matter + HTML fragments (or plain text for some videos).
- Recent cleanup fixed invalid paragraph markup in books/posts/upcoming documents.
- The site is actively maintained and no longer reflects earlier gallery/draft assumptions from the initial migration phase.

