import { reactive } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'error'
}

const state = reactive<{ items: Toast[] }>({ items: [] })
let counter = 0

export function useToast() {
  function notify(message: string, type: Toast['type'] = 'success') {
    const id = ++counter
    state.items.push({ id, message, type })
    setTimeout(() => {
      const i = state.items.findIndex((t) => t.id === id)
      if (i !== -1) state.items.splice(i, 1)
    }, 2600)
  }

  return { state, notify }
}
