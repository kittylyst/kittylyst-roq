# Migration Analysis: Gatsby → Quarkus/Roq

## Executive Summary

This document outlines the migration from the Gatsby-based `kittylyst` site to the Quarkus/Roq-based `kittylyst-roq` site. The migration involves converting React components to Qute templates, restructuring content, and adapting features to the new stack.

## Technology Stack Comparison

| Aspect | Old Site (Gatsby) | New Site (Roq) | Status |
|--------|------------------|----------------|--------|
| **Framework** | Gatsby 5.13.7 | Quarkus 3.30.4 | ✅ Different |
| **Language** | JavaScript/React | Java 21 | ✅ Different |
| **Template Engine** | React JSX | Qute | ⚠️ Needs conversion |
| **CSS Framework** | Bootstrap 5.3.3 | Tailwind CSS | ⚠️ Needs conversion |
| **Build Tool** | Yarn/npm | Maven | ✅ Different |
| **Image Processing** | gatsby-plugin-sharp | Web Bundler | ⚠️ Needs setup |
| **Search** | FlexSearch | Not implemented | ❌ Missing |
| **Contact Form** | GetForm.io | Not implemented | ❌ Missing |

## Content Migration Mapping

### Blog Posts
- **Old**: `src/content/blog/*/index.md` (7 posts)
- **New**: `content/posts/` (1 sample post exists)
- **Action**: 
  - Convert all 7 blog posts to Roq format
  - Move images to appropriate locations
  - Update front matter to match Roq schema
  - Enable posts collection in `application.properties`

### Publications → Books
- **Old**: `src/content/publications/*.md` (3 books) + `articles/` directory
- **New**: `content/books/` (8 books already exist)
- **Action**:
  - Verify all books from old site are in new site
  - Migrate article content (may need separate collection or integration)
  - Update book metadata format

### Training Videos
- **Old**: `src/content/training/*.md` (3 videos)
- **New**: `content/videos/` (4 videos already exist)
- **Action**:
  - Verify all training videos are migrated
  - Update video metadata format
  - Ensure images are in place

### Events
- **Old**: `src/content/events/*.md` (7 events)
- **New**: Not currently implemented
- **Action**:
  - Decide: Create events collection or integrate into other collections
  - May need custom collection or template

### Other Media
- **Old**: `src/content/othermedia/*.md` (17 items)
- **New**: Not currently implemented
- **Action**:
  - Decide: Create othermedia collection or integrate into posts/videos
  - May need custom collection or template

### Page Content
- **Old**: `src/content/pagecontent/*.md`
- **New**: `content/*.html` (static pages)
- **Action**:
  - Convert markdown pages to HTML/Qute templates
  - Update content format

## Feature Migration Checklist

### ✅ Completed/In Place
- [x] Basic site structure
- [x] Books collection (8 books)
- [x] Videos collection (4 videos)
- [x] Gallery page
- [x] Navigation structure
- [x] Basic layouts (default, page, post, booklist)
- [x] Tailwind CSS integration
- [x] Dark mode support

### ⚠️ Partially Complete
- [ ] Blog posts (1 sample, need 7 more)
- [ ] Posts collection enabled
- [ ] All content migrated

### ❌ Not Implemented
- [ ] Full-text search functionality
- [ ] Contact form
- [ ] Events collection
- [ ] Other media collection
- [ ] Featured items functionality
- [ ] Year-based article grouping
- [ ] Image optimization pipeline

## Component/Template Conversion

### Navigation
- **Old**: `src/components/Navbar.js` (React component with Bootstrap)
- **New**: `templates/partials/navbar.html` (Qute template with Tailwind)
- **Status**: ✅ Exists, needs content alignment
- **Action**: Update navigation items to match old site structure

### Footer
- **Old**: `src/components/Footer.js` (React with social icons)
- **New**: `templates/partials/footer.html` (Qute template)
- **Status**: ✅ Exists, simpler version
- **Action**: Add social media links if needed

### Blog Post Layout
- **Old**: `src/components/BlogPostLayout.js` + `src/templates/BlogPost.js`
- **New**: `templates/layouts/post.html`
- **Status**: ✅ Exists
- **Action**: Verify styling and structure match

### Home Page
- **Old**: `src/pages/index.js` (complex with multiple sections)
- **New**: `content/index.html` (simple hero image)
- **Status**: ⚠️ Simplified version
- **Action**: 
  - Add "Most Popular" section
  - Add "Latest Blog Post" section
  - Add "Upcoming Events" section
  - Add contact form section

### Blog Listing
- **Old**: `src/pages/blog.js` (featured post + grid)
- **New**: Not implemented
- **Status**: ❌ Missing
- **Action**: Create blog listing page with Qute template

### Publications Page
- **Old**: `src/pages/publications.js` (books + articles by year)
- **New**: `content/books.html` (books only)
- **Status**: ⚠️ Partial
- **Action**: 
  - Add articles section
  - Implement year-based grouping

## Image Assets Migration

### Source Locations (Old)
- `src/images/books/` - Book covers
- `src/images/headers/` - Header images
- `src/images/training/` - Training thumbnails
- `src/content/blog/*/` - Blog post images

### Target Locations (New)
- `public/images/books/` - Book covers ✅
- `public/images/main/` - Gallery/main images ✅
- `public/images/videos/` - Video thumbnails ✅

### Action Items
- [ ] Copy all blog post images
- [ ] Copy header images if needed
- [ ] Verify all book covers are present
- [ ] Copy training thumbnails to videos directory
- [ ] Update image paths in content files

## Styling Conversion

### Bootstrap → Tailwind
- **Old**: Bootstrap classes (`container`, `row`, `col-md-6`, `btn btn-primary`, etc.)
- **New**: Tailwind utility classes
- **Action**: 
  - Convert all Bootstrap classes to Tailwind equivalents
  - Update component templates
  - Ensure responsive behavior matches

### SCSS → Tailwind
- **Old**: Custom SCSS files in `src/styles/`
- **New**: Tailwind CSS (via CDN, can be bundled)
- **Action**:
  - Extract custom styles to Tailwind config or inline classes
  - Remove SCSS dependencies

## Search Functionality

### Current State
- **Old**: FlexSearch with local indexing
- **New**: Not implemented

### Options
1. **Client-side search**: Implement FlexSearch in browser (JavaScript)
2. **Server-side search**: Build search index during site generation
3. **External search**: Use Algolia or similar service
4. **Simple filtering**: Use Qute filters for basic search

### Recommendation
- Start with simple client-side FlexSearch implementation
- Can be added as JavaScript bundle via Web Bundler

## Contact Form

### Current State
- **Old**: GetForm.io integration (client-side POST)
- **New**: Not implemented

### Options
1. **Keep GetForm.io**: Add JavaScript form handler
2. **Server-side**: Add Quarkus endpoint (requires server)
3. **Static form**: Use formspree.io or similar
4. **Remove**: Link to external contact method

### Recommendation
- Use formspree.io or similar static form service
- Minimal changes needed, works with static site

## Content Format Conversion

### Front Matter Differences

#### Blog Post (Old)
```yaml
---
title: Welcome to my blog
header_image: blogpost1.jpg
type: blogpost
datetime: 2100-01-01T15:00:00Z
---
```

#### Blog Post (New - Roq)
```yaml
---
title: "The First Roq!"
description: This is my first article ever made with Quarkus Roq
image: blog.avif
tags: blogging
author: roqqy
---
```

**Action**: Create conversion script or manual mapping

### Markdown Processing
- **Old**: gatsby-transformer-remark (full markdown support)
- **New**: Roq markdown processing (verify feature parity)
- **Action**: Test markdown features (code blocks, links, images, etc.)

## Migration Priority

### Phase 1: Core Content (High Priority)
1. ✅ Books collection (mostly done)
2. ✅ Videos collection (mostly done)
3. ⚠️ Blog posts (1/7 done)
4. ⚠️ Static pages (about, contact, etc.)

### Phase 2: Features (Medium Priority)
1. Blog listing page
2. Publications/articles page
3. Navigation updates
4. Home page enhancements

### Phase 3: Advanced Features (Low Priority)
1. Search functionality
2. Contact form
3. Events collection
4. Other media collection
5. Image optimization

## Migration Scripts Needed

1. **Content Converter**: Convert Gatsby front matter to Roq format
2. **Image Mover**: Copy and organize images to new structure
3. **Path Updater**: Update all internal links and image paths
4. **Template Generator**: Generate Qute templates from React components (manual)

## Testing Checklist

- [ ] All pages render correctly
- [ ] All images load
- [ ] Navigation works
- [ ] Links are correct
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Dark mode works
- [ ] Build succeeds
- [ ] Static output is correct

## Notes

- The new site has a simpler structure, which may require consolidating some content types
- Some features (search, contact form) may need alternative implementations
- Image optimization may need manual setup or different approach
- The migration is an opportunity to simplify and modernize the site structure

