# @csesumonpro/vue-email-editor

A customizable, extensible drag-and-drop **email template editor** for Vue 3.
Theme it, register your own blocks and inspector panels, and delegate all
persistence/actions to your backend.

📖 **Full documentation:** run `npm run docs:dev` (or browse the deployed site at
`/docs`). The `docs/` directory is a [VitePress](https://vitepress.dev) site.

```bash
npm install @csesumonpro/vue-email-editor
```

```ts
// peer dependency
npm install vue
```

## Quick start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import '@csesumonpro/vue-email-editor/style.css'
import type { Design } from '@csesumonpro/vue-email-editor'

const design = ref<Design>()
</script>

<template>
  <!-- give it a sized container; the editor fills 100% height -->
  <div style="height: 100vh">
    <EmailEditor v-model="design" />
  </div>
</template>
```

The editor is fully self-contained — no Pinia, no global setup, no directive
registration. You can mount several independent instances on one page.

## Props

| Prop             | Type                                            | Default   | Description |
| ---------------- | ----------------------------------------------- | --------- | ----------- |
| `v-model`        | `Design`                                        | —         | Two-way design JSON (controlled mode). |
| `blocks`         | `BlockDefinition[]`                              | `[]`      | Custom blocks (merged with built-ins). |
| `disabledBlocks` | `string[]`                                       | `[]`      | Hide built-in block types. |
| `theme`          | `ThemeTokens`                                    | —         | Color/typography overrides (light + dark). |
| `colorMode`      | `'light' \| 'dark' \| 'auto'`                    | `'light'` | Theme mode — two-way via `v-model:colorMode`. |
| `preview`        | `boolean`                                        | —         | Preview mode — two-way via `v-model:preview`. |
| `config`         | `EditorConfig`                                   | —         | Feature flags (devices, actions, templates…). |
| `storage`        | `'local' \| 'none'`                              | `'local'` | `local` = localStorage autosave; `none` = host owns persistence. |
| `onImageUpload`  | `(file: File) => Promise<string>`               | base64    | Upload an image, return its URL. |
| `onSave`         | `(design) => void \| Promise`                   | download  | Handle Save Design. |
| `onSaveTemplate` | `(payload) => void \| Promise`                  | —         | Handle Save as template. |
| `onExport`       | `(html, design) => void \| Promise`             | —         | Receive exported HTML. |
| `onLoad`         | `() => Design \| Promise<Design>`               | —         | Initial design (e.g. server fetch). |

### Events
`update:modelValue`, `update:colorMode`, `update:preview`, `change(design)`,
`save(design)`, `save-template(payload)`, `export(html, design)`,
`select(selection)`, `ready(api)`.

### Slots
`#header` (replace top bar), `#header-brand`, `#header-actions` (inject buttons),
`#empty` (empty-canvas state).

### Imperative API (`@ready` or template ref)
```ts
interface EditorApi {
  getDesign(): Design          // deep-cloned snapshot
  loadDesign(design: Design): void
  newDesign(): void            // clear to a fresh, empty design (no prompt)
  exportHtml(): string         // returns email-safe HTML
  save(): void | Promise       // fire Save flow (emit `save` + onSave)
  export(): void | Promise     // fire Export flow (emit `export` + onExport)
  undo(): void; redo(): void
  registerBlock(def: BlockDefinition): void
  selectBody(): void
}
```

> Commands live on the API; UI **state** (dark/light, preview) is controlled via
> `v-model:colorMode` and `v-model:preview` — one source of truth you can set
> and read.

## Build your own block

```vue
<!-- RatingBlock.vue -->
<script setup lang="ts">
defineProps<{ values: { stars: number; color: string }; editing?: boolean }>()
defineEmits<{ update: [patch: Partial<{ stars: number; color: string }>] }>()
</script>
<template>
  <div :style="{ textAlign: 'center', fontSize: '26px', color: values.color }">
    <span v-for="n in values.stars" :key="n">★</span>
  </div>
</template>
```

```ts
import { defineBlock } from '@csesumonpro/vue-email-editor'
import { Star } from 'lucide-vue-next'
import RatingBlock from './RatingBlock.vue'

export const rating = defineBlock<{ stars: number; color: string }>({
  type: 'rating',
  label: 'Rating',
  icon: Star,
  defaultValues: () => ({ stars: 5, color: '#f59e0b' }),
  render: RatingBlock,                      // canvas component (values/selected/editing + update)
  inspector: [
    { title: 'Rating', controls: [
      { type: 'number', key: 'stars', label: 'Stars', min: 1, max: 5 },
      { type: 'color',  key: 'color', label: 'Color' },
    ] },
  ],
  toHtml: (v) => `<div style="text-align:center;color:${v.color}">${'★'.repeat(v.stars)}</div>`,
})
```

```vue
<EmailEditor :blocks="[rating]" />
```

**Inspector controls** (the allowed catalog): `text`, `textarea`, `number`,
`slider`, `color`, `select`, `align`, `toggle`, `spacing`, `border`, `font`,
`link`, `image`, `background`, `list`.

## Theming

Tokens are scoped to each editor instance, so multiple themes coexist.

```vue
<EmailEditor
  color-mode="auto"
  :theme="{
    colors: { accent: '#7c3aed', primary: '#111827' },
    dark:   { accent: '#a78bfa' },
    font:   { sans: 'Inter, sans-serif', baseSize: '15px' },
  }"
/>
```

You can also override `--cvee-*` CSS variables on a `.vue-email-editor` wrapper.

## Server-side (database) usage

```vue
<script setup lang="ts">
import { EmailEditor } from '@csesumonpro/vue-email-editor'

async function load()        { return (await api.get('/designs/1')).data }
async function save(design)  { await api.put('/designs/1', design) }
async function upload(file)  { return (await api.upload(file)).url }
</script>

<template>
  <EmailEditor
    storage="none"
    :on-load="load"
    :on-save="save"
    :on-image-upload="upload"
    @export="(html) => api.post('/render', { html })"
  >
    <template #header-actions>
      <button @click="publish">Publish</button>
    </template>
  </EmailEditor>
</template>
```

With `storage="none"` nothing is written to localStorage — your database is the
single source of truth.

### What to persist

The **`design` is plain JSON** — store it in one column (`jsonb`/`json`/`text`).
The exported `html` is derived; only persist it if you want a ready-to-send
render cache.

```
designs:  id | name | design (jsonb) | html (text, optional) | updated_at
```

- `onLoad()` runs on mount → fetch and return the design JSON from your DB.
- `onSave(design)` runs when the user clicks **Save** → write the JSON to your DB.
- `exportHtml()` (via `@ready`) or `@export` gives you the final email HTML.

### Server-side autosave

> `config.autosaveMs` only debounces the built-in **localStorage** autosave
> (`storage="local"`). With `storage="none"` it does nothing — you own the
> save cadence.

For continuous save-to-database, debounce the `change` event yourself:

```vue
<script setup lang="ts">
import { debounce } from 'lodash-es'
import type { Design } from '@csesumonpro/vue-email-editor'

async function load() { return (await api.get('/designs/1')).data.design }

// this 1000ms is your real-DB "autosaveMs" — tune it freely
const autosave = debounce((design: Design) => {
  api.put('/designs/1', { design })
}, 1000)
</script>

<template>
  <EmailEditor storage="none" :on-load="load" @change="autosave" />
</template>
```

`change` already fires debounced (~300ms) on every edit; the extra `debounce`
batches DB writes. Use `onSave` for an explicit "Save" button on top of (or
instead of) this.

## Config (feature flags)

```ts
const config: EditorConfig = {
  contentWidth: 640,
  devices: ['desktop', 'mobile'],
  actions: { import: false, saveTemplate: true },
  templates: [ /* your starter templates */ ],
  autosaveMs: 1000, // localStorage debounce only; ignored when storage="none"
}
```

## Customizing the top bar

Everything in the top bar is configurable from the host app — swap the logo,
show/hide built-in actions, add your own buttons, or replace the bar entirely.

| Goal | How |
| ---- | --- |
| Show/hide a built-in action | `config.actions.<name>` (boolean) |
| Rename a built-in label/tooltip | `config.labels.<name>` (string) |
| Replace the logo / brand | `#header-brand` slot |
| Add custom buttons (keep built-ins) | `#header-actions` slot |
| Fully custom toolbar (own labels/layout) | `#header` slot |
| Trigger the editor from your buttons | `@ready="api = $event"` (or events) |

### Show / hide built-in actions
```vue
<EmailEditor
  :config="{
    actions: {
      undo: true, preview: true, theme: true,
      templates: false, new: false, import: false,
      save: true, saveTemplate: true, export: true,
    },
  }"
/>
```
All default to `true` except `saveTemplate` (defaults `false`). Set `false` to hide.

### Rename built-in labels — `config.labels`
Relabel the built-in actions (button text + tooltips) without replacing the bar:
```vue
<EmailEditor
  :config="{
    labels: {
      brand: 'Acme Mailer',
      save: 'Publish',
      export: 'Get HTML',
      saveTemplate: 'Save template',
      undo: 'Undo', redo: 'Redo', preview: 'Preview',
      templates: 'Templates', new: 'New design', import: 'Import JSON',
    },
  }"
/>
```
Every label is optional — unset keys keep their defaults. `brand` only applies
when you haven't overridden the `#header-brand` slot.

### Replace the logo — `#header-brand`
```vue
<EmailEditor>
  <template #header-brand>
    <img src="/logo.svg" alt="Acme" style="height: 24px" />
  </template>
</EmailEditor>
```

### Add custom actions — `#header-actions`
Your buttons render next to the built-ins; wire them via the imperative API:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import type { EditorApi } from '@csesumonpro/vue-email-editor'
const api = ref<EditorApi>()
function publish() { myBackend.publish(api.value!.exportHtml()) }
</script>

<template>
  <EmailEditor @ready="api = $event">
    <template #header-actions>
      <button @click="publish">Publish</button>
    </template>
  </EmailEditor>
</template>
```

### Fully custom toolbar — `#header`
Replace the whole bar (your own labels/layout) and drive it via the API:
```vue
<EmailEditor @ready="api = $event">
  <template #header>
    <header class="my-toolbar">
      <img src="/logo.svg" />
      <button @click="api?.undo()">Undo</button>
      <button @click="api?.exportHtml()">Export</button>
    </header>
  </template>
</EmailEditor>
```
With `#header` you own the markup, so wire every action through the
`EditorApi` (`@ready`) and/or the events.

## Notes

- The exported HTML is table-based with inlined styles + Outlook (MSO)
  conditionals + mobile media queries.
- Predefined social icons load from the Simple Icons CDN (SVG); for maximum
  client compatibility (e.g. Outlook) supply a custom PNG icon URL per item.

## License

MIT
