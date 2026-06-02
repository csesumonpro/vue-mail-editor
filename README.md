# Vue Email Editor

A drag-and-drop email template builder — design responsive emails visually and
export bulletproof, email-client-safe HTML. Built with Vue 3 + Vite + TypeScript.

![stack](https://img.shields.io/badge/Vue-3-42b883) ![vite](https://img.shields.io/badge/Vite-6-646cff) ![ts](https://img.shields.io/badge/TypeScript-5-3178c6)

## Features

- **Three-pane editor** — block palette (left), live canvas (center), contextual
  inspector (right), and a single top action bar.
- **Blocks** — Heading, Text, Button, Image, Divider, Spacer, Social, Menu,
  Carousel, Custom HTML, plus multi-column layout rows (1–4 columns).
- **Drag & drop** — drag blocks from the palette, reorder rows and content,
  move content across columns.
- **Schema-driven inspector** — every block and the body expose grouped accordions
  of controls (color, spacing, border, font, alignment, lists, image upload…).
- **Inline rich text** — edit Heading/Text directly on the canvas with a bubble
  toolbar (bold/italic/underline/link/color/lists) via Tiptap.
- **Responsive preview** — desktop / tablet / mobile, plus a clean preview mode.
- **Undo/redo + autosave** — coalesced history with keyboard shortcuts and
  localStorage autosave/restore.
- **Save / Load** — export & import the design as JSON.
- **HTML export** — table-based layout, inlined styles, Outlook (MSO) conditionals,
  mobile media queries, and a preheader — with live preview, copy and download.
- **Templates** — Blank, Welcome, Newsletter, Promo starters.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
```

## Keyboard shortcuts

| Action     | Shortcut                          |
| ---------- | --------------------------------- |
| Undo       | `Cmd/Ctrl + Z`                    |
| Redo       | `Cmd/Ctrl + Shift + Z` / `Ctrl+Y` |
| Duplicate  | `Cmd/Ctrl + D`                    |
| Delete     | `Delete` / `Backspace`            |
| Deselect   | `Esc`                             |

## Architecture

```
src/
  types/schema.ts         # Design → Body → Row → Column → Content tree
  stores/editor.ts        # Pinia: state, selection, undo/redo, mutations
  config/
    blocks.ts             # block registry (single source of truth)
    blockDefaults.ts      # default value bags per block
    inspectorSchemas.ts   # accordion + control definitions
    templates.ts          # starter designs
  components/
    layout/               # TopBar, LeftPanel, EditorCanvas, RightPanel
    canvas/               # Body/Row/Column/Content renderers + selection
    blocks/               # per-block canvas components
    inspector/            # schema-driven inspector + control library
    common/               # RichTextEditor, ExportModal, TemplatesModal, ToastHost
  export/htmlExporter.ts  # design JSON → email HTML
```

Adding a new block = one registry entry (`config/blocks.ts`), a default value bag,
an inspector schema, a canvas component, and a renderer in the exporter.

## Notes

- **Carousel** has no real support across email clients (no JS / limited CSS); on
  export it degrades to stacked images.
- **Image upload** uses base64 data URLs in this version; wire a real upload
  backend (S3/Cloudinary) in `ImageControl.vue` for production.
