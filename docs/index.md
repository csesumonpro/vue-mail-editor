---
layout: home

hero:
  name: Vue Email Editor
  text: Drag-and-drop email builder for Vue 3
  tagline: Theme it, register your own blocks and inspector panels, and delegate every save/upload to your backend.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: View on npm
      link: https://www.npmjs.com/package/@csesumonpro/vue-email-editor

features:
  - title: Fully self-contained
    details: No Pinia, no global setup, no directive registration. Mount several independent instances on one page.
  - title: Extensible blocks
    details: Register your own blocks with a render component, inspector schema, and email-safe HTML exporter.
  - title: Themeable
    details: Per-instance light/dark tokens via props or --cvee-* CSS variables. Multiple themes coexist.
  - title: Bring your own backend
    details: storage="none" hands persistence to you — onLoad / onSave / onImageUpload + change/export events.
  - title: Email-safe export
    details: Table-based HTML with inlined styles, Outlook (MSO) conditionals, and mobile media queries.
  - title: Customizable top bar
    details: Show/hide actions, rename labels, swap the logo, push your own buttons, or replace the bar entirely.
---
