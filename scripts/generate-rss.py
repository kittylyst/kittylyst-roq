#!/usr/bin/env python3
"""Generate public/rss.xml from content/posts front matter."""

from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from xml.sax.saxutils import escape


SITE_TITLE = "Ben Evans (kittylyst)"
SITE_URL = "https://kittylyst.com"
FEED_DESCRIPTION = "Blog posts from Ben Evans"
POSTS_DIR = Path("content/posts")
OUTPUT_PATH = Path("public/rss.xml")


def parse_front_matter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}

    end = text.find("\n---\n", 4)
    if end == -1:
        return {}

    front_matter = text[4:end]
    data: dict[str, str] = {}
    for raw_line in front_matter.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('"').strip("'")
    return data


def to_rfc822(d: date) -> str:
    return datetime(d.year, d.month, d.day).strftime("%a, %d %b %Y 00:00:00 +0000")


def cdata(text: str) -> str:
    # Guard against accidentally breaking CDATA blocks.
    return text.replace("]]>", "]]]]><![CDATA[>")


def main() -> None:
    today = date.today()
    items: list[dict[str, str]] = []

    for post_file in sorted(POSTS_DIR.glob("*.html")):
        fm = parse_front_matter(post_file)
        pubdate_raw = fm.get("pubdate", "")
        try:
            pubdate = date.fromisoformat(pubdate_raw)
        except ValueError:
            continue

        # Keep the feed aligned with visible blog content.
        if pubdate > today:
            continue

        title = fm.get("title", post_file.stem)
        description = fm.get("description", "")
        url = f"{SITE_URL}/posts/{post_file.stem}"
        items.append(
            {
                "title": title,
                "description": description,
                "url": url,
                "pubDate": to_rfc822(pubdate),
                "pubdate_sort": pubdate.isoformat(),
            }
        )

    items.sort(key=lambda x: x["pubdate_sort"], reverse=True)

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0">',
        "  <channel>",
        f"    <title>{escape(SITE_TITLE)}</title>",
        f"    <link>{escape(SITE_URL + '/')}</link>",
        f"    <description>{escape(FEED_DESCRIPTION)}</description>",
        "    <language>en</language>",
    ]

    for item in items:
        lines.extend(
            [
                "",
                "    <item>",
                f"      <title>{escape(item['title'])}</title>",
                f"      <link>{escape(item['url'])}</link>",
                f"      <guid isPermaLink=\"true\">{escape(item['url'])}</guid>",
                f"      <pubDate>{item['pubDate']}</pubDate>",
                f"      <description><![CDATA[{cdata(item['description'])}]]></description>",
                "    </item>",
            ]
        )

    lines.extend(["  </channel>", "</rss>", ""])
    OUTPUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {OUTPUT_PATH} with {len(items)} items")


if __name__ == "__main__":
    main()
