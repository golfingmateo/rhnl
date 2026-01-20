# Inline Sermon Library - Squarespace Ready

This folder contains **fully self-contained** HTML files with all CSS and JavaScript embedded inline. These files are optimized for Squarespace Code Block embedding.

## Files

### index.html
Main sermons page with livestream, recent sermons, and series galleries.
- **Size**: ~11KB
- **Purpose**: Landing page for sermon library
- **Shows**: Live stream, most recent sermons, recent series, special series

### series.html
Series view page showing all videos in a specific series.
- **Size**: ~9.5KB
- **Purpose**: Display all sermons in a series
- **Receives**: `?filename=...&title=...` URL parameters

### video.html
Video player page for watching individual sermons.
- **Size**: ~8KB
- **Purpose**: Play sermon video with description
- **Receives**: `?videoId=...&title=...&description=...` URL parameters

## Advantages of Inline Version

✅ **Single HTTP Request** - Faster initial load (no external CSS/JS files)
✅ **No External Dependencies** - No reliance on GitHub/CDN availability
✅ **Simpler Deployment** - Just copy and paste into Squarespace
✅ **No CORS Issues** - Everything is self-contained
✅ **No Caching Confusion** - Changes take effect immediately

## Disadvantages

❌ **No Browser Caching** - CSS/JS re-downloaded on every page load
❌ **Larger HTML Files** - Each page is ~8-11KB (vs ~1KB + cached assets)
❌ **Harder to Maintain** - Changes must be made to 3 separate files

## Usage in Squarespace

### Step 1: Create Three Squarespace Pages

1. **Main Page**: `/sermons` (or your preferred URL)
2. **Series Page**: `/sermons/series`
3. **Video Page**: `/sermons/watch`

### Step 2: Configure Page URLs

Before embedding, edit the JavaScript section in each file to update the URL constants:

**In `index.html`** (around line 370):
```javascript
const SERIES_PAGE_URL = '/sermons/series'; // Your Squarespace series page URL
const VIDEO_PAGE_URL = '/sermons/watch';   // Your Squarespace video page URL
```

**In `series.html`** (around line 320):
```javascript
const MAIN_PAGE_URL = '/sermons';        // Your Squarespace main page URL
const VIDEO_PAGE_URL = '/sermons/watch'; // Your Squarespace video page URL
```

**In `video.html`** (around line 310):
```javascript
const MAIN_PAGE_URL = '/sermons';          // Your Squarespace main page URL
const SERIES_PAGE_URL = '/sermons/series'; // Your Squarespace series page URL
```

### Step 3: Embed in Squarespace

1. Go to your Squarespace page editor
2. Add a **Code Block**
3. Copy the **entire contents** of the HTML file
4. Paste into the code block
5. Save and publish

### Step 4: Test

Navigate between pages and verify:
- Main page loads and shows sermons
- Clicking a series navigates to series page with correct videos
- Clicking a video navigates to video page and plays
- Back buttons work correctly

## External Dependencies

These files still require external resources:

### Required (Must be accessible):
- **Google Fonts**: `https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700`
- **Material Icons**: `https://fonts.googleapis.com/icon?family=Material+Icons`
- **Sermon Data**: JSON files from your GitHub repository
- **YouTube**: Video embeds via `youtube.com`

### Optional:
- If you want to host fonts locally in Squarespace, you can remove the Google Fonts links and rely on Squarespace's default fonts
- Material Icons is only used for the back arrow - you could replace with text if needed

## Customization

### Adjusting Thumbnail Sizes

Edit the CSS custom properties (around line 20 in each file):

```css
:root {
  --thumbnail-width: 800px;
  --thumbnail-height: 450px;
}
```

### Changing Button Styles

Modify the `#return-button` CSS (around line 190 in each file) to match your theme.

### Updating Data Source

Change the `API_BASE_URL` constant (around line 370 in each file) if you move your JSON data.

## Performance Comparison

### Inline Version (This Folder)
- **First Load**: ~11KB HTML (single request)
- **Subsequent Loads**: ~11KB HTML each time
- **Total Data**: 33KB for all 3 pages

### External Version (Parent Folder)
- **First Load**: ~1KB HTML + 3KB CSS + 2KB JS = 6KB (3 requests)
- **Subsequent Loads**: ~1KB HTML (CSS/JS cached)
- **Total Data**: 3KB after first load

**Recommendation**: For Squarespace embedding with 3 separate pages, the inline version is simpler and likely faster overall, since users navigate between pages frequently and won't benefit much from caching.

## Troubleshooting

### Links Don't Work
- Verify you updated the URL constants in the JavaScript section
- Check browser console for errors
- Confirm Squarespace page URLs match exactly

### Content Not Loading
- Check browser console for CORS errors
- Verify GitHub JSON data URLs are accessible
- Test that data files have correct format

### Styling Looks Wrong
- Squarespace may have conflicting global styles
- Add `!important` to CSS rules if needed
- Check for CSS selector specificity issues

## Testing Locally

To test these files locally:

```bash
cd /Users/mtitus/Software Development/RHNL/rhnl/docs/inline
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

Update the URL constants to use relative paths (`./series.html`, `./video.html`) for local testing.
