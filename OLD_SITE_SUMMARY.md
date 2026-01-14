# Old Site Summary: kittylyst (Gatsby)

## Overview

The **kittylyst** site is a static site built with **Gatsby 5.13.7** (React-based SSG). It serves as Ben Evans' personal portfolio website, showcasing books, articles, blog posts, training videos, events, and other media content.

## Technology Stack

### Core Framework
- **Gatsby 5.13.7** - React-based Static Site Generator
- **React 18.3.1** - UI library
- **Node.js** - Runtime environment
- **Yarn** - Package manager

### Key Plugins & Dependencies
- **gatsby-transformer-remark** - Markdown processing
- **gatsby-plugin-image** - Image optimization
- **gatsby-plugin-sharp** - Image processing
- **gatsby-plugin-local-search** - Full-text search with FlexSearch
- **gatsby-plugin-manifest** - PWA manifest
- **gatsby-plugin-react-helmet** - SEO management
- **gatsby-plugin-sass** - SCSS support
- **bootstrap 5.3.3** - CSS framework
- **flexsearch 0.7.43** - Search engine
- **react-icons** - Icon library

## Project Structure

```
kittylyst/
├── gatsby-config.js        # Gatsby configuration
├── gatsby-node.js          # Page generation logic
├── gatsby-browser.js       # Browser API configuration
├── package.json            # Dependencies
├── public/                 # Built static files
├── src/
│   ├── components/         # React components
│   │   ├── BlogPostCard.js
│   │   ├── BlogPostHeader.js
│   │   ├── BlogPostLayout.js
│   │   ├── ContactForm.js
│   │   ├── EventPreview.js
│   │   ├── FeaturedBlogPostCard.js
│   │   ├── FeaturedListItem.js
│   │   ├── Footer.js
│   │   ├── HeroHeader.js
│   │   ├── Layout.js
│   │   ├── ListItem.js
│   │   ├── Navbar.js
│   │   ├── PostPreview.js
│   │   ├── SearchBar.js
│   │   ├── SearchDisplay.js
│   │   ├── SearchHeader.js
│   │   ├── SearchLayout.js
│   │   ├── Seo.js
│   │   └── YearDisplay.js
│   ├── content/            # Source content
│   │   ├── blog/           # Blog posts (7 posts)
│   │   ├── events/         # Upcoming events (7 events)
│   │   ├── othermedia/     # Other media (17 items)
│   │   ├── pagecontent/    # Page content markdown
│   │   ├── publications/   # Books and articles
│   │   │   ├── articles/   # Article collection
│   │   │   ├── Java-in-a-Nutshell.md
│   │   │   ├── Optimizing-Java.md
│   │   │   └── Well-Grounded-Developer.md
│   │   └── training/       # Training videos (3 videos)
│   ├── images/             # Image assets
│   │   ├── books/          # Book cover images
│   │   ├── headers/        # Header images
│   │   └── training/       # Training thumbnails
│   ├── pages/              # Page components
│   │   ├── 404.js
│   │   ├── index.js        # Home page
│   │   ├── blog.js         # Blog listing
│   │   ├── othermedia.js
│   │   ├── publications.js
│   │   └── search.js
│   ├── templates/          # Page templates
│   │   ├── BlogPost.js     # Blog post template
│   │   ├── GeneralContentPage.js
│   │   └── ProductPage.js  # For publications/training
│   ├── styles/             # SCSS stylesheets
│   │   ├── style.scss
│   │   ├── _blogpostheader.scss
│   │   ├── _buttons.scss
│   │   ├── _cards.scss
│   │   ├── _footer.scss
│   │   ├── _header.scss
│   │   ├── _navbar.scss
│   │   └── _searchbar.scss
│   ├── utils/
│   │   └── search-query.js
│   ├── mockData/
│   │   └── mockSearchResults.js
│   └── raw-content/        # Pre-processing scripts
│       ├── articles.csv
│       ├── talks.csv
│       └── process_articles.py
```

## Content Structure

### Content Types

1. **Blog Posts** (`type: blogpost`)
   - Location: `src/content/blog/`
   - 7 blog posts total
   - Each post has its own directory with `index.md` and images
   - Front matter includes: `title`, `header_image`, `type`, `datetime`
   - Draft posts (no datetime) are excluded from generation

2. **Publications** 
   - **Books** (`type: Book`)
     - Location: `src/content/publications/`
     - 3 books: Java in a Nutshell, Optimizing Java, Well-Grounded Developer
     - Front matter: `title`, `image`, `url`, `publicationdate`, `headline`, `buttontext`
   - **Articles** (`type: article`)
     - Location: `src/content/publications/articles/`
     - Generated from CSV via Python script
     - Front matter: `title`, `publicationdate`

3. **Training Videos** (`type: Training`)
   - Location: `src/content/training/`
   - 3 training videos: Beginning Java, Optimizing Java, Practical Scala
   - Front matter: `title`, `url`, `headline`, `buttontext`, `image`, `featured`

4. **Events** (`type: Upcoming Events`)
   - Location: `src/content/events/`
   - 7 upcoming events
   - Front matter: `title`, `url`, `headline`, `buttontext`, `datetime`, `label`, `image`

5. **Other Media** (`type: Other Media`)
   - Location: `src/content/othermedia/`
   - 17 items (talks, presentations, etc.)
   - Front matter: `title`, `url`, `headline`, `buttontext`, `datetime`, `image`

6. **Page Content**
   - Location: `src/content/pagecontent/`
   - Markdown files for page descriptions
   - Types: `page_content`, `page_content_general`, `page_content_product`

## Key Features

### Page Generation
- **Blog Posts**: Generated from markdown files with `type: blogpost`
- **Product Pages**: Generated for publications and training (uses `ProductPage` template)
- **General Pages**: Generated for about me, etc. (uses `GeneralContentPage` template)
- **Dynamic Routing**: All pages generated at build time via `gatsby-node.js`

### Search Functionality
- **Full-text search** using FlexSearch
- Indexes all markdown content (excluding drafts)
- Search page at `/search`
- Indexes: title, excerpt, slug, type

### Navigation
- **Navbar** with links to:
  - Video Training
  - Live Events
  - Publications
  - Other Media
  - Blog
  - About Me
  - Search
- Bootstrap-based responsive navigation

### Home Page Sections
1. **Most Popular** - Featured training videos and books
2. **Latest from My Blog** - Most recent blog post
3. **Upcoming Events** - Next 2 events
4. **Contact Form** - GetForm.io integration

### Styling
- **Bootstrap 5.3.3** for layout and components
- **SCSS** for custom styling
- Custom fonts: Playfair Display, Roboto
- Responsive design

### SEO & Metadata
- React Helmet for meta tags
- Site metadata in `gatsby-config.js`
- Open Graph support
- PWA manifest

## Content Processing

### Pre-processing Scripts
- **Python scripts** in `src/raw-content/`:
  - `process_articles.py` - Processes `articles.csv` to generate markdown files
  - `one_off_rearrange.py` - One-off content reorganization

### Image Processing
- Gatsby Image plugin for optimization
- Automatic image processing via Sharp
- WebP format support
- Responsive images with srcset

## Contact Form
- **GetForm.io** integration
- Form fields: name, email, phone, message
- Client-side form handling with React state
- Success/error status messages

## Build & Deployment

### Development
```bash
yarn install
gatsby develop  # Runs on http://localhost:8000
```

### Production Build
```bash
gatsby build   # Outputs to public/
gatsby serve   # Serves built site
```

### Static Output
- Generates fully static HTML/CSS/JS
- No server required
- Can be deployed to any static hosting

## Data Flow

1. **Content Files** → Markdown files in `src/content/`
2. **Gatsby Source Filesystem** → Reads content files
3. **Gatsby Transformer Remark** → Converts markdown to GraphQL nodes
4. **gatsby-node.js** → Creates pages from GraphQL queries
5. **Templates** → Render pages using React components
6. **Build** → Generates static HTML files

## Key Differences from New Site (Roq)

### Technology
- **Old**: Gatsby (React/Node.js)
- **New**: Roq (Quarkus/Java)

### Content Organization
- **Old**: More complex with multiple content types (blog, publications, training, events, othermedia)
- **New**: Simpler structure (books, videos, posts collections)

### Features
- **Old**: Full-text search, contact form, featured items, year-based article grouping
- **New**: Tagging plugin, simpler structure, gallery page

### Styling
- **Old**: Bootstrap 5 + SCSS
- **New**: Tailwind CSS (via CDN)

### Navigation
- **Old**: 7 navigation items (Training, Events, Publications, Other Media, Blog, About, Search)
- **New**: 6 navigation items (Upcoming, Videos, Books, Blog, Gallery, About, Contact)

## Migration Considerations

1. **Content Migration**
   - Blog posts need to be converted to Roq format
   - Publications need to be restructured as books collection
   - Training videos need to be moved to videos collection
   - Events may need separate handling or integration
   - Other media items need categorization

2. **Feature Parity**
   - Search functionality (Roq may need custom implementation)
   - Contact form (needs alternative solution)
   - Featured items functionality
   - Year-based article grouping

3. **Image Assets**
   - All images need to be copied to `public/images/`
   - Image paths need updating

4. **Templates**
   - React components need to be converted to Qute templates
   - Bootstrap classes need to be converted to Tailwind

5. **SEO**
   - Meta tags need to be migrated
   - Open Graph tags need Qute template updates

