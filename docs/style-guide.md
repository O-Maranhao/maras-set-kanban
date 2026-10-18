# Style Guide: Maras-Set-Kanban

## 1. Identity
- **Project name:** Maras-Set-Kanban
- **Visual style:** Liquid Glass (Apple, iOS 26), with a colorful background for the glass to refract
- **Main colors:** Blue and Yellow

## 2. Typography
- **Font:** San Francisco (SF Pro)
- **Fallback stack (web):**
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
```
- `-apple-system` and `BlinkMacSystemFont` load SF natively on Apple devices; on the others, it falls back to the closest available font.

### Type scale
| Use | Size | Weight |
|---|---|---|
| Board title | 28px | 700 (bold) |
| Column title | 18px | 600 (semibold) |
| Card title | 15px | 600 (semibold) |
| Text/description | 13px | 400 (regular) |
| Badge/label (MoSCoW, date) | 11px | 600 (semibold), uppercase |

## 3. Color palette

### Main colors
| Name | Hex | Use |
|---|---|---|
| Primary blue | `#0A84FF` | Brand color, primary buttons, glass tint |
| Dark blue | `#0040DD` | Hover/active states, background gradient |
| Primary yellow | `#FFDE21` | Highlight, secondary CTA, accent |
| Dark yellow | `#E6C400` | Yellow hover, light alerts |

### Background (for the glass to refract)
| Name | Hex | Use |
|---|---|---|
| Base gradient | `linear-gradient(135deg, #0A84FF 0%, #001F54 50%, #FFDE21 100%)` | Page background |
| Alternative dark background | `#0B0F1A` | Dark mode, neutral base |

### Neutrals
| Name | Hex | Use |
|---|---|---|
| White | `#FFFFFF` | Text on dark glass |
| Text gray | `#1C1C1E` | Main text (light mode) |
| Secondary gray | `rgba(255,255,255,0.7)` | Secondary text on glass |

### MoSCoW colors (on the card badges)
| Priority | Color | Hex |
|---|---|---|
| Must | Red | `#FF453A` |
| Should | Yellow (brand color) | `#FFDE21` |
| Could | Blue (brand color) | `#0A84FF` |
| Won't | Gray | `rgba(255,255,255,0.4)` |

## 4. Borders and radii
| Element | Radius |
|---|---|
| Board/container | 24px |
| Column | 20px |
| Card | 16px |
| Button | 12px |
| Badge/tag | 999px (pill) |

## 5. Liquid Glass effect
```css
.glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
}
```
- Always keep a gradient or color behind it: glass over a plain white background does not produce the effect
- Apply color sparingly on controls, so the content "shines through"
- Subtle specular highlight on top via `inset box-shadow`

## 6. Spacing
- Base unit: `8px`
- Card padding: `16px`
- Gap between columns: `24px`
- Gap between cards: `12px`

## 7. Shadows
| Level | Use | Value |
|---|---|---|
| Low | Cards at rest | `0 4px 16px rgba(0,0,0,0.1)` |
| High | Card being dragged | `0 12px 40px rgba(0,0,0,0.25)` |

## 8. Principles (inherited from Liquid Glass)
1. **Hierarchy:** the card content stays in focus; the glass elevates without hiding
2. **Harmony:** consistent rounded corners across board, column, card and button
3. **Consistency:** the same color, radius and glass patterns in every component