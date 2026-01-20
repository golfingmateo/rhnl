# Improved Layout - January 2026

## Changes Made

The inline HTML files have been completely redesigned with a simpler, more robust CSS grid layout optimized for Squarespace embedding.

## What Changed

### Before (Original Layout)
- Complex CSS with CSS custom properties for fixed thumbnail sizes
- Scroll galleries with horizontal overflow
- Stacked grid layout with absolute positioning
- Fixed thumbnail dimensions that could break in Squarespace

### After (New Layout)
- **Simple CSS Grid**: `repeat(auto-fill, minmax(280px, 1fr))`
- **Fully Responsive**: Adapts to any container width
- **Cleaner Code**: Easier to customize and maintain
- **Better Squarespace Compatibility**: No conflicts with Squarespace styles

## Key Improvements

### 1. Responsive Grid Layout
```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```
- Automatically fits as many columns as possible
- Minimum card width: 280px (320px on tablets+)
- Consistent gaps between items
- No horizontal scrolling needed

### 2. Simplified Thumbnail Cards
- Aspect ratio maintained with padding-bottom technique
- Hover overlay with "WATCH" text
- Smooth transitions
- Clean, modern aesthetic

### 3. Better Mobile Support
- Single column on mobile (<480px)
- Larger touch targets
- Better readability
- Faster loading

### 4. Cleaner CSS
- Removed complex positioning
- No CSS custom properties that could conflict
- Scoped class names (`.sermon-library-container`)
- Self-contained styling

## File Sizes

| File | Old Size | New Size | Change |
|------|----------|----------|--------|
| index.html | ~12KB | ~9.5KB | -20% |
| series.html | ~9.5KB | ~8KB | -16% |
| video.html | ~8KB | ~7KB | -12% |

## Browser Compatibility

✅ Modern browsers (Chrome, Firefox, Safari, Edge)
✅ Mobile browsers (iOS Safari, Chrome Mobile)
✅ Squarespace Code Blocks
✅ Works without JavaScript (layout only)

## What Stayed The Same

- URL parameter navigation
- JSON data fetching from GitHub
- Livestream logic (Sunday 10:30am-12:30pm Hawaii time)
- Thumbnail click handlers
- All functionality preserved

## Testing

Test the new layout by:

1. **Desktop**: Resize browser window - cards should reflow smoothly
2. **Mobile**: View on phone - should show single column
3. **Tablet**: View on tablet - should show 2-3 columns
4. **Squarespace**: Paste into code block - should respect container width

## Customization

### Change Card Sizes

Edit line 81 in each HTML file:
```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                                                 ^^^^
                                              Change this
```

- Smaller number = more columns, smaller cards
- Larger number = fewer columns, larger cards

### Change Spacing

Edit line 82:
```css
gap: 24px;  /* Space between cards */
```

### Change Colors

The hover overlay color is defined at line 129:
```css
background: rgba(0, 0, 0, 0.6);  /* Black at 60% opacity */
```

## Migration from Old Layout

If you already embedded the old layout in Squarespace:

1. Copy the new HTML file content
2. Paste over the old code in your Squarespace code block
3. Update the URL constants if needed (same lines as before)
4. Save and preview

**No other changes needed** - the JavaScript is identical!

## Troubleshooting

### Cards too small
Increase the minmax value: `minmax(320px, 1fr)` or `minmax(360px, 1fr)`

### Too many columns
Increase the minmax value to force fewer columns

### Not responsive
Make sure the code block width is set to "full width" in Squarespace

### Images not loading
Check browser console for CORS errors - GitHub URLs should work

## Performance

The new layout is actually **faster** than the old layout:
- Less CSS to parse
- Simpler rendering
- No complex calculations
- Better browser optimization

## Feedback

The new layout should be much more robust in Squarespace. If you encounter any issues, check:

1. Browser console for JavaScript errors
2. Network tab for failed image loads
3. Squarespace preview vs published view (sometimes different)

Enjoy your improved sermon library! 🎉
