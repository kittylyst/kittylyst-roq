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
│   ├── posts/           # Blog posts
│   ├── videos/          # Video content pages
│   ├── gallery/         # Photo gallery
│   └── *.html           # Static pages (index, about, contact, etc.)
├── templates/           # Qute templates
│   ├── layouts/         # Page layouts (default, page, post, booklist)
│   └── partials/       # Reusable components (navbar, footer)
├── data/                # Data files (YAML)
│   └── authors.yml      # Author information
├── public/              # Static assets
│   └── images/          # Images (books, main gallery, videos)
├── src/main/
│   ├── java/            # Java source code (currently empty)
│   ├── resources/       # Application configuration
│   └── docker/          # Dockerfiles for various deployment modes
└── target/              # Build output directory
```

## Content Collections

The site organizes content into collections configured in `application.properties`:

1. **Books Collection** (`site.collections.books`)
   - Enabled: Yes
   - Layout: "book"
   - Future posts: Enabled
   - Contains 8 books ranging from 2012 to 2026
   - Includes Java-related titles (Nutshell series, Well-Grounded Java, Optimizing Java)

2. **Videos Collection** (`site.collections.videos`)
   - Enabled: Yes
   - Layout: "book"
   - Future posts: Enabled
   - Topics include: Observability, Java in Containers, Optimizing Java, Practical Scala

3. **Posts Collection** (`site.collections.posts`)
   - Enabled: No (currently disabled)
   - Contains at least one sample post: "The First Roq!"

## Templates & Layouts

### Layouts
- **default.html** - Base layout with navbar, footer, and Tailwind CSS integration
- **page.html** - Standard page layout with title and content area
- **post.html** - Blog post layout (referenced but not shown in detail)
- **booklist.html** - Specialized layout for book/video listings with toggle functionality

### Partials
- **navbar.html** - Navigation menu with links to Books, Videos, Gallery, About, Contact
- **footer.html** - Footer with copyright and "Built with Roq" attribution

## Features

### Content Management
- **Markdown Support** - Books and posts use Markdown with front matter
- **Front Matter** - YAML metadata for pages (title, description, layout, etc.)
- **Collections** - Organized content grouping (books, videos, posts)
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
- Books collection enabled with "book" layout
- Videos collection enabled with "book" layout
- Posts collection currently disabled
- Future posts enabled for books and videos

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

### Videos (4 topics)
- Getting Started with Observability
- Java in Containers
- Optimizing Java
- Practical Scala

### Pages
- Home (index.html)
- About
- Books listing
- Videos listing
- Gallery
- Contact
- 404 error page

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
- Contains author profile for "roqqy" (Roqqy Balboa)
- Includes bio, avatar, and social links
- Used for blog post attribution

## Static Assets

### Images
- **Book covers** - 8 book cover images
- **Gallery photos** - 30+ personal photos in `images/main/`
- **Video thumbnails** - Video preview images
- **Site assets** - Favicon, logo, site icon

## Current State

- **Java Source Code**: None currently (empty `src/main/java/` directory)
- **Content**: Fully populated with books, videos, and sample posts
- **Templates**: Complete template structure with layouts and partials
- **Build System**: Fully configured Maven project
- **Deployment**: Docker configurations ready for multiple deployment modes

## Notes

- The project uses Roq, a Java-based SSG built on Quarkus
- Tailwind CSS is loaded via CDN (not bundled)
- Theme switching uses localStorage for persistence
- Posts collection is currently disabled in configuration
- The site appears to be a personal portfolio for Ben Evans (kittylyst)

