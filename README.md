# @csesumonpro/vue-email-editor

A customizable, extensible drag-and-drop **email template editor** for Vue 3.
Theme it, register your own blocks and inspector panels, and delegate all
persistence/actions to your backend.

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
| `colorMode`      | `'light' \| 'dark' \| 'auto'`                    | `'light'` | Theme mode (per instance). |
| `config`         | `EditorConfig`                                   | —         | Feature flags (devices, actions, templates…). |
| `storage`        | `'local' \| 'none'`                              | `'local'` | `local` = localStorage autosave; `none` = host owns persistence. |
| `onImageUpload`  | `(file: File) => Promise<string>`               | base64    | Upload an image, return its URL. |
| `onSave`         | `(design) => void \| Promise`                   | download  | Handle Save Design. |
| `onSaveTemplate` | `(payload) => void \| Promise`                  | —         | Handle Save as template. |
| `onExport`       | `(html, design) => void \| Promise`             | —         | Receive exported HTML. |
| `onLoad`         | `() => Design \| Promise<Design>`               | —         | Initial design (e.g. server fetch). |

### Events
`update:modelValue`, `change(design)`, `save(design)`, `save-template(payload)`,
`export(html, design)`, `select(selection)`, `ready(api)`.

### Slots
`#header` (replace top bar), `#header-brand`, `#header-actions` (inject buttons),
`#empty` (empty-canvas state).

### Imperative API (`@ready` or template ref)
```ts
interface EditorApi {
  getDesign(): Design          // deep-cloned snapshot
  loadDesign(design: Design): void
  exportHtml(): string
  undo(): void; redo(): void
  registerBlock(def: BlockDefinition): void
  selectBody(): void
}
```

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

You can also override `--inkp-*` CSS variables on a `.vue-email-editor` wrapper.

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

## Config (feature flags)

```ts
const config: EditorConfig = {
  contentWidth: 640,
  devices: ['desktop', 'mobile'],
  actions: { import: false, saveTemplate: true },
  templates: [ /* your starter templates */ ],
  autosaveMs: 1000,
}
```

## Notes

- The exported HTML is table-based with inlined styles + Outlook (MSO)
  conditionals + mobile media queries.
- Predefined social icons load from the Simple Icons CDN (SVG); for maximum
  client compatibility (e.g. Outlook) supply a custom PNG icon URL per item.

## License

MIT
