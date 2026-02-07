# Project Summary: kittylyst-roq

## Overview

**kittylyst-roq** is a static site generator (SSG) project built with **Quarkus** and **Roq**. It serves as a personal portfolio website for Ben Evans, showcasing books, videos, blog posts, and a photo gallery. The project uses Java 21 and leverages Quarkus 3.30.4 for building a modern, performant static site.

**Migration Status**: This project is a migration from a Gatsby-based site (`../kittylyst/`) to Quarkus/Roq. See `OLD_SITE_SUMMARY.md` for details on the original site and `MIGRATION_ANALYSIS.md` for migration planning.

## Technology Stack

### Core Framework
- **Quarkus 3.30.4** - Supersonic Subatomic Java Framework
- **Java 21** - Modern Java runtime
- **Roq 2.0.3** - Static Site Generator with Java/Quarkus integration
- **Qute** - Template engine (used by Roq)

### Frontend & Styling
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Web Bundler 2.0.4** - Asset bundling and optimization
- **Tailwind CSS Plugin** - Integration for Quarkus Web Bundler

### Build Tools
- **Maven** - Build and dependency management
- **Maven Wrapper (mvnw)** - Portable Maven execution

### Plugins & Extensions
- **quarkus-roq-plugin-tagging** - Tagging functionality for blog posts
- **quarkus-arc** - Dependency injection framework

## Project Structure

```
kittylyst-roq/
├── content/              # Source content files
│   ├── books/           # Book collection (8 books)
│   ├── articles/        # Articles collection (67 articles)
│   ├── posts/           # Blog posts (6 posts)
│   ├── videos/          # Video content pages (24+ videos)
│   ├── gallery/         # Photo gallery
│   └── *.html           # Static pages (index, about, books, articles, videos, posts, gallery, 404)
├── templates/            # Qute templates
│   ├── layouts/         # Page layouts (default, page, post, booklist, withcarousel)
│   ├── partials/        # Reusable components (navbar, footer, header)
│   └── tags/            # Qute tags (e.g. postCard)
├── data/                 # Data files (YAML)
│   └── authors.yml      # Author information (Ben Evans)
├── public/               # Static assets
│   └── images/          # Images (books, main gallery, videos, posts)
├── src/main/
│   ├── java/roq/kittylyst/  # Java source (Extensions, QuteTest)
│   ├── resources/       # Application configuration
│   └── docker/          # Dockerfiles for various deployment modes
└── target/               # Build output directory
```

## Content Collections

The site organizes content into collections configured in `application.properties`:

1. **Books Collection** (`site.collections.books`)
   - Enabled: Yes
   - Layout: "book"
   - Future posts: Enabled
   - Contains 8 books ranging from 2012 to 2026
   - Includes Java-related titles (Nutshell series, Well-Grounded Java, Optimizing Java)

2. **Articles Collection** (`site.collections.articles`)
   - Enabled: Yes
   - Layout: "book"
   - Future posts: Enabled
   - Contains 67 articles (Markdown with front matter: title, url, pubdate, type, publisher)

3. **Videos Collection** (`site.collections.videos`)
   - Enabled: Yes
   - Layout: "book"
   - Future posts: Enabled
   - Contains 24+ video pages (HTML) with thumbnails; videos page uses withcarousel layout

4. **Posts Collection** (`site.collections.posts`)
   - Enabled: Yes
   - Layout: "post"
   - Future posts: Enabled
   - Contains 6 blog posts (Markdown with front matter)

## Templates & Layouts

### Layouts
- **default.html** - Base layout with navbar, footer, and Tailwind CSS (max-w-4xl)
- **page.html** - Standard page layout with title and content area
- **post.html** - Blog post layout
- **booklist.html** - Layout for book/article listings with toggle (max-w-6xl)
- **withcarousel.html** - Layout for videos page with carousel (max-w-6xl)

### Partials
- **navbar.html** - Navigation: Upcoming, Videos, Books, Articles, Blog, Gallery, About
- **footer.html** - Footer with copyright and "Built with Roq" attribution

## Features

### Content Management
- **Markdown Support** - Books, articles, and posts use Markdown with front matter
- **Front Matter** - YAML metadata for pages (title, description, layout, url, pubdate, etc.)
- **Collections** - Books, articles, videos, posts (all enabled)
- **Tagging** - Blog post tagging support via plugin

### UI Features
- **Dark Mode Support** - Theme toggle with localStorage persistence
- **Responsive Design** - Mobile-friendly layouts using Tailwind CSS
- **Image Gallery** - Photo gallery with hover effects
- **Show/Hide Toggle** - Interactive controls for book/video listings

### Build & Deployment
- **JVM Mode** - Standard Java application
- **Native Executable** - GraalVM native image support
- **Docker Support** - Multiple Dockerfiles for different deployment scenarios:
  - `Dockerfile.jvm` - JVM mode container
  - `Dockerfile.native` - Native executable container
  - `Dockerfile.legacy-jar` - Legacy uber-jar container
  - `Dockerfile.native-micro` - Native micro container

## Configuration

### Application Properties (`application.properties`)
- Books, articles, videos: enabled with layout "book"; future posts enabled
- Posts: enabled with layout "post"; future posts enabled

### Build Configuration (`pom.xml`)
- Java 21 compiler target
- Quarkus 3.30.4 platform
- Integration tests skipped by default (enabled for native profile)
- Native build profile available

## Content Overview

### Books (8 total)
- Java in a Nutshell (6th, 7th, 8th, 9th editions)
- Well-Grounded Java (1st, 2nd editions)
- Optimizing Java
- Optimizing Cloud-Native Java

### Articles (67 total)
- Markdown files with front matter; linked to external publishers (InfoQ, O’Reilly, etc.)

### Videos (24+ total)
- HTML pages with thumbnails; topics include Observability, Java in Containers, Optimizing Java, JVM, Devoxx talks, etc.

### Posts (6 total)
- Blog posts in Markdown (e.g. welcome post, Java Reconsidered, Well-Grounded Java 2e, advice for developers, cryptocurrency).

### Pages
- Home (index.html), About, Books listing, Articles listing, Videos listing, Posts (blog), Gallery, 404

## Development Workflow

### Running in Dev Mode
```bash
./mvnw quarkus:dev
```
- Enables live coding
- Dev UI available at `http://localhost:8080/q/dev/`

### Building
```bash
./mvnw package
```
- Produces `quarkus-run.jar` in `target/quarkus-app/`
- Dependencies in `target/quarkus-app/lib/`

### Native Build
```bash
./mvnw package -Dnative
```
- Creates native executable
- Container build option available: `-Dquarkus.native.container-build=true`

## Data Files

### Authors (`data/authors.yml`)
- Contains author profile for "ben" (Ben Evans)
- Includes name, job, nickname (kittylyst), profile, avatar, bio
- Used for blog post attribution

## Static Assets

### Images
- **Book covers** - 8 book cover images
- **Gallery photos** - 30+ personal photos in `images/main/`
- **Video thumbnails** - Video preview images
- **Site assets** - Favicon, logo, site icon

## Current State

- **Java Source Code**: `Extensions.java`, `QuteTest.java` in `src/main/java/roq/kittylyst/`
- **Content**: Books (8), articles (67), videos (24+), posts (6), gallery; all collections enabled
- **Templates**: Layouts (default, page, post, booklist, withcarousel), partials, tags
- **Build System**: Fully configured Maven project
- **Deployment**: Docker configurations ready for multiple deployment modes

## Notes

- The project uses Roq, a Java-based SSG built on Quarkus
- Tailwind CSS is loaded via CDN (not bundled)
- Theme switching uses localStorage for persistence
- All four collections (books, articles, videos, posts) are enabled
- Personal portfolio site for Ben Evans (kittylyst)

