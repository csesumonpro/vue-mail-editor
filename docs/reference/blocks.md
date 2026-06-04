# Built-in blocks

The editor ships with a set of email-safe content blocks plus container layouts.
Every content block has a stable **`type`** id — pass it to `disabledBlocks` to
hide a built-in, or use it as a starting point for your own
[custom block](/guide/custom-blocks).

```vue
<!-- e.g. hide the HTML and Spacer blocks -->
<EmailEditor :disabled-blocks="['html', 'spacer']" />
```

## Container layouts

The **Container** rail holds structural rows. Drag one onto the canvas, then drop
content blocks into its columns. Columns are responsive (they stack on mobile in
the exported HTML).

| Layout | Columns | Ratio |
| ------ | ------- | ----- |
| 1 Column | 1 | full width |
| 2 Columns | 2 | 50 / 50 |
| 3 Columns | 3 | 33 / 33 / 33 |
| 4 Columns | 4 | 25 × 4 |
| 1 : 2 | 2 | 33 / 67 |
| 2 : 1 | 2 | 67 / 33 |

Row & column settings (background color, padding, vertical alignment) appear in
the inspector when you select the container or a column.

## Content blocks

| Block | `type` | What it is |
| ----- | ------ | ---------- |
| **Heading** | `heading` | A headline with rich text. |
| **Text** | `paragraph` | A body-text paragraph with inline formatting. |
| **Button** | `button` | A call-to-action link styled as a button. |
| **Image** | `image` | An image, optionally linked. |
| **Divider** | `divider` | A horizontal rule / separator. |
| **Spacer** | `spacer` | Vertical empty space. |
| **Social** | `social` | A row of social-network icons. |
| **Menu** | `menu` | A navigation row of text links. |
| **HTML** | `html` | A raw custom-HTML escape hatch. |

### Heading — `heading`
A headline rendered with the inline rich-text editor (select text for the
bold/italic/link/color bubble menu).
**Settings:** tag (H1–H3), link, font family, size, weight, color, alignment,
line height, letter spacing, padding.

### Text — `paragraph`
Body copy with inline formatting — bold, italic, underline, strikethrough, links,
and bullet/numbered lists via the bubble menu.
**Settings:** font family, size, color, alignment, line height, padding.

### Button — `button`
A call-to-action. The label is editable inline; the whole button is a link.
**Settings:** label, link + target, background color, text color, font family,
size, weight, border radius, border, alignment, full-width toggle, padding.

### Image — `image`
A single image. Set the source via URL or upload (uses your `onImageUpload`
handler, base64 otherwise).
**Settings:** source, alt text, link, width, alignment, border radius, padding.

### Divider — `divider`
A horizontal separator line.
**Settings:** color, thickness, line style, width, alignment, padding.

### Spacer — `spacer`
Pure vertical whitespace for controlling rhythm.
**Settings:** height (px).

### Social — `social`
A horizontal row of social icons. Comes with predefined networks (loaded from the
Simple Icons CDN) and supports **custom** items with your own icon URL + link.
For maximum email-client compatibility (e.g. Outlook), supply a custom PNG icon.
**Settings:** item list (network/custom, link, icon URL), icon size, spacing,
alignment, padding.

### Menu — `menu`
A row of navigation links (e.g. a header/footer nav).
**Settings:** item list (label + link), layout, font, color, spacing,
alignment, padding.

### HTML — `html`
An escape hatch for arbitrary HTML when no block fits. The markup is emitted
as-is into the export, so keep it **email-safe** (tables + inline styles).
**Settings:** raw HTML source.

## Adding your own

Register custom blocks with the `blocks` prop — they merge with the built-ins.
See [Custom blocks](/guide/custom-blocks).

```vue
<EmailEditor :blocks="[rating]" />
```
