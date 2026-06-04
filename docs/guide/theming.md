# Theming

Design tokens are scoped to each editor instance, so multiple themes can coexist
on one page. There are two ways to theme: the `theme` prop (typed) and
`--cvee-*` CSS variables (escape hatch).

## The `theme` prop

```vue
<EmailEditor
  color-mode="auto"
  :theme="{
    colors: { accent: '#7c3aed', primary: '#111827' },
    dark:   { accent: '#a78bfa' },
    font:   { sans: 'Inter, sans-serif', baseSize: '15px' },
  }"
/>
```

| Key | Description |
| --- | ----------- |
| `colors` | Light-mode color tokens. |
| `dark` | Dark-mode overrides (merged onto `colors`). |
| `font` | `sans`, `mono`, `baseSize`. |

## Color mode

```vue
<EmailEditor color-mode="auto" />  <!-- 'light' | 'dark' | 'auto' -->
```

`auto` follows the user's OS preference. The mode is per-instance, and the
built-in theme toggle (when enabled) switches it at runtime.

## CSS variables — `--cvee-*`

For full control, override the `--cvee-*` custom properties on a
`.vue-email-editor` wrapper (or any ancestor). These also flow to portaled UI
like the inline-text bubble menu and tooltips.

```css
.vue-email-editor {
  --cvee-accent: #7c3aed;
  --cvee-accent-hover: #6d28d9;
  --cvee-on-accent: #ffffff;
  --cvee-header-bg: #0b0f1a;
  --cvee-header-fg: #f8fafc;
}

/* dark mode overrides */
.vue-email-editor.dark {
  --cvee-accent: #a78bfa;
}
```

### Common tokens

| Token | Role |
| ----- | ---- |
| `--cvee-bg` / `--cvee-bg-surface` | App & panel backgrounds |
| `--cvee-text` / `--cvee-text-secondary` | Primary / secondary text |
| `--cvee-border` | Borders |
| `--cvee-accent` / `--cvee-on-accent` | Interactive highlight + its foreground |
| `--cvee-btn-primary-bg` / `--cvee-btn-primary-text` | Primary buttons |
| `--cvee-header-bg` / `--cvee-header-fg` | Top bar |
| `--cvee-canvas` / `--cvee-canvas-grid` | Canvas backdrop |
| `--cvee-font-sans` / `--cvee-font-mono` | Typography |

## Overriding our styles from your app

The package CSS lives in a low-priority layer, so your own **unlayered** styles
naturally win. If a host framework (e.g. WordPress global SCSS) bleeds into the
editor, scope your overrides to the `.vue-email-editor` root and prefer the
`--cvee-*` variables above so theming survives.
