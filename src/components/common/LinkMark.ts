import { Mark, mergeAttributes } from '@tiptap/core'

/**
 * Minimal link mark — a drop-in replacement for `@tiptap/extension-link` that
 * does NOT pull in `linkifyjs` (~20 KB gzip). We never used autolinking or
 * paste-detection (the editor sets links explicitly via the bubble menu), so
 * all of linkify's URL-detection machinery was dead weight.
 *
 * Supports exactly what the editor uses: `setLink`, `unsetLink`, and parsing /
 * rendering `<a href>` with safe defaults.
 */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      setLink: (attributes: { href: string; target?: string | null }) => ReturnType
      unsetLink: () => ReturnType
    }
  }
}

export const LinkMark = Mark.create({
  name: 'link',
  priority: 1000,
  keepOnSplit: false,
  inclusive: false,

  addOptions() {
    return {
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      },
    }
  },

  addAttributes() {
    return {
      href: { default: null },
      target: { default: this.options.HTMLAttributes.target },
      rel: { default: this.options.HTMLAttributes.rel },
    }
  },

  parseHTML() {
    return [{ tag: 'a[href]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setLink:
        (attributes) =>
        ({ chain }) =>
          chain().setMark(this.name, attributes).run(),
      unsetLink:
        () =>
        ({ chain }) =>
          chain().unsetMark(this.name, { extendEmptyMarkRange: true }).run(),
    }
  },
})
