import { inject } from 'vue'
import { EDITOR_KEY } from './keys'
import type { Editor } from './createEditor'

/** Access the current editor instance. Must be used within <EmailEditor>. */
export function useEditor(): Editor {
  const editor = inject(EDITOR_KEY)
  if (!editor) {
    throw new Error('[vue-email-editor] useEditor() must be used inside <EmailEditor>.')
  }
  return editor
}
