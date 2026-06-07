import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { DesignVariable } from '@/types/schema'
import { formatToken } from '@/utils/variableToken'
import VariableChip from './VariableChip.vue'

/**
 * Inline atom node for a template merge variable. Stores ONLY the variable
 * `name`; its type/fallback live in the design's variable registry, so editing
 * one variable updates every instance with no document migration.
 *
 * Serializes (getHTML) as `<span data-variable="name">{{{name}}}</span>` so it
 * round-trips through setContent and the export pipeline rewrites it to a token
 * or fallback. Modelled on the project's hand-rolled `LinkMark`.
 */
export interface VariableEditRequest {
  name: string
  /** Document position of the clicked chip (for deletion). */
  pos: number
  /** The chip's on-screen rect (to anchor the edit popover). */
  rect: DOMRect
}

export interface VariableOptions {
  /** Look up a variable's definition (type/fallback) by name. */
  getVariable: (name: string) => DesignVariable | undefined
  /** Whether the editor is in preview mode (render fallback instead of chip). */
  isPreview: () => boolean
  /** Request the host (RichTextEditor) to open the edit popover for a chip. */
  onEdit: (request: VariableEditRequest) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (name: string) => ReturnType
    }
  }
}

export const VariableNode = Node.create<VariableOptions>({
  name: 'variable',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addOptions() {
    return {
      getVariable: () => undefined,
      isPreview: () => false,
      onEdit: () => {},
    }
  },

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-variable'),
        renderHTML: (attrs) =>
          attrs.name ? { 'data-variable': attrs.name } : {},
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-variable]' }]
  },

  // Keep this byte-stable: the RTE's modelValue watcher compares against
  // getHTML(), so unstable attribute order would loop setContent ↔ onUpdate.
  renderHTML({ node, HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), formatToken(node.attrs.name)]
  },

  addNodeView() {
    return VueNodeViewRenderer(VariableChip)
  },

  addCommands() {
    return {
      insertVariable:
        (name) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { name } }),
    }
  },
})
