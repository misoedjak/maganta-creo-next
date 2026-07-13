---
name: Maganta Kreasi Design System
description: Premium Event Fabrication & Design Identity
colors:
  primary: "#FFD400"
  neutral-bg: "#0a0a0c"
  surface: "#121216"
  surface-hover: "#1c1c24"
  ink: "#ffffff"
  ink-muted: "#a1a1aa"
  border: "#27272a"
  accent-red: "#ef4444"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
  lg: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Visual Theme
A premium, dark high-contrast editorial look with a vibrant primary highlight yellow (`#FFD400`) and pure white text.

# Color Palette
- `primary`: `#FFD400` (bold, industrial safety yellow)
- `neutral-bg`: `#0a0a0c` (near-black, dark environment)
- `surface`: `#121216` (card backgrounds and sections)
- `ink`: `#ffffff` (readable white body text)
- `ink-muted`: `#a1a1aa` (muted labels)

# Typography
Using Outfit Google Font across headings and body copy to convey modern precision engineering.

# Spacing & Layout
Standard 4px grid. Responsive gaps use standard CSS/Tailwind utilities.

# Components & Elements
- Buttons: Rounded md, smooth active state.
- Cards: Minimal borders, no side-stripe borders.

# Micro-interactions & Motion
- Hover transitions should be fast and responsive.
- Smooth ease-out-quart curves for entrance animations.
