# Imperative API

The editor exposes an imperative API for driving it from your own buttons or
logic. Get it from the `ready` event or a template ref.

```ts
interface EditorApi {
  getDesign(): Design            // deep-cloned snapshot of the current design
  loadDesign(design: Design): void
  newDesign(): void              // clear to a fresh, empty design (no prompt)
  exportHtml(): string           // email-safe HTML for the current design
  save(): void | Promise<void>   // fire the Save flow (emit `save` + onSave prop)
  export(): void | Promise<void> // fire the Export flow (emit `export` + onExport)
  undo(): void
  redo(): void
  registerBlock(def: BlockDefinition): void
  selectBody(): void             // select the email body (opens its inspector)
}
```

::: tip Commands vs. state
The imperative API holds **commands** (do-a-thing-once). UI **state** —
dark/light mode and preview — is controlled with **`v-model:colorMode`** and
**`v-model:preview`** instead, so there is a single source of truth you can both
set and read. See [Theming](/guide/theming#color-mode) and
[Props & events](/guide/props).
:::

## Getting the API

### Via the `ready` event

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import type { EditorApi } from '@csesumonpro/vue-email-editor'

const api = ref<EditorApi>()
</script>

<template>
  <EmailEditor @ready="api = $event" />
  <button @click="api?.undo()">Undo</button>
  <button @click="downloadHtml(api!.exportHtml())">Export</button>
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'

const api = ref()
</script>

<template>
  <EmailEditor @ready="api = $event" />
  <button @click="api?.undo()">Undo</button>
  <button @click="downloadHtml(api.exportHtml())">Export</button>
</template>
```

:::

### Via a template ref

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'

const editor = ref<InstanceType<typeof EmailEditor>>()
function save() {
  myBackend.save(editor.value!.getDesign())
}
</script>

<template>
  <EmailEditor ref="editor" />
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'

const editor = ref()
function save() {
  myBackend.save(editor.value.getDesign())
}
</script>

<template>
  <EmailEditor ref="editor" />
</template>
```

:::

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `getDesign()` | `Design` | A deep-cloned snapshot — safe to mutate/store. |
| `loadDesign(design)` | `void` | Replace the current design. |
| `newDesign()` | `void` | Clear to a fresh, empty design. No confirm prompt — show your own first if you want one. |
| `exportHtml()` | `string` | Render the design to email-safe HTML (returns it). |
| `save()` | `void \| Promise` | Fire the Save flow — emits `save` and runs the `onSave` prop. |
| `export()` | `void \| Promise` | Fire the Export flow — emits `export` and runs the `onExport` prop. |
| `undo()` | `void` | Undo the last change. |
| `redo()` | `void` | Redo the last undone change. |
| `registerBlock(def)` | `void` | Register a custom block at runtime. |
| `selectBody()` | `void` | Select the body and open its inspector. |

::: warning `exportHtml()` vs `export()`
`exportHtml()` **returns** the HTML string and does nothing else — use it when
you want the markup. `export()` **triggers** the full export flow (opens the
preview modal, emits `export`, runs `onExport`) just like the toolbar button.
:::

::: tip
For most apps the events (`change`, `save`, `export`) are enough. Reach for the
imperative API when you build a fully custom toolbar with the `#header` slot.
:::
