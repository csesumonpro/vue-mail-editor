# Standalone text editor

The package also exports `TextEditor` — the same rich-text engine the email
editor uses, usable on its own. If you already depend on
`@csesumonpro/vue-email-editor`, you get a lightweight editor with **no extra
package** to install.

## Basic usage

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { TextEditor } from '@csesumonpro/vue-email-editor'
import '@csesumonpro/vue-email-editor/style.css'

const html = ref('<p>Hello <strong>world</strong></p>')
</script>

<template>
  <TextEditor v-model="html" />
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { TextEditor } from '@csesumonpro/vue-email-editor'
import '@csesumonpro/vue-email-editor/style.css'

const html = ref('<p>Hello <strong>world</strong></p>')
</script>

<template>
  <TextEditor v-model="html" />
</template>
```

:::

`v-model` is an **HTML string** (bold, italic, underline, strike, link, color,
and lists).

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `v-model` | `string` | `''` | The editor HTML. |
| `toolbar` | `'fixed' \| 'bubble' \| false` | `'fixed'` | Persistent top bar, selection bubble, or no toolbar. |
| `lists` | `boolean` | `true` | Show bullet / numbered list buttons. |
| `placeholder` | `string` | `'Type here…'` | Empty-state placeholder. |
| `editable` | `boolean` | `true` | Set `false` for a read-only render. |
| `variables` | `DesignVariable[]` | — | Opt-in template variables (see below). |

### Toolbar styles

```vue
<TextEditor v-model="html" toolbar="fixed" />   <!-- persistent bar (default) -->
<TextEditor v-model="html" toolbar="bubble" />  <!-- appears over a selection -->
<TextEditor v-model="html" :toolbar="false" />  <!-- no toolbar -->
```

## Template variables (opt-in)

Provide the `variables` prop to enable the same `{{` autocomplete + chips as the
email editor. Use `v-model:variables` to keep the registry in sync.

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { TextEditor } from '@csesumonpro/vue-email-editor'
import type { DesignVariable } from '@csesumonpro/vue-email-editor'

const html = ref('')
const vars = ref<DesignVariable[]>([
  { name: 'first_name', type: 'string', fallback: 'there' },
])
</script>

<template>
  <TextEditor v-model="html" v-model:variables="vars" />
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { TextEditor } from '@csesumonpro/vue-email-editor'

const html = ref('')
const vars = ref([{ name: 'first_name', type: 'string', fallback: 'there' }])
</script>

<template>
  <TextEditor v-model="html" v-model:variables="vars" />
</template>
```

:::

When variables are enabled, you can insert one **two ways**: type `{{` for the
autocomplete, or click the **`{}` button** in the toolbar — both open the same
list-with-Create popover and drop the chip at the cursor.

Without the `variables` prop, the editor is a plain rich-text field (no `{{`,
no `{}` button). See [Template variables](/guide/variables) for how chips and
fallbacks work.

> The HTML keeps variable chips as `<span data-variable="name">{{{name}}}</span>`.
> To turn them into `{{{name}}}` tokens (or fallback values) for sending, run it
> through your own merge step, or compose the design with the email editor's
> export.

## Theming

`TextEditor` uses the same `--cvee-*` design tokens as the email editor and is
scoped under `.vue-email-editor`, so [Theming](/guide/theming) overrides apply.
Add a `dark` class on an ancestor for dark mode.
