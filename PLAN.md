# Vue Email Editor — Build Plan

A drag-and-drop email template editor (inspired by Unlayer's Vue Email Editor, but
better). Build your email visually, edit every property in a right-side inspector,
preview across devices, and export bulletproof email-client-safe HTML.

---

## 1. Tech Stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | Vue 3 (`<script setup>`, Composition API)           |
| Build tool     | Vite                                                 |
| Language       | TypeScript (typed design schema)                    |
| State          | Pinia (design tree, selection, device, history)     |
| Styling (UI)   | TailwindCSS (editor chrome only — not the email)    |
| Drag & drop    | `vuedraggable` (SortableJS) + custom drop indicators|
| Rich text      | Tiptap (ProseMirror) with a floating toolbar        |
| Icons          | `lucide-vue-next`                                    |
| Export engine  | Custom table-based HTML generator (inline styles)   |

> The **email output** never uses Tailwind/flex/grid — it is table-based HTML with
> inline styles + MSO conditionals + media queries for client compatibility.

---

## 2. Layout (the editor shell)

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                                │
│  [logo/title]      [💻 desktop] [📱 tablet] [📱 mobile]   [👁 preview]  │
│                    [↶ undo] [↷ redo]        [Save Design] [Export HTML] │
├──────────┬───────────────────────────────────────────┬─────────────────┤
│  LEFT     │              CENTER CANVAS                 │   RIGHT          │
│  RAIL     │                                            │   INSPECTOR      │
│           │   ┌────────────────────────────────────┐  │                  │
│  Content  │   │   EMAIL BODY (fixed, e.g. 600px)    │  │  ▸ General       │
│  ───────  │   │  ┌──────────────────────────────┐  │  │  ▸ Background    │
│  ▦ Columns│   │  │ Row → Columns → Content blocks│  │  │  ▸ Links         │
│  T Heading│   │  └──────────────────────────────┘  │  │  ▸ Spacing       │
│  ¶ Text   │   │                                    │  │  ▸ Accessibility │
│  ▭ Button │   │   (drop zone, hover/select         │  │                  │
│  🖼 Image │   │    overlays, inline edit)          │  │  (changes based  │
│  ─ Divider│   │                                    │  │   on what's      │
│  ↕ Spacer │   └────────────────────────────────────┘  │   selected:      │
│  👥 Social│                                            │   body vs block) │
│  ☰ Menu   │                                            │                  │
│  ▦ Carousel                                            │                  │
│  </> HTML │                                            │                  │
└──────────┴───────────────────────────────────────────┴─────────────────┘
```

- **Left rail:** vertical list of draggable blocks. Two sub-tabs:
  - **Content** — individual blocks (Heading, Text, Button, Image, …).
  - **Blocks** — prebuilt layout rows (1 / 2 / 3 / 4 columns, common patterns).
- **Center:** the email **body** has a fixed default style (width, background, font,
  link color) that applies until a row/column/block overrides it. Clicking empty
  body space selects the body and opens body settings in the right inspector.
- **Right inspector:** accordion groups of property controls. Contextual — shows
  **body** settings, or the selected **block's** settings.

---

## 3. Data Model (the design schema)

The whole email is one serializable JSON tree: **Body → Rows → Columns → Contents**.

```ts
interface Design {
  body: Body
  schemaVersion: number
}

interface Body {
  id: string
  values: {
    contentWidth: number          // e.g. 600
    backgroundColor: string       // page bg (around the email)
    contentBackground: string     // email bg
    backgroundImage?: BgImage
    fontFamily: FontValue
    textColor: string
    linkColor: string
    preheaderText: string
    direction: 'ltr' | 'rtl'
    language: string
    padding: BoxValue
  }
  rows: Row[]
}

interface Row {
  id: string
  cells: number[]                 // 12-grid distribution, e.g. [12] | [6,6] | [4,4,4]
  columns: Column[]
  values: {
    backgroundColor?: string
    columnsBackground?: string
    backgroundImage?: BgImage
    fullWidth: boolean            // stretch bg full-width vs constrained
    padding: BoxValue
    border?: BorderValue
    borderRadius?: number
    verticalAlign: 'top'|'middle'|'bottom'
    hideOn: { desktop: boolean; mobile: boolean }
    stackOnMobile: boolean
  }
}

interface Column {
  id: string
  contents: Content[]
  values: { backgroundColor?, padding, border?, borderRadius?, verticalAlign }
}

type Content =
  | { id; type: 'heading';   values: HeadingValues }
  | { id; type: 'paragraph'; values: ParagraphValues }
  | { id; type: 'button';    values: ButtonValues }
  | { id; type: 'image';     values: ImageValues }
  | { id; type: 'divider';   values: DividerValues }
  | { id; type: 'spacer';    values: SpacerValues }
  | { id; type: 'social';    values: SocialValues }
  | { id; type: 'menu';      values: MenuValues }
  | { id; type: 'carousel';  values: CarouselValues }
  | { id; type: 'html';      values: HtmlValues }

// shared value types
interface BoxValue   { top: number; right: number; bottom: number; left: number }
interface BorderValue{ width: number; style: 'solid'|'dashed'|'dotted'; color: string }
interface BgImage    { url: string; repeat: string; size: string; position: string }
interface FontValue  { label: string; value: string } // value = CSS font stack
```

### Per-block values (inspector-editable)

- **Heading** — `text` (HTML), `level` (h1–h4), font family/size/weight, color,
  align, lineHeight, letterSpacing, link, padding.
- **Paragraph/Text** — `text` (rich HTML), font family/size, color, lineHeight,
  align, padding.
- **Button** — `text`, `href`, `target`, bg color, text color, font, border,
  borderRadius, inner padding, container padding, align, width (auto/full).
- **Image** — `src`, `alt`, `width`, align, `href`, borderRadius, padding,
  `autoWidth` (responsive full-width).
- **Divider** — color, thickness, width %, style, align, padding.
- **Spacer** — `height` (+ optional mobile height).
- **Social** — `icons[]` `{network,url}`, icon set/style, size, spacing, align, padding.
- **Menu** — `items[]` `{text,url}`, layout (h/v), font, color, separator, spacing, align.
- **Carousel** — `slides[]` `{src,alt,href}`, padding. (Degrades to stacked images in
  most clients — documented limitation.)
- **HTML** — raw `html` string.

---

## 4. Block Registry (core architectural pattern)

Every block type is registered **once** with everything it needs, so rendering,
the inspector, and export always stay in sync:

```ts
interface BlockDef {
  type: ContentType
  label: string
  icon: Component
  category: 'content' | 'layout'
  defaultValues: () => Record<string, unknown>
  canvasComponent: Component            // how it renders in the editor
  inspector: AccordionGroup[]           // which controls show, bound to value keys
  toHtml: (values, ctx) => string       // export to email HTML
}
```

Adding a new block = add one registry entry. No scattered switch statements.

---

## 5. Inspector (right panel)

A schema-driven panel of collapsible **accordion groups**, each containing reusable
**controls** bound to a value key. Editing a control commits to the store (and to
history). Reusable controls:

`TextControl`, `TextareaControl`, `NumberControl`, `SliderControl`, `ColorControl`
(picker + swatches + alpha), `SelectControl`, `AlignControl`, `SpacingControl`
(padding box), `BorderControl`, `FontControl`, `ToggleControl`, `LinkControl`,
`ImagePicker` (URL + upload), `ListEditor` (social/menu/carousel items),
`BackgroundControl`, `ResponsiveToggle` (hide on mobile/desktop).

**Body inspector accordions:** General (content width, alignment, default font,
text/link color, preheader), Background (color + image), Links, Spacing,
Accessibility (language, direction).

---

## 6. Key Subsystems

- **Selection & overlays** — hover outline, selected outline, floating mini-toolbar
  per element (move handle, duplicate, delete, up/down). Click empty body → select body.
- **Drag & drop** — left palette → canvas (clone), reorder rows / columns / contents,
  with animated drop indicators. Nested SortableJS groups.
- **Undo / redo** — snapshot history stack (cap ~50), debounced for typing/sliders,
  `structuredClone` snapshots. Ctrl/Cmd+Z / Shift+Z.
- **Autosave** — debounced write to `localStorage`; offer "restore last session" on load.
- **Device preview** — toggle canvas width (desktop 600 / tablet 480 / mobile 320);
  reflects `stackOnMobile` and `hideOn` rules live.
- **Preview mode** — full-screen iframe rendering the exported HTML, no editing chrome.
- **Save / Load** — export design JSON (download + localStorage); import to restore.

---

## 7. HTML Export Engine (the hard part)

Design JSON → email-client-safe HTML:

- Outer 100%-width table (page background) → centered container table (`contentWidth`).
- Each **Row** → `<tr>`/nested table; **Columns** → `<td>` (with MSO ghost tables for
  Outlook); **Contents** → block `toHtml()` output.
- **All styles inlined**; web-safe font stacks with fallbacks.
- **Outlook (MSO)** conditional comments for columns, buttons (VML), spacing.
- **Mobile** `<style>` media queries: stack columns, fluid images, `hideOn` classes.
- Preheader text, `<!DOCTYPE>`, proper `<head>` resets.
- Export modal: rendered preview + copy-to-clipboard + download `.html`.

Validated against the device preview so what you see matches what exports.

---

## 8. Folder Structure

```
src/
  main.ts  App.vue  style.css
  types/schema.ts
  stores/editor.ts                 # design, selection, device, preview
  composables/{useHistory,useAutosave,useDragDrop}.ts
  config/{blocks.ts, fonts.ts, templates.ts, icons.ts}
  components/
    layout/{TopBar, LeftPanel, RightPanel, EditorCanvas}.vue
    canvas/{BodyRenderer, RowRenderer, ColumnRenderer, ContentRenderer,
            DropZone, SelectionOverlay, ElementToolbar}.vue
    blocks/{Heading,Paragraph,Button,Image,Divider,Spacer,
            Social,Menu,Carousel,Html}Block.vue
    inspector/{InspectorPanel, Accordion}.vue
    inspector/controls/*.vue
    common/{RichTextEditor, DeviceFrame, ExportModal, Icon}.vue
  export/{htmlExporter.ts, inlineStyles.ts, msoHelpers.ts}
  utils/{id.ts, clone.ts, color.ts}
```

---

## 9. Phased Delivery

| Phase | Goal | Output |
| ----- | ---- | ------ |
| **0** | Scaffold | Vite+Vue+TS+Tailwind+Pinia; 3-region shell + top bar (static) |
| **1** | Schema & store | TS types, Pinia store, seed design, history + autosave composables |
| **2** | Canvas render | Body→Row→Column→Content renderers; selection + hover overlays + element toolbar |
| **3** | Core blocks | Block registry; Heading, Text, Button, Image, Divider, Spacer |
| **4** | Drag & drop | Palette→canvas, reorder, Columns/layout blocks, drop indicators |
| **5** | Inspector | Right panel, accordion + control library, body + block settings wired |
| **6** | Rich text | Tiptap inline editing + floating toolbar for Heading/Text |
| **7** | More blocks | Social, Menu, Carousel, HTML + list editors |
| **8** | Top bar features | Device preview, preview mode iframe, undo/redo, save/load |
| **9** | Export engine | Table-based HTML, MSO + media queries, export modal |
| **10**| Polish | Templates, image upload, shortcuts, empty states, a11y, responsive UI |

Each phase ends in a runnable, demoable state.

---

## 10. Stretch / Later

- Merge tags / personalization variables (`{{first_name}}`).
- Pluggable image upload backend (S3/Cloudinary) — v1 uses URL + base64.
- Collaborative editing, design versioning.
- Dark-mode-aware email output.
- Export to MJML / plain-text alternative part.
- Conditional content blocks.
```
