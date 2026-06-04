# Custom blocks

A block is defined with `defineBlock()`. It bundles four things:

1. **metadata** (`type`, `label`, `icon`),
2. **default values** for a new instance,
3. a **render component** (how it looks on the canvas),
4. an **inspector schema** (the controls in the right panel), and
5. a **`toHtml`** exporter (email-safe HTML).

## 1. The render component

The component receives `values`, `selected`, and `editing` props and emits
`update` with a partial patch.

```vue
<!-- RatingBlock.vue -->
<script setup lang="ts">
defineProps<{ values: { stars: number; color: string }; editing?: boolean }>()
defineEmits<{ update: [patch: Partial<{ stars: number; color: string }>] }>()
</script>

<template>
  <div :style="{ textAlign: 'center', fontSize: '26px', color: values.color }">
    <span v-for="n in values.stars" :key="n">★</span>
  </div>
</template>
```

## 2. The block definition

```ts
import { defineBlock } from '@csesumonpro/vue-email-editor'
import { Star } from 'lucide-vue-next'
import RatingBlock from './RatingBlock.vue'

export const rating = defineBlock<{ stars: number; color: string }>({
  type: 'rating',
  label: 'Rating',
  icon: Star,
  defaultValues: () => ({ stars: 5, color: '#f59e0b' }),
  render: RatingBlock,
  inspector: [
    {
      title: 'Rating',
      controls: [
        { type: 'number', key: 'stars', label: 'Stars', min: 1, max: 5 },
        { type: 'color', key: 'color', label: 'Color' },
      ],
    },
  ],
  toHtml: (v) =>
    `<div style="text-align:center;color:${v.color}">${'★'.repeat(v.stars)}</div>`,
})
```

## 3. Register it

```vue
<EmailEditor :blocks="[rating]" />
```

Custom blocks are **merged with the built-ins**. To hide a built-in, list its
type in `disabledBlocks`:

```vue
<EmailEditor :blocks="[rating]" :disabled-blocks="['divider', 'spacer']" />
```

## Inspector schema

Each inspector group has a `title`, optional `icon`, and a list of `controls`.
Every control has a `type`, a `key` (the value it edits — dotted keys like
`padding.top` are supported), and a `label`. See the full catalog in
[Inspector controls](/reference/controls).

```ts
inspector: [
  {
    title: 'Style',
    controls: [
      { type: 'font',   key: 'fontFamily', label: 'Font' },
      { type: 'number', key: 'fontSize',   label: 'Size', unit: 'px', min: 8, max: 80 },
      { type: 'color',  key: 'color',      label: 'Color' },
      { type: 'align',  key: 'align',      label: 'Align' },
    ],
  },
]
```

## Writing email-safe `toHtml`

Email clients (especially Outlook) are unforgiving. Keep `toHtml` to:

- **tables** for layout, not flexbox/grid,
- **inline styles** only,
- **px** units and web-safe fonts (or your own `@font-face` with fallbacks),
- absolute image URLs.

`toHtml(values, ctx)` receives an `ExportContext` as its second argument for
shared concerns (e.g. content width).
