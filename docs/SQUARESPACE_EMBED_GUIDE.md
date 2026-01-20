# Squarespace Embedding Guide

This guide explains how to embed the sermon library pages into your Squarespace website.

## Overview

The sermon library consists of 3 separate pages:
- **index.html** - Main page with livestream, recent sermons, and series
- **series.html** - Shows all videos in a specific series
- **video.html** - Plays an individual sermon video

## CSS Files

### embed.css (REQUIRED for Squarespace)
This file contains only component-specific styles that won't conflict with Squarespace's base styles:
- Gallery layouts (grid, scroll)
- Thumbnail hover effects
- Video player responsiveness
- Button styling
- Component-specific positioning

**Include this in your Squarespace embeds.**

### preview.css (PREVIEW ONLY - DO NOT USE IN SQUARESPACE)
This file contains base styles for standalone preview:
- Body styles (font, background, color)
- Heading styles (h1, h2, h4)
- Link styles
- Container layouts

**Do NOT include this in Squarespace - your site already has these styles.**

## Setup Steps

### 1. Create Three Squarespace Pages

1. **Main Sermons Page**: `/sermons` (or your preferred URL)
2. **Series Page**: `/sermons/series`
3. **Video Page**: `/sermons/watch`

### 2. Update JavaScript URL Constants

Before embedding, update the page URL constants in each JavaScript file:

**In `js/index.js` (lines 7-8):**
```javascript
const SERIES_PAGE_URL = '/sermons/series'; // Your Squarespace series page URL
const VIDEO_PAGE_URL = '/sermons/watch';   // Your Squarespace video page URL
```

**In `js/series.js` (lines 7-8):**
```javascript
const MAIN_PAGE_URL = '/sermons';        // Your Squarespace main page URL
const VIDEO_PAGE_URL = '/sermons/watch'; // Your Squarespace video page URL
```

**In `js/video.js` (lines 4-5):**
```javascript
const MAIN_PAGE_URL = '/sermons';          // Your Squarespace main page URL
const SERIES_PAGE_URL = '/sermons/series'; // Your Squarespace series page URL
```

### 3. Embed Code in Each Squarespace Page

For each page, add a **Code Block** and paste the HTML content with modifications:

#### What to Include in Squarespace Code Blocks:

```html
<!-- Include Google Fonts (if not already in your Squarespace template) -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- REQUIRED: Component styles -->
<link rel="stylesheet" href="https://raw.githack.com/golfingmateo/rhnl/main/docs/css/embed.css">

<!-- DO NOT INCLUDE preview.css -->

<!-- Copy the <div class="outside"> and its contents -->
<div class="outside">
  <div id="main">
    <!-- Content will be injected by script -->
  </div>
</div>

<!-- Copy all <template> tags -->
<!-- ... templates ... -->

<!-- Include the appropriate JavaScript file -->
<script src="https://raw.githack.com/golfingmateo/rhnl/main/docs/js/index.js" defer></script>
```

#### Main Sermons Page (`/sermons`)
- Copy from `index.html`
- Include: Google Fonts, Material Icons, `embed.css`
- Exclude: `preview.css`
- Include script: `js/index.js`

#### Series Page (`/sermons/series`)
- Copy from `series.html`
- Include: Google Fonts, Material Icons, `embed.css`
- Exclude: `preview.css`
- Include script: `js/series.js`

#### Video Page (`/sermons/watch`)
- Copy from `video.html`
- Include: Google Fonts, Material Icons, `embed.css`
- Exclude: `preview.css`
- Include script: `js/video.js`

## How Navigation Works

The pages communicate via URL query parameters:

### From Main Page to Series Page:
```
/sermons/series?filename=advent_2024.json&title=Advent%202024
```

### From Series/Main Page to Video Page:
```
/sermons/watch?videoId=ABC123&title=Sermon%20Title&thumbnail=...&description=...&series=advent_2024.json
```

### Back Button Navigation:
- Video page → Returns to main page (or series page if enhanced)
- Series page → Returns to main page

## Testing Locally

The files can be previewed locally by opening `index.html` in a browser or using:

```bash
cd docs
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

Both CSS files are included for local preview, but remember to exclude `preview.css` when embedding in Squarespace.

## Customization

### Adjusting Thumbnail Sizes

Edit the CSS custom properties in `css/embed.css`:

```css
:root {
  --thumbnail-width: 800px;
  --thumbnail-height: 450px;
}
```

### Styling Conflicts

If you experience styling conflicts in Squarespace:
1. Check that `preview.css` is NOT included
2. Add more specific selectors to `embed.css` if needed
3. Use Squarespace's Custom CSS to override specific styles

### Button Styling

The return/back button can be restyled by modifying `#return-button` in `embed.css` to match your Squarespace theme.

## Troubleshooting

### Links Don't Work
- Verify the URL constants in the JavaScript files match your Squarespace page URLs
- Check browser console for errors

### Styling Looks Wrong
- Confirm `preview.css` is NOT included in the Squarespace embed
- Only `embed.css` should be loaded
- Check for CSS conflicts with your Squarespace theme

### Content Not Loading
- Check browser console for CORS errors
- Verify GitHub URLs are accessible
- Test that the JSON data files are loading correctly

## File Structure

```
docs/
├── index.html          # Main sermons page
├── series.html         # Series view page
├── video.html          # Video player page
├── css/
│   ├── embed.css       # Component styles (USE IN SQUARESPACE)
│   └── preview.css     # Preview-only styles (DO NOT USE IN SQUARESPACE)
└── js/
    ├── index.js        # Main page logic
    ├── series.js       # Series page logic
    └── video.js        # Video page logic
```
