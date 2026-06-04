# Imperative API

The editor exposes an imperative API for driving it from your own buttons or
logic. Get it from the `ready` event or a template ref.

```ts
interface EditorApi {
  getDesign(): Design            // deep-cloned snapshot of the current design
  loadDesign(design: Design): void
  exportHtml(): string           // email-safe HTML for the current design
  undo(): void
  redo(): void
  registerBlock(def: BlockDefinition): void
  selectBody(): void             // select the email body (opens its inspector)
}
```

## Getting the API

### Via the `ready` event

```vue
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

### Via a template ref

```vue
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

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `getDesign()` | `Design` | A deep-cloned snapshot — safe to mutate/store. |
| `loadDesign(design)` | `void` | Replace the current design. |
| `exportHtml()` | `string` | Render the design to email-safe HTML. |
| `undo()` | `void` | Undo the last change. |
| `redo()` | `void` | Redo the last undone change. |
| `registerBlock(def)` | `void` | Register a custom block at runtime. |
| `selectBody()` | `void` | Select the body and open its inspector. |

::: tip
For most apps the events (`change`, `save`, `export`) are enough. Reach for the
imperative API when you build a fully custom toolbar with the `#header` slot.
:::
