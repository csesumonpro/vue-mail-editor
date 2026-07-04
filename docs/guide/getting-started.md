# Getting started

## Install

```bash
npm install vue-mail-editor
```

Vue 3 is a peer dependency:

```bash
npm install vue
```

## Basic usage

Import the component **and its stylesheet**, then give it a sized container —
the editor fills 100% of its parent's height.

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from 'vue-mail-editor'
import 'vue-mail-editor/style.css'
import type { Design } from 'vue-mail-editor'

const design = ref<Design>()
</script>

<template>
  <div style="height: 100vh">
    <EmailEditor v-model="design" />
  </div>
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { EmailEditor } from 'vue-mail-editor'
import 'vue-mail-editor/style.css'

const design = ref()
</script>

<template>
  <div style="height: 100vh">
    <EmailEditor v-model="design" />
  </div>
</template>
```

:::

That's it. With no extra props the editor autosaves to `localStorage` and lets
the user export HTML and download the design.

::: tip Multiple instances
The editor is fully self-contained — no global setup. You can render several
independent `<EmailEditor>` instances on the same page, each with its own theme,
blocks, and state.
:::

## Controlled vs. uncontrolled

| Mode | How | When |
| ---- | --- | ---- |
| **Uncontrolled** | `storage="local"` (default) | Quick start; persists to `localStorage`. |
| **Controlled** | `v-model="design"` | You hold the design in your own state. |
| **Server-owned** | `storage="none"` + `onLoad`/`onSave` | Your database is the source of truth. |

See [Server-side & database](/guide/server-side) for the backend pattern.

## TypeScript

TypeScript is **optional** — the package is plain compiled JS and works in JS
projects as-is (use the **JS** tab on any example). If you do use TS, all public
types are exported from the package root:

```ts
import type {
  Design,
  BlockDefinition,
  EditorApi,
  EditorConfig,
  EditorLabels,
  ThemeTokens,
} from 'vue-mail-editor'
```

## Next steps

- [Props & events](/guide/props)
- [Configuration](/guide/configuration)
- [Theming](/guide/theming)
- [Custom blocks](/guide/custom-blocks)
