#!/usr/bin/env python3
"""
Script to download video thumbnails from various sources (YouTube, InfoQ, O'Reilly)
and save them to public/images/videos/ directory.

Usage:
    python3 scripts/download-video-thumbnails.py
"""

import urllib.request
import os
import re
from html.parser import HTMLParser
from urllib.parse import urlparse, urljoin


class MetaParser(HTMLParser):
    """HTML parser to extract og:image meta tags from web pages."""
    
    def __init__(self):
        super().__init__()
        self.og_image = None
    
    def handle_starttag(self, tag, attrs):
        if tag == 'meta':
            attrs_dict = dict(attrs)
            if attrs_dict.get('property') == 'og:image' or (attrs_dict.get('name') == 'twitter:image'):
                self.og_image = attrs_dict.get('content')
            elif attrs_dict.get('property') == 'og:image:secure_url':
                self.og_image = attrs_dict.get('content')


def extract_youtube_video_id(url):
    """Extract YouTube video ID from URL."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/embed\/([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def download_youtube_thumbnail(video_id, output_path):
    """Download YouTube thumbnail using YouTube's thumbnail API."""
    # Try maxresdefault first (highest quality)
    urls = [
        f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
        f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',  # Fallback
    ]
    
    for url in urls:
        try:
            urllib.request.urlretrieve(url, output_path)
            print(f'  ✓ Downloaded: {output_path} from {url}')
            return True
        except Exception as e:
            if url == urls[-1]:  # Last attempt
                print(f'  ✗ Failed to download YouTube thumbnail: {e}')
            continue
    return False


def download_webpage_thumbnail(url, output_path):
    """Download thumbnail by extracting og:image from webpage."""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            parser = MetaParser()
            parser.feed(html)
            
            if parser.og_image:
                # Handle relative URLs
                if parser.og_image.startswith('//'):
                    img_url = 'https:' + parser.og_image
                elif parser.og_image.startswith('/'):
                    base = urlparse(url)
                    img_url = f'{base.scheme}://{base.netloc}{parser.og_image}'
                elif not parser.og_image.startswith('http'):
                    img_url = urljoin(url, parser.og_image)
                else:
                    img_url = parser.og_image
                
                urllib.request.urlretrieve(img_url, output_path)
                print(f'  ✓ Downloaded: {output_path} from {img_url}')
                return True
            else:
                print(f'  ✗ No og:image found for {url}')
                return False
    except Exception as e:
        print(f'  ✗ Failed to download webpage thumbnail: {e}')
        return False


def download_video_thumbnails():
    """Main function to download thumbnails for all videos."""
    
    # Video mappings: filename -> (url, source_type)
    videos = {
        # YouTube videos
        'jvm-as-platform-for-smart-contracts.html': ('https://www.youtube.com/watch?v=2vE4RO_umKc', 'youtube'),
        'evolution-not-revolution-jmm-v9.html': ('https://www.youtube.com/watch?v=OHLO34wQQts', 'youtube'),
        'fantastic-bytecodes-and-how-to-interpret-them.html': ('https://www.youtube.com/watch?v=fozu0H_5C4I', 'youtube'),
        'how-we-migrated-new-relic-to-java-11.html': ('https://www.youtube.com/watch?v=oKCB_JBA8Cg', 'youtube'),
        'implementing-simple-jvm-java-rust.html': ('https://www.youtube.com/watch?v=KVxloQHRYvU', 'youtube'),
        'implementing-simple-jvm-rust.html': ('https://www.youtube.com/watch?v=7ECbwgkHdAE', 'youtube'),
        'panel-moving-to-java-11.html': ('https://www.youtube.com/watch?v=whOxOWKF3gk', 'youtube'),
        'records-and-sealed-types-coming-soon.html': ('https://www.youtube.com/watch?v=DfNnlWqjXiI', 'youtube'),
        'why-you-should-migrate-to-java-11-right-now.html': ('https://www.youtube.com/watch?v=_vCND2lMeYs', 'youtube'),
        'do-we-really-do-functional-programming-in-java.html': ('https://www.youtube.com/watch?v=NSOELVPYAF8', 'youtube'),
        'how-we-use-jdk-flight-recorder-at-new-relic.html': ('https://www.youtube.com/watch?v=qW13jF8SbsQ', 'youtube'),
        'java-performance-instrumentation-well-grounded.html': ('https://www.youtube.com/watch?v=pIhWLCmlCGE', 'youtube'),
        'java-in-containers.html': ('https://www.youtube.com/watch?v=SQ4EPmM6AOU', 'youtube'),
        'getting-started-observability.html': ('https://www.youtube.com/watch?v=SYO-LmA647E', 'youtube'),
        
        # InfoQ videos
        'visualizing-java-gc.html': ('https://www.infoq.com/presentations/Visualizing-Java-GC/', 'webpage'),
        
        # O'Reilly videos (may require authentication)
        'practical-java-performance-tuning.html': ('https://www.oreilly.com/content/practical-java-performance-tuning/', 'webpage'),
        'software-architecture-and-public-transport.html': ('https://www.oreilly.com/content/lessons-about-software-architecture-from-public-transit-systems/', 'webpage'),
    }
    
    # Create output directory
    output_dir = 'public/images/videos'
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Downloading thumbnails to {output_dir}/...")
    print("=" * 60)
    
    success_count = 0
    fail_count = 0
    
    for filename, (url, source_type) in videos.items():
        basename = filename.replace('.html', '')
        output_path = os.path.join(output_dir, f'{basename}.jpg')
        
        print(f"\nProcessing: {filename}")
        print(f"  URL: {url}")
        
        if source_type == 'youtube':
            video_id = extract_youtube_video_id(url)
            if video_id:
                if download_youtube_thumbnail(video_id, output_path):
                    success_count += 1
                else:
                    fail_count += 1
            else:
                print(f'  ✗ Could not extract YouTube video ID from URL')
                fail_count += 1
        elif source_type == 'webpage':
            if download_webpage_thumbnail(url, output_path):
                success_count += 1
            else:
                fail_count += 1
    
    print("\n" + "=" * 60)
    print(f"Summary: {success_count} succeeded, {fail_count} failed")


if __name__ == '__main__':
    download_video_thumbnails()

