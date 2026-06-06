import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './custom.css'

// Extend the default theme with a custom Layout that renders bespoke marketing
// pages (landing / features / showcase) while keeping the default docs theme.
// NOTE: the editor's own CSS is imported only inside the live-demo component,
// never here, to avoid its Tailwind preflight clobbering VitePress styles.
export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme
