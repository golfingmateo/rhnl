# Horizontal Scroll for Recent Sermons

## Update Summary

The "Most Recent Sermons" section now uses a horizontal scrollable layout instead of a multi-row grid, saving vertical space while keeping all sermons accessible.

## What Changed

### Before
- Recent Sermons displayed in a multi-row grid
- Could take up 3-4 rows of vertical space
- All sermons visible at once

### After
- Recent Sermons displayed in a single horizontal scrolling row
- Takes up only one row of vertical space
- Scroll left/right to see more sermons
- Smooth scroll snapping for better UX

## Features

### Horizontal Scroll
```css
.gallery-scroll {
  display: grid;
  grid-auto-flow: column;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
```

### Benefits
✅ **Saves vertical space** - Only one row visible
✅ **Touch-friendly** - Swipe to scroll on mobile
✅ **Scroll snapping** - Cards snap into place when scrolling
✅ **Styled scrollbar** - Subtle, thin scrollbar on desktop
✅ **Responsive** - Card sizes adapt to screen width

### User Experience
- **Desktop**: Scroll with mouse wheel or drag the scrollbar
- **Mobile**: Swipe left/right to scroll through sermons
- **Tablet**: Touch and drag to scroll

## Which Sections Use Which Layout?

| Section | Layout | Reason |
|---------|--------|--------|
| **Most Recent Sermons** | Horizontal Scroll | Save space, show latest ~10 sermons |
| **Most Recent Series** | Grid (multi-row) | Show all series, better overview |
| **Special Series** | Grid (multi-row) | Show all series, better overview |

## Customization

### Change Card Width

Edit line 96 in index.html:
```css
grid-auto-columns: minmax(280px, 320px);
                           ^^^^  ^^^^
                           min   preferred
```

- Increase min = larger cards, fewer visible at once
- Decrease min = smaller cards, more visible at once

### Remove Scroll Snapping

If you don't want cards to snap into place, remove line 100:
```css
scroll-snap-type: x mandatory;  /* Remove this line */
```

### Hide Scrollbar

Add to `.gallery-scroll`:
```css
scrollbar-width: none; /* Firefox */
```
```css
.gallery-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
```

### Make Series Scrollable Too

In the templates section, change:
```html
<div id="recent-series-container" class="gallery-grid"></div>
```
to:
```html
<div id="recent-series-container" class="gallery-scroll"></div>
```

## Mobile Behavior

On mobile devices (<480px):
- Cards are sized at minimum width (280px)
- Swipe gestures work naturally
- Multiple cards visible on larger phones
- Single card visible on smaller phones

## Browser Support

✅ All modern browsers
✅ Safari (iOS/macOS)
✅ Chrome/Edge
✅ Firefox
✅ Mobile browsers

**Note**: Scroll snapping requires modern browsers (2020+)

## Performance

The horizontal scroll layout is actually **more performant** than multi-row grids:
- Only visible cards rendered initially
- Smooth hardware-accelerated scrolling
- Efficient CSS Grid layout
- No JavaScript needed for scrolling

## Accessibility

- Keyboard navigation: Tab through cards, Arrow keys to scroll
- Screen readers: Cards announced in order
- Focus indicators: Visible on keyboard focus
- Touch targets: Large enough for easy tapping (280px+ wide)

## Testing

Test the scroll behavior:

1. **Desktop**:
   - Mouse wheel should scroll horizontally
   - Drag scrollbar to navigate
   - Cards should snap into place

2. **Mobile**:
   - Swipe left/right should scroll
   - Momentum scrolling should feel smooth
   - Cards should snap to grid

3. **Squarespace**:
   - Should work in code blocks
   - Respects container width
   - No layout breaking

Enjoy your space-efficient sermon library! 🎉
