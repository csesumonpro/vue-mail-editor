import { inject, reactive } from 'vue'
import type { AnyBlockDefinition } from '@/api/types'
import type { Content } from '@/types/schema'
import { BUILTIN_BLOCKS } from '@/blocks/builtins'
import { BLOCKS_KEY } from './keys'
import { uid } from '@/utils/id'

export interface BlockRegistry {
  /** Ordered, reactive list of available blocks (for the palette). */
  list: AnyBlockDefinition[]
  get(type: string): AnyBlockDefinition | undefined
  /** Create a fresh content node of `type` from its defaults (null if unknown). */
  create(type: string): Content | null
  register(def: AnyBlockDefinition): void
}

/**
 * Build a per-instance registry from built-ins + consumer blocks, minus disabled.
 * Consumer blocks with an existing `type` override the built-in.
 */
export function createRegistry(opts?: {
  blocks?: AnyBlockDefinition[]
  disabled?: string[]
}): BlockRegistry {
  const map = new Map<string, AnyBlockDefinition>()
  for (const def of BUILTIN_BLOCKS) map.set(def.type, def)
  for (const def of opts?.blocks ?? []) map.set(def.type, def)
  for (const t of opts?.disabled ?? []) map.delete(t)

  const state = reactive<{ list: AnyBlockDefinition[] }>({ list: [...map.values()] })

  return {
    get list() {
      return state.list
    },
    get: (type) => map.get(type),
    create(type) {
      const def = map.get(type)
      if (!def) return null
      return { id: uid('el'), type, values: def.defaultValues() } as Content
    },
    register(def) {
      map.set(def.type, def)
      state.list = [...map.values()]
    },
  }
}

/** Access the current block registry. Must be used within <EmailEditor>. */
export function useBlocks(): BlockRegistry {
  const reg = inject(BLOCKS_KEY)
  if (!reg) {
    throw new Error('[vue-email-editor] useBlocks() must be used inside <EmailEditor>.')
  }
  return reg
}
