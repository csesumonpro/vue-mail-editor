import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { REPO, NPM } from './theme/links'

// GitHub Pages base path.
//  - Project page (default here): '/vue-mail-editor/'
//  - User/org page OR a custom domain (add docs/public/CNAME): '/'
const BASE = '/vue-mail-editor/'

// Absolute origin + base of the deployed site. Used for the sitemap and the
// per-page <link rel="canonical"> tags. Update the origin if you move to a
// custom domain (and set BASE to '/').
const ORIGIN = 'https://csesumonpro.github.io'
const SITE_URL = `${ORIGIN}${BASE}` // https://csesumonpro.github.io/vue-mail-editor/

export default defineConfig({
  base: BASE,
  lang: 'en-US',
  title: 'Vue Email Editor',
  description:
    'A customizable, extensible drag-and-drop email template editor for Vue 3.',
  cleanUrls: true,
  lastUpdated: true,

  // Emits dist/sitemap.xml so search engines can discover every page.
  sitemap: {
    hostname: SITE_URL,
  },

  // Add a canonical URL to every page — tells search engines the one true URL
  // for each doc and avoids duplicate-content penalties.
  transformPageData(pageData) {
    const path = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1') // index.md -> directory URL (cleanUrls)
      .replace(/\.md$/, '')
    const canonical = `${SITE_URL}${path}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonical }])
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue Email Editor' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'A customizable, extensible drag-and-drop email template editor for Vue 3.',
      },
    ],
    ['meta', { property: 'og:image', content: `${BASE}og.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Vue Email Editor' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'A customizable, extensible drag-and-drop email template editor for Vue 3.',
      },
    ],
    ['meta', { name: 'twitter:image', content: `${BASE}og.png` }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Vue Email Editor',
    nav: [
      { text: 'Features', link: '/features' },
      { text: 'Showcase', link: '/showcase' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/reference/api' },
      { text: 'Changelog', link: '/changelog' },
    ],
    sidebar: {
      // Scope the sidebar to docs only — marketing pages get no sidebar.
      '/guide/': sidebarDocs(),
      '/reference/': sidebarDocs(),
    },
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: REPO },
      { icon: 'npm', link: NPM },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026',
    },
  },

  vite: {
    resolve: {
      // The live demo imports the BUILT library (dist) — its CSS already has
      // Tailwind compiled, which the docs Vite build can't do from src.
      // Run `npm run build` before `npm run docs:dev` / `docs:build`.
      // (More specific /style.css alias must come first.)
      alias: [
        {
          find: 'vue-mail-editor/style.css',
          replacement: fileURLToPath(new URL('../../dist/style.css', import.meta.url)),
        },
        {
          find: 'vue-mail-editor',
          replacement: fileURLToPath(new URL('../../dist/vue-mail-editor.js', import.meta.url)),
        },
      ],
    },
  },
})

function sidebarDocs() {
  return [
    {
      text: 'Introduction',
      items: [
        { text: 'What is it?', link: '/guide/introduction' },
        { text: 'Getting started', link: '/guide/getting-started' },
      ],
    },
    {
      text: 'Usage',
      items: [
        { text: 'Props & events', link: '/guide/props' },
        { text: 'Configuration', link: '/guide/configuration' },
        { text: 'Template variables', link: '/guide/variables' },
        { text: 'Standalone text editor', link: '/guide/text-editor' },
        { text: 'Customizing the top bar', link: '/guide/top-bar' },
        { text: 'Theming', link: '/guide/theming' },
        { text: 'Custom blocks', link: '/guide/custom-blocks' },
        { text: 'Server-side & database', link: '/guide/server-side' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Built-in blocks', link: '/reference/blocks' },
        { text: 'Imperative API', link: '/reference/api' },
        { text: 'Inspector controls', link: '/reference/controls' },
      ],
    },
  ]
}
