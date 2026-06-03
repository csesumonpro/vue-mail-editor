# Plan — Turn the editor into a reusable npm package

Goal: ship `@csesumonpro/vue-email-editor` (placeholder name) — a Vue 3 component library
that other developers drop into their app, fully themeable, extensible with their
own blocks/inspector accordions, with all persistence/actions delegated to the host
(server-side friendly).

> Branch: `feature/npm-package`. This document is the agreed scope before coding.

---

## 1. Decisions (locked)

- **Structure:** single package built from `src/` (Vite library mode) + a `playground/`
  demo app that consumes it.
- **State:** per-instance via `provide/inject` (a `useEditor()` composable). **Drop
  Pinia** — no peer dep, true multi-instance isolation.
- **Actions / server scope:** async function props (primary) + events (notify) +
  slots (full custom UI) + opt-in built-ins. A `storage` mode picks the default
  behavior: `'local'` (localStorage autosave/restore) · `'none'` (host owns all
  persistence via hooks — for server/database) .
- **Name:** scoped `@csesumonpro/vue-email-editor` (you'll scope: @csesumonpro before publish).

---

## 2. Public API (the contract)

### `<EmailEditor>` — the root component

**Props**
| Prop | Type | Purpose |
| ---- | ---- | ------- |
| `v-model` (`modelValue`) | `Design` | Two-way design JSON. |
| `blocks` | `BlockDefinition[]` | Custom blocks to register (merged with built-ins). |
| `disabledBlocks` | `string[]` | Hide specific built-in block types. |
| `theme` | `Partial<ThemeTokens>` | Color/typography/radius overrides (light + dark). |
| `colorMode` | `'light' \| 'dark' \| 'auto'` | Theme mode. |
| `config` | `EditorConfig` | Feature flags (see below). |
| `storage` | `'local' \| 'none'` | Built-in persistence mode (default `local`). |
| `readonly` | `boolean` | Lock editing (preview-style). |
| `onImageUpload` | `(file: File) => Promise<string>` | Host upload → returns URL. Fallback: base64. |
| `onSave` | `(design: Design) => Promise<void> \| void` | Save Design handler. |
| `onSaveTemplate` | `(payload: TemplatePayload) => Promise<void> \| void` | Save as template. |
| `onExport` | `(html: string, design: Design) => Promise<void> \| void` | Export handler. |
| `onLoad` | `() => Promise<Design> \| Design` | Initial load (server fetch). |

**Events** (notify; fire-and-forget)
`update:modelValue`, `change(design)`, `save(design)`, `save-template(payload)`,
`export(html, design)`, `select(selection)`, `ready(api)`.

**Slots**
- `#header` — replace the whole top bar.
- `#header-brand` — brand/logo area only.
- `#header-actions` — inject/replace action buttons (host renders its own).
- `#empty` — empty-canvas message.
- `#left-extra`, `#right-extra` — append to rails/inspector (optional).

**Imperative API** (via `ready(api)` or template ref + `defineExpose`)
```ts
interface EditorApi {
  getDesign(): Design
  loadDesign(design: Design): void
  exportHtml(): string
  undo(): void; redo(): void
  registerBlock(def: BlockDefinition): void
  selectBody(): void
}
```

### Block plugin API (custom components)

```ts
interface BlockDefinition<V = Record<string, unknown>> {
  type: string                         // unique key
  label: string
  icon: Component                      // rail icon
  category?: 'content' | 'layout'
  defaultValues: () => V
  render: Component                    // canvas component (see contract below)
  inspector?: InspectorGroup[]         // accordions of allowed controls
  toHtml: (values: V, ctx: ExportContext) => string   // email output
}
```
Canvas `render` component contract (decoupled from internals — portable):
```ts
defineProps<{ values: V; selected: boolean; editing: boolean }>()
defineEmits<{ 'update': [patch: Partial<V>]; 'commit': [] }>()
```
Helpers exported for authors: `defineBlock(def)`, style utils (`padding()`, `border()`),
and the control catalog (below).

### Inspector control catalog (constrained — "not too much customization")

Authors compose **groups** of **allowed controls** only (no arbitrary Vue injected):
`text · textarea · number · slider · color · select · align · toggle · spacing ·
border · font · link · image · background · list`.
```ts
interface InspectorGroup { title: string; icon?: Component; controls: ControlDef[] }
```
This keeps every block's settings panel visually consistent and safe.

### Theme tokens
```ts
interface ThemeTokens {
  colors: { app, surface, sidebar, muted, hover, active, input, line, ink,
            subtle, faint, accent, onAccent, primary, onPrimary, header, headerFg, ... }
  dark?: Partial<ThemeTokens['colors']>
  radius?: { sm, md, lg }
  font?: { sans: string; mono: string; baseSize: string }
}
```
Applied as CSS variables **scoped to the editor root** (`.vue-email-editor`), not
`:root` — so multiple instances/themes coexist and nothing leaks globally.

### EditorConfig (feature flags)
```ts
interface EditorConfig {
  contentWidth?: number
  devices?: ('desktop'|'tablet'|'mobile')[]
  actions?: { save?, saveTemplate?, export?, import?, templates?, undo?, preview?, theme? }  // show/hide
  templates?: TemplateDef[]            // host-provided starter templates
  autosaveMs?: number
}
```

---

## 3. Required refactors (why each phase exists)

1. **Global store → per-instance.** `stores/editor.ts` (global Pinia singleton) becomes
   `core/createEditor()` returning reactive state + actions, `provide()`d by
   `<EmailEditor>` and consumed via `useEditor()` `inject()`. Every component that does
   `useEditorStore()` switches to `useEditor()`. (Largest change.)
2. **Block components decoupled from the store.** Today blocks (Heading/Button) import
   the store directly. They must instead take `values/selected/editing` props and emit
   `update`, so third-party blocks never touch internals. A thin adapter in
   `ContentRenderer` wires emits → store.
3. **Registry becomes runtime.** Built-ins + `props.blocks` merged into an injected
   registry; `disabledBlocks` filters. Built-ins re-authored via the public
   `defineBlock` API to prove the API is sufficient (dogfooding).
4. **Theme tokens scoped to root** + `theme` prop → CSS vars; fix `v-tooltip` (rendered
   to body) to read resolved colors so it still themes correctly.
5. **Actions delegated.** Replace hardcoded download/localStorage with hooks + events;
   `storage: 'none'` disables localStorage; `onImageUpload` replaces base64 default.
6. **Library build + types.** Vite lib mode, `vue-tsc` `.d.ts` emit, `package.json`
   `exports`, externalize `vue`, ship CSS.

---

## 4. Folder structure (target)

```
/
  package.json            # name, version, exports, peerDeps: vue; sideEffects: css
  vite.config.ts          # LIBRARY build (entry src/index.ts → dist/)
  vite.playground.ts      # demo dev/build (or playground/vite.config.ts)
  tsconfig.*              # app + node + build (declaration)
  src/                    # THE LIBRARY
    index.ts              # public exports
    EmailEditor.vue       # root (was App shell)
    core/
      createEditor.ts     # per-instance reactive state + actions (ex stores/editor)
      useEditor.ts        # inject() accessor
      keys.ts             # injection keys
      history.ts, selection.ts
    api/
      defineBlock.ts, types.ts          # BlockDefinition, EditorApi, ControlDef…
      theme.ts                          # ThemeTokens + themeToCssVars()
    blocks/               # built-ins authored via defineBlock
    components/           # layout, canvas, inspector, common (as today)
    directives/tooltip.ts
    export/htmlExporter.ts
    styles/index.css      # tokens scoped to .vue-email-editor + component css
  playground/
    main.ts, App.vue      # consumes the library, demos custom block + theme + hooks
  dist/                   # build output (gitignored)
```

`src/index.ts` exports:
```ts
export { default as EmailEditor } from './EmailEditor.vue'
export { defineBlock } from './api/defineBlock'
export type { Design, BlockDefinition, ThemeTokens, EditorConfig, EditorApi,
  InspectorGroup, ControlDef } from './api/types'
export * as styleUtils from './utils/style'
import './styles/index.css'
```

---

## 5. Delivery phases

| Phase | Title | Outcome |
| ----- | ----- | ------- |
| **P0** | Library scaffold | package.json/exports, Vite lib config, split current app → `playground/`; lib builds an empty `<EmailEditor>` shell. |
| **P1** | Per-instance state | `createEditor()` + `useEditor()` provide/inject; remove Pinia; all components migrated; behavior identical in playground. |
| **P2** | Public block API | `defineBlock`, runtime registry, decoupled block render contract; rewrite built-ins via the API; `blocks`/`disabledBlocks` props. |
| **P3** | Theming API | tokens scoped to root, `theme` + `colorMode` props, tooltip theming fix. |
| **P4** | Slots & config | header/brand/actions slots, `EditorConfig.actions` show/hide, host `templates`. |
| **P5** | Action hooks + storage | `onSave/onSaveTemplate/onExport/onImageUpload/onLoad`, events, `storage: local\|none`, autosave gated. |
| **P6** | Imperative API | `defineExpose` + `ready(api)`; `v-model` design. |
| **P7** | Inspector public API | control catalog typing, custom accordions per block, validation. |
| **P8** | Build & docs | `.d.ts` emit, externalize vue, README with usage + “build your own block” + theming + server example; `npm pack` dry-run. |

Each phase: builds green, playground runs, committed (after your confirmation per phase).

---

## 6. Example (target DX for a consumer)

```vue
<script setup>
import { EmailEditor, defineBlock } from '@csesumonpro/vue-email-editor'
import '@csesumonpro/vue-email-editor/style.css'
import RatingBlock from './RatingBlock.vue'

const myBlock = defineBlock({
  type: 'rating', label: 'Rating', icon: StarIcon,
  defaultValues: () => ({ stars: 5, color: '#f59e0b' }),
  render: RatingBlock,
  inspector: [{ title: 'Rating', controls: [
    { type: 'number', key: 'stars', label: 'Stars', min: 1, max: 5 },
    { type: 'color', key: 'color', label: 'Color' },
  ]}],
  toHtml: (v) => `<div style="color:${v.color}">${'★'.repeat(v.stars)}</div>`,
})

const design = ref(null)
async function uploadImage(file) { return await api.upload(file) } // server
async function save(d) { await api.put('/designs/1', d) }          // server
</script>

<template>
  <EmailEditor
    v-model="design"
    :blocks="[myBlock]"
    :disabled-blocks="['html']"
    :theme="{ colors: { accent: '#7c3aed' }, font: { baseSize: '15px' } }"
    color-mode="auto"
    storage="none"
    :on-image-upload="uploadImage"
    :on-save="save"
    @export="(html) => api.post('/render', { html })"
  >
    <template #header-actions>
      <button @click="publish">Publish</button>
    </template>
  </EmailEditor>
</template>
```

---

## 7. Risks / notes
- **Big migration (P1/P2):** every `useEditorStore()` and store-coupled block changes.
  Done carefully phase-by-phase with green builds.
- **Tooltip theming:** body-rendered tooltip must read editor colors (resolve on show).
- **CSS scoping:** Tailwind v4 `@theme` currently emits to `:root`; we’ll move semantic
  tokens onto `.vue-email-editor` and keep Tailwind utilities working.
- **Backward compatibility:** the playground keeps using the same features; the public
  API is additive over today’s behavior.
```
