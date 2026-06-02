import { onBeforeUnmount, onMounted } from 'vue'
import { useEditorStore } from '@/stores/editor'

/** Wire Cmd/Ctrl+Z (undo) and Cmd/Ctrl+Shift+Z / Ctrl+Y (redo) shortcuts. */
export function useHistoryShortcuts() {
  const store = useEditorStore()

  function onKeydown(e: KeyboardEvent) {
    const mod = e.metaKey || e.ctrlKey
    if (!mod) return

    // Ignore while typing in inputs / contenteditable.
    const t = e.target as HTMLElement | null
    if (
      t &&
      (t.isContentEditable ||
        t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA' ||
        t.tagName === 'SELECT')
    ) {
      return
    }

    const key = e.key.toLowerCase()
    if (key === 'z' && !e.shiftKey) {
      e.preventDefault()
      store.undo()
    } else if ((key === 'z' && e.shiftKey) || key === 'y') {
      e.preventDefault()
      store.redo()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
