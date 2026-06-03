import { watch } from 'vue'
import type { Design } from '@/types/schema'
import { SCHEMA_VERSION } from '@/types/schema'
import type { Editor } from '@/core/createEditor'

const STORAGE_KEY = 'vue-email-editor:autosave'

interface SavedPayload {
  schemaVersion: number
  savedAt: number
  design: Design
}

/** Read the last autosaved design, if any and compatible. */
export function loadAutosave(): Design | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const payload = JSON.parse(raw) as SavedPayload
    if (payload.schemaVersion !== SCHEMA_VERSION) return null
    return payload.design
  } catch {
    return null
  }
}

export function clearAutosave() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Persist the design to localStorage, debounced, whenever it changes.
 * Call once from a setup context (e.g. App.vue).
 */
export function useAutosave(store: Editor, debounceMs = 800) {
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(
    () => store.design,
    (design) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const payload: SavedPayload = {
          schemaVersion: SCHEMA_VERSION,
          savedAt: performance.timeOrigin + performance.now(),
          design,
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        } catch {
          /* storage full / unavailable — ignore */
        }
      }, debounceMs)
    },
    { deep: true },
  )
}
