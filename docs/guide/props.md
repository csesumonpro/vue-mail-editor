# Props & events

## Props

| Prop             | Type                                            | Default   | Description |
| ---------------- | ----------------------------------------------- | --------- | ----------- |
| `v-model`        | `Design`                                        | —         | Two-way design JSON (controlled mode). |
| `blocks`         | `BlockDefinition[]`                             | `[]`      | Custom blocks (merged with built-ins). |
| `disabledBlocks` | `string[]`                                       | `[]`      | Hide built-in block types. |
| `theme`          | `ThemeTokens`                                    | —         | Color/typography overrides (light + dark). |
| `colorMode`      | `'light' \| 'dark' \| 'auto'`                    | `'light'` | Theme mode — two-way via `v-model:colorMode`. |
| `preview`        | `boolean`                                        | —         | Preview mode — two-way via `v-model:preview`. |
| `config`         | `EditorConfig`                                   | —         | Feature flags (devices, actions, labels, templates…). |
| `storage`        | `'local' \| 'none'`                              | `'local'` | `local` = localStorage autosave; `none` = host owns persistence. |
| `onImageUpload`  | `(file: File) => Promise<string>`               | base64    | Upload an image, return its URL. |
| `onSave`         | `(design) => void \| Promise`                   | download  | Handle **Save Design**. |
| `onSaveTemplate` | `(payload) => void \| Promise`                  | —         | Handle **Save as template**. |
| `onExport`       | `(html, design) => void \| Promise`             | —         | Receive exported HTML. |
| `onLoad`         | `() => Design \| Promise<Design>`               | —         | Initial design (e.g. server fetch). |

## Events

| Event | Payload | Fires when |
| ----- | ------- | ---------- |
| `update:modelValue` | `design` | The design changes (for `v-model`). |
| `update:colorMode` | `'light' \| 'dark'` | The user toggles the theme (for `v-model:colorMode`). |
| `update:preview` | `boolean` | Preview mode toggles (for `v-model:preview`). |
| `change` | `design` | The design changes — **debounced (~300ms)**. |
| `save` | `design` | The user clicks Save. |
| `save-template` | `payload` | The user saves a template. |
| `export` | `(html, design)` | The user exports HTML. |
| `select` | `selection` | The current selection changes. |
| `ready` | `api` | The editor is mounted; gives you the [imperative API](/reference/api). |

```vue
<EmailEditor
  v-model="design"
  @change="onChange"
  @export="(html) => send(html)"
  @ready="(api) => (editor = api)"
/>
```

::: info `change` vs `update:modelValue`
`update:modelValue` fires on every edit (to keep `v-model` in sync).
`change` is debounced — prefer it for expensive work like writing to a database.
:::

## Slots

| Slot | Purpose |
| ---- | ------- |
| `#header` | Replace the entire top bar. |
| `#header-brand` | Replace just the logo / brand area. |
| `#header-actions` | Inject your own buttons next to the built-in actions. |
| `#empty` | Custom empty-canvas state. |

See [Customizing the top bar](/guide/top-bar) for slot examples.
