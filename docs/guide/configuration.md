# Configuration

Pass an `EditorConfig` object to the `config` prop to toggle features, rename
actions, set the default content width, and provide starter templates.

```ts
import type { EditorConfig } from '@csesumonpro/vue-email-editor'

const config: EditorConfig = {
  contentWidth: 640,
  devices: ['desktop', 'mobile'],
  actions: { import: false, saveTemplate: true },
  labels: { save: 'Publish', export: 'Get HTML' },
  templates: [ /* your starter templates */ ],
  autosaveMs: 1000, // localStorage debounce only; ignored when storage="none"
}
```

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
| `templates` | `TemplateDef[]` | built-ins | Replace the starter-template gallery. |
| `autosaveMs` | `number` | `800` | localStorage autosave debounce (ms). |

## `actions` — show / hide built-ins

Every action defaults to `true` **except `saveTemplate`** (defaults `false`).
Set a flag to `false` to hide that control.

```ts
const config: EditorConfig = {
  actions: {
    undo: true, preview: true, theme: true,
    templates: false, new: false, import: false,
    save: true, saveTemplate: true, export: true,
  },
}
```

## `labels` — rename built-ins

Relabel button text and tooltips without replacing the top bar. Every key is
optional; unset keys keep their defaults.

```ts
const config: EditorConfig = {
  labels: {
    brand: 'Acme Mailer',
    save: 'Publish',
    export: 'Get HTML',
    saveTemplate: 'Save template',
    undo: 'Undo', redo: 'Redo', preview: 'Preview',
    templates: 'Templates', new: 'New design', import: 'Import JSON',
  },
}
```

`brand` only applies when you have **not** overridden the `#header-brand` slot.

## `autosaveMs` — important caveat

`autosaveMs` **only** debounces the built-in `localStorage` autosave used when
`storage="local"` (the default). With `storage="none"` it does nothing — you own
the save cadence. See [Server-side autosave](/guide/server-side#server-side-autosave).
