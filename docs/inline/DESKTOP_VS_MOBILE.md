# Desktop vs Mobile Scroll Experience

## Overview

The "Most Recent Sermons" section now has optimized experiences for both desktop and mobile devices.

## Desktop Experience (≥768px)

### Features
✅ **Navigation Arrows** - Click left/right arrows to scroll
✅ **Visible Scrollbar** - Thin, styled scrollbar at the bottom
✅ **Mouse Wheel** - Scroll horizontally with mouse wheel
✅ **Smooth Scrolling** - Animated scroll transitions
✅ **Hover Effects** - Arrow buttons have hover states

### UI Elements
- **Left Arrow Button**: Scrolls back ~80% of container width
- **Right Arrow Button**: Scrolls forward ~80% of container width
- **Scrollbar**: Visible, thin, styled scrollbar for direct navigation

### Visual Design
```
┌──────────────────────────────────────────────┐
│ Most Recent Sermons              [←] [→]     │
├──────────────────────────────────────────────┤
│ [Card] [Card] [Card] [Card] [Card] ...      │
│ ━━━━━━━━━━━━━━━                              │ ← Scrollbar
└──────────────────────────────────────────────┘
```

## Mobile Experience (<768px)

### Features
✅ **Touch Gestures** - Swipe left/right to scroll
✅ **No Scrollbar** - Hidden for cleaner look
✅ **Scroll Hint** - Text shows "← Swipe to see more →"
✅ **Snap Scrolling** - Cards snap into place
✅ **Momentum Scrolling** - Natural iOS/Android feel

### UI Elements
- **No Arrow Buttons**: Arrows hidden on mobile
- **Swipe Hint**: Subtle text below gallery
- **Clean Interface**: No visible scrollbar clutter

### Visual Design
```
┌────────────────────────┐
│ Most Recent Sermons    │
├────────────────────────┤
│ [Card] [Card] [Card]   │ ← Swipe here
│                        │
│ ← Swipe to see more →  │ ← Hint text
└────────────────────────┘
```

## Breakpoint Details

| Screen Size | Behavior |
|-------------|----------|
| **< 768px** (Mobile) | Touch swipe only, no arrows, no scrollbar, hint text |
| **≥ 768px** (Desktop) | Arrow buttons, visible scrollbar, no hint text |

## Technical Implementation

### CSS Media Queries

**Desktop (≥768px):**
- Shows `.scroll-nav` (arrow buttons)
- Shows scrollbar
- Hides `.scroll-hint`
- Larger cards (320-360px)

**Mobile (<768px):**
- Hides `.scroll-nav`
- Hides scrollbar
- Shows `.scroll-hint`
- Smaller cards (280-320px)

### JavaScript
```javascript
setupScrollButtons() {
  // Scrolls 80% of container width
  scrollContainer.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
}
```

## User Experience

### Desktop Users Can:
1. Click arrow buttons to navigate
2. Use mouse wheel to scroll
3. Drag the scrollbar
4. Click and drag the gallery
5. Use keyboard (Tab + Arrow keys)

### Mobile Users Can:
1. Swipe left/right to scroll
2. Momentum scrolling for quick navigation
3. Cards snap into place
4. See hint text for discoverability

## Customization

### Change Scroll Amount

Edit line 494 in JavaScript:
```javascript
const scrollAmount = scrollContainer.clientWidth * 0.8;
                                                    ^^^
                                               0.5 = half page
                                               1.0 = full page
```

### Change Hint Text

Edit line 330 in HTML:
```html
<div class="scroll-hint">← Swipe to see more →</div>
```

### Hide Hint Text

Remove line 330 or set `display: none` in CSS

### Change Arrow Style

Edit `.scroll-btn` styles (lines 150-177):
- Change `border-radius: 50%` for square buttons
- Adjust `width` and `height` for size
- Change colors in `background` and `border`

### Mobile Breakpoint

Change `768px` in media queries to your preferred breakpoint:
```css
@media (min-width: 768px) {
              /* Change this */
}
```

## Accessibility

### Keyboard Navigation
- **Tab**: Move between cards
- **Arrow Left/Right**: Scroll the container
- **Enter/Space**: Click focused card

### Screen Readers
- Arrow buttons have `aria-label` attributes
- Cards maintain semantic structure
- Focus indicators visible

### Touch Targets
- Arrow buttons: 40x40px (meets WCAG 2.5.5)
- Card targets: 280px+ wide (easy to tap)

## Browser Support

| Feature | Support |
|---------|---------|
| CSS Grid | All modern browsers |
| Scroll Snap | Chrome 69+, Safari 11+, Firefox 68+ |
| Smooth Scroll | Chrome 61+, Safari 15.4+, Firefox 36+ |
| Touch Events | All mobile browsers |

## Performance

The implementation is highly performant:
- **CSS-only** scrolling (no JavaScript for scroll)
- **Hardware-accelerated** smooth scrolling
- **Efficient** event listeners
- **Lazy** button setup (after content loads)

## Testing Checklist

### Desktop
- [ ] Arrow buttons appear above gallery
- [ ] Left arrow scrolls backward
- [ ] Right arrow scrolls forward
- [ ] Scrollbar is visible and functional
- [ ] Mouse wheel scrolls horizontally
- [ ] Hover states work on buttons

### Mobile
- [ ] Arrow buttons are hidden
- [ ] Swipe left/right works smoothly
- [ ] Momentum scrolling feels natural
- [ ] Cards snap into place
- [ ] Hint text is visible
- [ ] Scrollbar is hidden

### Both
- [ ] Cards have correct sizing
- [ ] Gaps are consistent
- [ ] Hover effects on cards work
- [ ] Click/tap to open video works
- [ ] Responsive at all sizes

## Edge Cases

### What if there are only 2-3 sermons?
- Still shows scroll UI but everything fits
- Arrow buttons do nothing (no scroll needed)
- This is fine - UI is consistent

### What if there are 20+ sermons?
- Works perfectly - scroll as much as needed
- Arrow buttons scroll in chunks
- Scrollbar shows position

### What if JavaScript is disabled?
- Scroll still works (CSS only)
- Arrow buttons don't work (but visible)
- Mobile swipe still works
- Degraded but functional

Enjoy the improved desktop/mobile experience! 🎉
