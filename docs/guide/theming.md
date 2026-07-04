# Theming

Design tokens are scoped to each editor instance, so multiple themes can coexist
on one page. There are two ways to theme:

1. The **`theme` prop** — typed, convenient for a few overrides.
2. **`--cvee-*` CSS variables** — the full token set; best for a complete reskin
   and for theming from a host app's stylesheet (works great with WordPress etc.).

## The `theme` prop

::: code-group

```vue [TS]
<script setup lang="ts">
import { EmailEditor } from 'vue-mail-editor'
import type { ThemeTokens } from 'vue-mail-editor'

const theme: ThemeTokens = {
  colors: { accent: '#10b981', primary: '#064e3b' },
  dark: { accent: '#34d399' },
  font: { sans: 'Inter, sans-serif', baseSize: '15px' },
}
</script>

<template>
  <EmailEditor color-mode="auto" :theme="theme" />
</template>
```

```vue [JS]
<script setup>
import { EmailEditor } from 'vue-mail-editor'

const theme = {
  colors: { accent: '#10b981', primary: '#064e3b' },
  dark: { accent: '#34d399' },
  font: { sans: 'Inter, sans-serif', baseSize: '15px' },
}
</script>

<template>
  <EmailEditor color-mode="auto" :theme="theme" />
</template>
```

:::

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

### Two-way with `v-model:colorMode`

Color mode is **state**, so it's controlled — not driven by an imperative
method. Bind it two-way to both set it and read the user's toggle:

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from 'vue-mail-editor'

const mode = ref<'light' | 'dark' | 'auto'>('light')
</script>

<template>
  <EmailEditor v-model:colorMode="mode" />
  <p>Current mode: {{ mode }}</p>
  <button @click="mode = mode === 'dark' ? 'light' : 'dark'">Toggle</button>
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { EmailEditor } from 'vue-mail-editor'

const mode = ref('light')
</script>

<template>
  <EmailEditor v-model:colorMode="mode" />
  <p>Current mode: {{ mode }}</p>
  <button @click="mode = mode === 'dark' ? 'light' : 'dark'">Toggle</button>
</template>
```

:::

When the user clicks the built-in theme button, `mode` updates; when you set
`mode`, the editor follows. One source of truth. Preview mode works the same way
via **`v-model:preview`** (a boolean).

## CSS variables — `--cvee-*` (full reskin)

Every color, surface, and font in the editor is driven by a `--cvee-*` custom
property. Override them on a `.vue-email-editor` wrapper (or any ancestor) and
the whole UI re-themes — no rebuild, no props. Custom properties also flow to
portaled UI (bubble menu, tooltips), and they pierce a Shadow DOM boundary, so
this is the recommended way to theme from a host app.

::: tip How dark mode works
Light values live on the editor root; dark values are applied when the root has
the **`.dark`** class (the editor adds it automatically when dark mode is on).
So override **light** values on `.vue-email-editor` and **dark** values on
`.vue-email-editor.dark`.
:::

::: info Just an example
The editor ships a neutral **black/white** palette by default (see the
[reference table](#full-token-reference) below). The values in the next two
blocks are **one example reskin** (an emerald theme) to show how a host app can
recolor everything — drop in your own values.
:::

### Light mode

```css
.vue-email-editor {
  /* Surfaces */
  --cvee-bg: #f4f9f6;
  --cvee-bg-sidebar: #ffffff;
  --cvee-bg-surface: #ffffff;
  --cvee-bg-muted: #ecf7f2;
  --cvee-bg-hover: #e6f4ed;
  --cvee-bg-active: #d1fae5;
  --cvee-bg-input: #ffffff;

  /* Borders */
  --cvee-border: #cbd5e1;
  --cvee-border-subtle: #f1f5f9;

  /* Typography */
  --cvee-text: #0f172a;
  --cvee-text-secondary: #475569;
  --cvee-text-muted: #94a3b8;
  --cvee-text-strong: #064e3b;

  /* Buttons / primary actions */
  --cvee-btn-primary-bg: #10b981;
  --cvee-btn-primary-text: #ffffff;

  /* Links */
  --cvee-link: #059669;
  --cvee-link-hover: #047857;

  /* Accents (interactive highlights, focus) */
  --cvee-accent: #10b981;
  --cvee-accent-hover: #059669;
  --cvee-on-accent: #ffffff;

  /* Status */
  --cvee-status-success: #10b981;
  --cvee-status-info: #0ea5e9;
  --cvee-status-danger: #ef4444;
  --cvee-status-danger-soft: #fff5f5;

  /* App chrome */
  --cvee-header-bg: #ffffff;
  --cvee-header-fg: #064e3b;
  --cvee-canvas: #f0f7f4;
  --cvee-canvas-grid: #e2ece8;

  /* Fonts */
  --cvee-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  --cvee-font-mono: 'SF Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}
```

### Dark mode

Put the dark values under the **`.dark`** wrapper. (You only need to override the
tokens you want to change from the defaults.)

```css
.vue-email-editor.dark {
  --cvee-bg: #0b1411;
  --cvee-bg-sidebar: #0f1a16;
  --cvee-bg-surface: #0f1a16;
  --cvee-bg-muted: #15241e;
  --cvee-bg-hover: #15241e;
  --cvee-bg-active: #1f3a30;
  --cvee-bg-input: #15241e;

  --cvee-border: #1f3a30;
  --cvee-border-subtle: #14241d;

  --cvee-text: #ecfdf5;
  --cvee-text-secondary: #9ccdb9;
  --cvee-text-muted: #6b8a7d;
  --cvee-text-strong: #d1fae5;

  --cvee-btn-primary-bg: #34d399;
  --cvee-btn-primary-text: #052e1f;

  --cvee-link: #34d399;
  --cvee-link-hover: #6ee7b7;

  --cvee-accent: #34d399;
  --cvee-accent-hover: #6ee7b7;
  --cvee-on-accent: #052e1f;

  --cvee-status-danger-soft: #2a0f12;

  --cvee-header-bg: #0b1411;
  --cvee-header-fg: #ecfdf5;
  --cvee-canvas: #0b1411;
  --cvee-canvas-grid: #15241e;
}
```

### Recipe: override from your app

You don't edit the package's SCSS — you **re-declare the `--cvee-*` variables in
your own stylesheet**, scoped to `.vue-email-editor`, and import it after the
package CSS. The editor reads the variables at runtime, so your values win.

**1. Create a stylesheet in your app** (`email-editor-theme.css`):

```css
.vue-email-editor {
  --cvee-accent: #7c3aed;
  --cvee-btn-primary-bg: #7c3aed;
  --cvee-header-bg: #1e1b4b;
  --cvee-header-fg: #ffffff;
  /* …any other tokens… */
}
.vue-email-editor.dark {
  --cvee-accent: #a78bfa;
  /* …dark overrides… */
}
```

**2. Import it after the package CSS** so it loads later:

::: code-group

```ts [main.ts / main.js]
import 'vue-mail-editor/style.css'
import './email-editor-theme.css' // ← after the package CSS
```

```vue [In a component]
<style>
@import 'vue-mail-editor/style.css';
@import './email-editor-theme.css';
</style>
```

:::

That's it — no build step, no SCSS compilation. Because you're overriding
**variable values** (not utility rules), this always applies even though the
editor's utilities are `!important`.

::: tip Using SCSS?
The tokens are plain CSS custom properties, so they work in `.scss`/`.sass`
files unchanged. You can also drive them from SCSS variables:
`--cvee-accent: #{$brand};`.
:::

### Full token reference

| Token | Role | Light default | Dark default |
| ----- | ---- | ------------- | ------------ |
| `--cvee-bg` | App background | `#f8fafc` | `#0b0f1a` |
| `--cvee-bg-sidebar` | Left rail | `#ffffff` | `#111827` |
| `--cvee-bg-surface` | Panels / cards | `#ffffff` | `#111827` |
| `--cvee-bg-muted` | Muted surface | `#f1f5f9` | `#1e293b` |
| `--cvee-bg-hover` | Hover surface | `#f1f5f9` | `#1e293b` |
| `--cvee-bg-active` | Active / scrollbar | `#e2e8f0` | `#334155` |
| `--cvee-bg-input` | Input background | `#ffffff` | `#1e293b` |
| `--cvee-border` | Borders | `#e2e8f0` | `#1e293b` |
| `--cvee-border-subtle` | Subtle dividers | `#f1f5f9` | `#162032` |
| `--cvee-text` | Primary text | `#0f172a` | `#f8fafc` |
| `--cvee-text-secondary` | Secondary text | `#64748b` | `#94a3b8` |
| `--cvee-text-muted` | Muted text / placeholder | `#94a3b8` | `#64748b` |
| `--cvee-text-strong` | Headings | `#1e293b` | `#e2e8f0` |
| `--cvee-btn-primary-bg` | Primary button bg | `#0f172a` | `#f8fafc` |
| `--cvee-btn-primary-text` | Primary button text | `#f8fafc` | `#0f172a` |
| `--cvee-link` | Link color | `#2563eb` | `#60a5fa` |
| `--cvee-link-hover` | Link hover | `#1d4ed8` | `#93c5fd` |
| `--cvee-accent` | Accent / focus / selection | `#0f172a` | `#f8fafc` |
| `--cvee-accent-hover` | Accent hover | `#1e293b` | `#e2e8f0` |
| `--cvee-on-accent` | Foreground on accent | `#ffffff` | `#0f172a` |
| `--cvee-status-success` | Success | `#22c55e` | (inherits) |
| `--cvee-status-info` | Info | `#3b82f6` | (inherits) |
| `--cvee-status-danger` | Danger | `#ef4444` | (inherits) |
| `--cvee-status-danger-soft` | Danger soft bg | `#fef2f2` | `#2a0f12` |
| `--cvee-header-bg` | Top bar bg | `#ffffff` | `#0b0f1a` |
| `--cvee-header-fg` | Top bar text | `#0f172a` | `#f8fafc` |
| `--cvee-canvas` | Canvas backdrop | `#eef2f6` | `#0b0f1a` |
| `--cvee-canvas-grid` | Canvas grid | `#dbe2ea` | `#1b2536` |
| `--cvee-font-sans` | UI font | system sans stack | same |
| `--cvee-font-mono` | Code font | system mono stack | same |

## Overriding our styles from your app

The editor's utility styles are marked `!important` so a host page's CSS can't
accidentally break the layout (e.g. WordPress admin form styles). Because of
that, the intended way to customize is the **`--cvee-*` variables above** — they
set token *values*, which the styles read, so your theme always applies.

If you need to override a *specific* rule beyond the tokens, target it under the
`.vue-email-editor` root with `!important` so it wins over ours.
