# Inspector controls

The inspector (right panel) is built from a schema of accordion groups, each
containing controls. Use these in a [custom block](/guide/custom-blocks)'s
`inspector` array.

## Control catalog

| `type` | Edits | Notes |
| ------ | ----- | ----- |
| `text` | a string | single-line input |
| `textarea` | a string | multi-line input |
| `number` | a number | `min`, `max`, `step`, `unit` (clamps to `min` on blur) |
| `slider` | a number | `min`, `max`, `step` |
| `color` | a color string | swatch + hex; supports transparent |
| `select` | a value | requires `options` |
| `align` | `'left' \| 'center' \| 'right'` | alignment toggle |
| `toggle` | a boolean | switch |
| `spacing` | padding object | top/right/bottom/left with link |
| `border` | border object | width / style / color |
| `font` | a font object | font-family picker |
| `link` | href object | URL + (optional) target |
| `image` | image object | URL + upload via `onImageUpload` |
| `background` | background object | color / image |
| `list` | array of items | `itemKind: 'social' \| 'menu'` |

## `ControlDef`

```ts
interface ControlDef {
  type: ControlType
  key: string          // value key within the node's `values` (dotted keys ok)
  label?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: SelectOption[]   // for `select`
  placeholder?: string
  itemKind?: 'social' | 'menu'  // for `list`
}

interface SelectOption {
  label: string
  value: string | number
}
```

## Example group

```ts
inspector: [
  {
    title: 'Style',
    controls: [
      { type: 'font',   key: 'fontFamily', label: 'Font' },
      { type: 'number', key: 'fontSize',   label: 'Size', unit: 'px', min: 8, max: 80 },
      { type: 'select', key: 'fontWeight', label: 'Weight', options: [
        { label: 'Regular', value: '400' },
        { label: 'Bold',    value: '700' },
      ] },
      { type: 'color',  key: 'color',      label: 'Color' },
      { type: 'align',  key: 'align',      label: 'Align' },
      { type: 'spacing', key: 'padding',   label: 'Padding' },
    ],
  },
]
```

## Dotted keys

A control's `key` can address a nested value — e.g. `padding.top` edits just the
top of a padding object while leaving the rest intact.
