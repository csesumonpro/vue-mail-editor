# Customizing the top bar

Everything in the top bar is configurable from the host app — swap the logo,
show/hide built-in actions, rename them, add your own buttons, or replace the bar
entirely.

| Goal | How |
| ---- | --- |
| Show/hide a built-in action | `config.actions.<name>` (boolean) |
| Rename a built-in label/tooltip | `config.labels.<name>` (string) |
| Replace the logo / brand | `#header-brand` slot |
| Add custom buttons (keep built-ins) | `#header-actions` slot |
| Fully custom toolbar (own labels/layout) | `#header` slot |
| Trigger the editor from your buttons | `@ready="api = $event"` (or events) |

## Show / hide built-in actions

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

## Rename built-in labels — `config.labels`

```vue
<EmailEditor
  :config="{
    labels: { brand: 'Acme Mailer', save: 'Publish', export: 'Get HTML' },
  }"
/>
```

Every label is optional. `brand` only applies when you haven't overridden the
`#header-brand` slot.

## Replace the logo — `#header-brand`

```vue
<EmailEditor>
  <template #header-brand>
    <img src="/logo.svg" alt="Acme" style="height: 24px" />
  </template>
</EmailEditor>
```

## Add custom actions — `#header-actions`

Your buttons render next to the built-ins; wire them via the imperative API:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import type { EditorApi } from '@csesumonpro/vue-email-editor'

const api = ref<EditorApi>()
function publish() {
  myBackend.publish(api.value!.exportHtml())
}
</script>

<template>
  <EmailEditor @ready="api = $event">
    <template #header-actions>
      <button @click="publish">Publish</button>
    </template>
  </EmailEditor>
</template>
```

## Fully custom toolbar — `#header`

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
[`EditorApi`](/reference/api) (`@ready`) and/or the events.
