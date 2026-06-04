# What is Vue Email Editor?

`@csesumonpro/vue-email-editor` is a customizable, extensible drag-and-drop
**email template editor** for Vue 3. It gives your users a visual canvas to build
responsive emails out of rows, columns, and content blocks — and gives you, the
developer, full control over theming, available blocks, the inspector panel, and
where data is persisted.

## Highlights

- **Self-contained** — no Pinia, no global plugin install, no directive
  registration. You can mount multiple independent editors on one page.
- **Extensible** — register custom blocks (with a Vue render component, an
  inspector schema, and an email-safe HTML exporter) and your own inspector
  accordions.
- **Themeable** — per-instance light/dark design tokens via the `theme` prop or
  `--cvee-*` CSS variables.
- **Backend-agnostic** — `storage="none"` hands persistence to you; wire
  `onLoad` / `onSave` / `onImageUpload` and the `change` / `export` events to
  your database and storage.
- **Email-safe output** — exported HTML is table-based with inlined styles,
  Outlook (MSO) conditional comments, and mobile media queries.

## How it fits together

```
┌──────────────────────────────────────────────────────────┐
│ Top bar  (logo · device toggles · actions)                │
├───────────┬──────────────────────────────┬───────────────┤
│  Blocks   │          Canvas              │   Inspector    │
│  (drag)   │  rows → columns → blocks     │  (selection)   │
└───────────┴──────────────────────────────┴───────────────┘
```

- The **design** is a plain JSON document (`Design`) — store it anywhere.
- The **canvas** renders blocks live; selecting one opens its **inspector**.
- **Export** turns the design into ready-to-send HTML.

Continue to [Getting started](/guide/getting-started).
