# Deployment Options Comparison

This document compares the two deployment approaches for the sermon library.

## Overview

Your sermon library code is available in two formats:

1. **External Files** (`/docs/` folder) - CSS and JS loaded from separate files
2. **Inline Files** (`/docs/inline/` folder) - Everything embedded in HTML

## Quick Recommendation

**For Squarespace embedding: Use the `/docs/inline/` folder**

The inline version is simpler, faster for your use case, and has no external dependencies.

## Detailed Comparison

| Feature | External Files | Inline Files |
|---------|----------------|--------------|
| **Location** | `/docs/` | `/docs/inline/` |
| **File Sizes** | HTML: ~1-2KB each<br>CSS: 3KB<br>JS: 2KB each | HTML: 8-12KB each |
| **HTTP Requests** | 3 per page (HTML + CSS + JS) | 1 per page (HTML only) |
| **Browser Caching** | ✅ CSS/JS cached after first load | ❌ No caching benefit |
| **First Load Speed** | Slower (3 requests) | **Faster (1 request)** |
| **Subsequent Loads** | Faster (cached) | Same speed |
| **Setup Complexity** | Higher | **Lower** |
| **Maintenance** | Easier (1 CSS, 1 JS per page) | Harder (3 separate files) |
| **External Dependencies** | GitHub/CDN for CSS/JS | **None (only fonts)** |
| **CORS Issues** | Possible | **None** |
| **Squarespace Code Block** | Must include external URLs | **Just paste HTML** |

## Performance Analysis

### Scenario: User browses 3 pages in one session

**External Files:**
- Page 1: 1KB HTML + 3KB CSS + 2KB JS = **6KB** (3 requests)
- Page 2: 1KB HTML + cached CSS + cached JS = **1KB** (1 request)
- Page 3: 1KB HTML + cached CSS + cached JS = **1KB** (1 request)
- **Total: 8KB transferred, 5 requests**

**Inline Files:**
- Page 1: 12KB HTML = **12KB** (1 request)
- Page 2: 9.5KB HTML = **9.5KB** (1 request)
- Page 3: 8KB HTML = **8KB** (1 request)
- **Total: 29.5KB transferred, 3 requests**

### Analysis

For your use case:
- Users navigate between separate Squarespace pages (no SPA caching)
- Fewer HTTP requests = less latency
- 29.5KB is still very small (loads in <0.5s on slow connection)
- **Winner: Inline Files** (simpler, more reliable, fewer requests)

## When to Use Each

### Use External Files (`/docs/`) When:
- You expect users to stay on one page for a long time
- You want easier maintenance (change CSS once, affects all pages)
- You're hosting on your own server (not Squarespace)
- You have many pages (10+) that share code
- You want to keep HTML files small

### Use Inline Files (`/docs/inline/`) When:
- ✅ **Embedding in Squarespace** (your case)
- You have 3-5 pages with separate URLs
- You want simpler deployment
- You want no external dependencies
- You want fewer HTTP requests
- You want guaranteed performance (no CDN issues)

## Migration Path

If you start with inline and want to switch to external later:

1. Host the CSS and JS files on GitHub Pages or a CDN
2. Replace `<style>` tags with `<link rel="stylesheet" href="...">`
3. Replace `<script>` tags with `<script src="..."></script>`
4. Update all 3 pages

## File Structure

```
docs/
├── index.html          # External CSS/JS version (main page)
├── series.html         # External CSS/JS version (series page)
├── video.html          # External CSS/JS version (video page)
├── css/
│   ├── embed.css       # Component styles (for Squarespace)
│   └── preview.css     # Preview-only styles (NOT for Squarespace)
├── js/
│   ├── index.js        # Main page logic
│   ├── series.js       # Series page logic
│   └── video.js        # Video page logic
└── inline/
    ├── index.html      # Self-contained main page
    ├── series.html     # Self-contained series page
    ├── video.html      # Self-contained video page
    └── README.md       # Inline folder documentation
```

## Recommendation Summary

**Use `/docs/inline/` for Squarespace** because:

1. ✅ **Simpler deployment** - Just copy/paste HTML into code blocks
2. ✅ **Faster first load** - Single HTTP request per page
3. ✅ **More reliable** - No external file dependencies
4. ✅ **No CORS issues** - Everything is inline
5. ✅ **Better for 3 pages** - Caching benefits minimal with few pages

The only downside is harder maintenance (3 files to update vs 1), but for a relatively stable sermon library, this is acceptable.

## Next Steps

1. Open `/docs/inline/README.md` for deployment instructions
2. Update the URL constants in each inline HTML file
3. Copy/paste into your Squarespace code blocks
4. Test navigation between pages
5. Enjoy your sermon library! 🎉
