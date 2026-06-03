import { onBeforeUnmount, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'

function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null
  return (
    !!el &&
    (el.isContentEditable ||
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.tagName === 'SELECT')
  )
}

/**
 * Global editor shortcuts:
 *   Cmd/Ctrl+Z undo · Cmd/Ctrl+Shift+Z / Ctrl+Y redo
 *   Cmd/Ctrl+D duplicate · Delete/Backspace remove · Esc deselect
 */
export function useHistoryShortcuts() {
  const store = useEditorStore()

  function onKeydown(e: KeyboardEvent) {
    if (isTyping(e.target)) return
    const mod = e.metaKey || e.ctrlKey
    const key = e.key.toLowerCase()
    const sel = store.selection
    const removable = sel.kind === 'row' || sel.kind === 'content'

    if (mod && key === 'z' && !e.shiftKey) {
      e.preventDefault()
      store.undo()
    } else if (mod && (key === 'y' || (key === 'z' && e.shiftKey))) {
      e.preventDefault()
      store.redo()
    } else if (mod && key === 'd') {
      if (removable && sel.id) {
        e.preventDefault()
        store.duplicateNode(sel.kind as 'row' | 'content', sel.id)
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (removable && sel.id) {
        e.preventDefault()
        store.removeNode(sel.kind as 'row' | 'content', sel.id)
      } else if (sel.kind === 'column' && sel.id) {
        // Deleting a column removes its parent row (the container).
        const found = store.findColumn(sel.id)
        if (found) {
          e.preventDefault()
          store.removeNode('row', found.row.id)
        }
      }
    } else if (e.key === 'Escape') {
      store.selectBody()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
