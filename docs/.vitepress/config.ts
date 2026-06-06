import { defineConfig } from 'vitepress'

// Served under siteurl/docs — change `base` if you mount it elsewhere.
export default defineConfig({
  base: '/docs/',
  lang: 'en-US',
  title: 'Vue Email Editor',
  description:
    'A customizable, extensible drag-and-drop email template editor for Vue 3.',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/reference/api' },
      {
        text: 'npm',
        link: 'https://www.npmjs.com/package/@csesumonpro/vue-email-editor',
      },
    ],
    sidebar: {
      '/': [
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
      ],
    },
    search: { provider: 'local' },
    socialLinks: [
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/@csesumonpro/vue-email-editor',
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026',
    },
  },
})
