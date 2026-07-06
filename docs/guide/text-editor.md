# Standalone text editor

The package also exports `TextEditor` — the same rich-text engine the email
editor uses, usable on its own. If you already depend on
`vue-mail-editor`, you get a lightweight editor with **no extra
package** to install.

## Basic usage

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { TextEditor } from 'vue-mail-editor'
import 'vue-mail-editor/style.css'

const html = ref('<p>Hello <strong>world</strong></p>')
</script>

<template>
  <TextEditor v-model="html" />
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { TextEditor } from 'vue-mail-editor'
import 'vue-mail-editor/style.css'

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
| `toolbarItems` | `RteToolbarItem[]` | — | Allowlist of toolbar buttons to show. Overrides `lists`. |
| `placeholder` | `string` | `'Type here…'` | Empty-state placeholder. |
| `editable` | `boolean` | `true` | Set `false` for a read-only render. |
| `variables` | `DesignVariable[]` | — | Opt-in template variables (see below). |

### Toolbar styles

```vue
<TextEditor v-model="html" toolbar="fixed" />   <!-- persistent bar (default) -->
<TextEditor v-model="html" toolbar="bubble" />  <!-- appears over a selection -->
<TextEditor v-model="html" :toolbar="false" />  <!-- no toolbar -->
```

### Choosing which buttons show — `toolbarItems`

By default the toolbar shows every button. Pass `toolbarItems` — an allowlist of
`RteToolbarItem` values — to show only a subset:

```vue
<TextEditor v-model="html" :toolbar-items="['bold', 'italic', 'link']" />
```

The available items are:

`'bold'` · `'italic'` · `'underline'` · `'strike'` · `'link'` · `'color'` ·
`'bulletList'` · `'orderedList'` · `'variable'`

**Variable-only editor** — combine with the `variables` prop for just the `{}`
button (nothing else):

```vue
<script setup lang="ts">
import type { RteToolbarItem } from 'vue-mail-editor'
</script>

<template>
  <TextEditor v-model="html" v-model:variables="vars" :toolbar-items="['variable']" />
</template>
```

- **Allowlist, fixed order** — the array picks *which* buttons appear; their order
  follows the toolbar layout, not the array.
- **Dividers are automatic** — separators show only between visible groups, so a
  single-button toolbar has none.
- **The variable button needs variables enabled** — it only renders when you also
  pass `variables`.
- **No effect with `:toolbar="false"`** — there's no toolbar to render into
  (variables still work by typing <code v-pre>{{</code>).

## Template variables (opt-in)

Provide the `variables` prop to enable the same <code v-pre>{{</code> autocomplete + chips as the
email editor. Use `v-model:variables` to keep the registry in sync.

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { TextEditor } from 'vue-mail-editor'
import type { DesignVariable } from 'vue-mail-editor'

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
import { TextEditor } from 'vue-mail-editor'

const html = ref('')
const vars = ref([{ name: 'first_name', type: 'string', fallback: 'there' }])
</script>

<template>
  <TextEditor v-model="html" v-model:variables="vars" />
</template>
```

:::

When variables are enabled, you can insert one **two ways**: type <code v-pre>{{</code> for the
autocomplete, or click the **`{}` button** in the toolbar — both open the same
list-with-Create popover and drop the chip at the cursor.

Without the `variables` prop, the editor is a plain rich-text field (no <code v-pre>{{</code>,
no `{}` button). See [Template variables](/guide/variables) for how chips and
fallbacks work.

> The HTML keeps variable chips as <code v-pre><span data-variable="name">{{{name}}}</span></code>.
> To turn them into <code v-pre>{{{name}}}</code> tokens (or fallback values) for sending, run it
> through your own merge step, or compose the design with the email editor's
> export.

## Theming

`TextEditor` uses the same `--cvee-*` design tokens as the email editor and is
scoped under `.vue-email-editor`, so [Theming](/guide/theming) overrides apply.
Add a `dark` class on an ancestor for dark mode.
