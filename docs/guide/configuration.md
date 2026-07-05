# Configuration

Pass an `EditorConfig` object to the `config` prop to toggle features, rename
actions, set the default content width, and provide starter templates.

::: code-group

```ts [TS]
import type { EditorConfig } from 'vue-mail-editor'

const config: EditorConfig = {
  contentWidth: 640,
  devices: ['desktop', 'mobile'],
  actions: { import: false, saveTemplate: true },
  labels: { save: 'Publish', export: 'Get HTML' },
  templates: [ /* your starter templates */ ],
  autosaveMs: 1000, // localStorage debounce only; ignored when storage="none"
}
```

```js [JS]
const config = {
  contentWidth: 640,
  devices: ['desktop', 'mobile'],
  actions: { import: false, saveTemplate: true },
  labels: { save: 'Publish', export: 'Get HTML' },
  templates: [ /* your starter templates */ ],
  autosaveMs: 1000, // localStorage debounce only; ignored when storage="none"
}
```

:::

```vue
<EmailEditor :config="config" />
```

## Fields

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `contentWidth` | `number` | template default | Email content width (px) for new designs. |
| `devices` | `('desktop' \| 'tablet' \| 'mobile')[]` | all three | Which device-preview toggles to show. |
| `actions` | `EditorActions` | all on (`saveTemplate` off) | Show/hide built-in top-bar actions. |
| `labels` | `EditorLabels` | English defaults | Rename built-in action labels & tooltips. |
| `labeledActions` | `boolean` | `false` | Show text labels on the Save/Export buttons (icon-only otherwise). |
| `templates` | `TemplateDef[]` | built-ins | Replace the starter-template gallery. |
| `autosaveMs` | `number` | `800` | localStorage autosave debounce (ms). |
| `meta` | `boolean \| MetaFields` | all shown | Email metadata header (subject/from/reply-to/preview). |

## `templates` — starter gallery

The **"Choose a template"** picker's cards. Passing `templates` **replaces** the
built-in gallery. Each entry is a `TemplateDef`:

```ts
interface TemplateDef {
  id: string
  name: string
  description: string
  accent: string        // Tailwind gradient classes for the thumbnail card
  build: () => Design   // returns the design loaded when the card is picked
}
```

```ts
const config: EditorConfig = {
  templates: [
    {
      id: 'welcome',
      name: 'Welcome',
      description: 'Onboarding email with logo, intro and CTA.',
      accent: 'from-indigo-400 to-violet-500',
      build: () => myWelcomeDesign, // any Design object
    },
  ],
}
```

These are **static** starter designs. To surface designs your users **saved**
(via `onSaveTemplate`) in this same gallery, map each stored design into a
`TemplateDef` whose `build()` returns it — see
[Reuse saved templates in the gallery](/guide/server-side#reuse-saved-templates-in-the-gallery).

## `meta` — email header fields

A header card above the email with **From**, **Reply-To**, **Subject**, and
**Preview text** (Reply-To and Preview collapse to chips until used; Subject and
Preview support <code v-pre>{{</code> variables). It's **off by default** — opt in:

```ts
const config: EditorConfig = {
  meta: true,                                 // show all four fields
  // meta: { from: true, subject: true },     // or pick fields
}
```

All four fields are stored on **`design.meta`** (`subject`, `from`, `replyTo`,
`preview`) — read them from the saved design when you send. Subject/from/reply-to
aren't in the exported HTML; the **preview** (`design.meta.preview`) is also
rendered as the email's hidden preheader.

### Custom header — the `#meta` slot

The built-in fields are plain inputs and **can't verify a sender domain** (that's
a server-side concern). For a validated **From** — or any custom layout — replace
the whole header with the `#meta` **scoped slot**.

::: warning You own the styling
The slot content is **fully custom** — the editor doesn't style it, and its CSS
baseline strips the default border/padding from `<input>` / `<select>`. Style
your fields (like the `<style>` below) or they'll render bare.
:::

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { EmailEditor } from 'vue-mail-editor'

const design = ref()
// Your verified senders — loaded from your backend (dynamic data).
const verifiedSenders = ref([])
onMounted(async () => {
  verifiedSenders.value = await fetch('/api/verified-senders').then((r) => r.json())
  // e.g. ['hello@acme.com', 'news@acme.com']
})
</script>

<template>
  <EmailEditor v-model="design">
    <template #meta="{ meta, setMeta }">
      <div class="meta-card">
        <label class="meta-row">
          <span>From</span>
          <select :value="meta.from" @change="setMeta({ from: $event.target.value })">
            <option value="">Select a verified sender…</option>
            <option v-for="d in verifiedSenders" :key="d" :value="d" v-text="d" />
          </select>
        </label>
        <label class="meta-row">
          <span>Subject</span>
          <input :value="meta.subject" @input="setMeta({ subject: $event.target.value })" />
        </label>
        <label class="meta-row">
          <span>Preview</span>
          <input :value="meta.preview" @input="setMeta({ preview: $event.target.value })" />
        </label>
      </div>
    </template>
  </EmailEditor>
</template>

<style scoped>
.meta-card {
  border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; padding: 2px 16px;
}
.meta-row {
  display: flex; align-items: center; gap: 12px;
  min-height: 44px; border-bottom: 1px solid #f1f5f9;
}
.meta-row:last-child { border-bottom: 0; }
.meta-row span { width: 72px; font-size: 13px; font-weight: 500; color: #64748b; }
.meta-row input,
.meta-row select {
  flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; font-size: 14px;
}
</style>
```

**Slot props:**

- **`meta`** — read the current `subject`, `from`, `replyTo` and `preview`.
- **`setMeta(patch)`** — write any of them; a `preview` key routes to the
  preheader, and **any custom key** (e.g. `campaignId`) is stored on
  `design.meta` and round-trips with the design.

**`verifiedSenders` is your own data** — fetch it from your backend into a `ref`
and `v-for` the `<option>`s. The editor isn't involved; when the user picks one,
`setMeta({ from })` writes it to `design.meta.from`, which you read back on send.

> Alternatively, keep the built-in header and **validate `design.meta.from`
> server-side on save** — reject it if it isn't a verified domain.

## `actions` — show / hide built-ins

Every action defaults to `true` **except `saveTemplate`** (defaults `false`).
Set a flag to `false` to hide that control.

::: code-group

```ts [TS]
const config: EditorConfig = {
  actions: {
    undo: true, preview: true, theme: true, fullscreen: true,
    templates: false, new: false, import: false,
    save: true, saveTemplate: true, export: true,
  },
}
```

```js [JS]
const config = {
  actions: {
    undo: true, preview: true, theme: true, fullscreen: true,
    templates: false, new: false, import: false,
    save: true, saveTemplate: true, export: true,
  },
}
```

:::

The **fullscreen** action expands the editor to fill the whole window (a second
click or <kbd>Esc</kbd> exits).

## `labels` — rename built-ins

Relabel button text and tooltips without replacing the top bar. Every key is
optional; unset keys keep their defaults.

::: code-group

```ts [TS]
const config: EditorConfig = {
  labels: {
    brand: 'Acme Mailer',
    save: 'Publish',
    export: 'Get HTML',
    saveTemplate: 'Save template',
    undo: 'Undo', redo: 'Redo', preview: 'Preview', fullscreen: 'Fullscreen',
    templates: 'Templates', new: 'New design', import: 'Import JSON',
  },
}
```

```js [JS]
const config = {
  labels: {
    brand: 'Acme Mailer',
    save: 'Publish',
    export: 'Get HTML',
    saveTemplate: 'Save template',
    undo: 'Undo', redo: 'Redo', preview: 'Preview', fullscreen: 'Fullscreen',
    templates: 'Templates', new: 'New design', import: 'Import JSON',
  },
}
```

:::

`brand` only applies when you have **not** overridden the `#header-brand` slot.

## `labeledActions` — Save / Export button style

The primary **Save** and **Export** buttons render icon-only by default, with
their label shown as a tooltip. Set `labeledActions: true` to display the text
label next to the icon.

```ts
const config: EditorConfig = { labeledActions: true }
```

## `autosaveMs` — important caveat

`autosaveMs` **only** debounces the built-in `localStorage` autosave used when
`storage="local"` (the default). With `storage="none"` it does nothing — you own
the save cadence. See [Server-side autosave](/guide/server-side#server-side-autosave).
