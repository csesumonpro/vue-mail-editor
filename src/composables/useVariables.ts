import { computed } from 'vue'
import type { DesignVariable } from '@/types/schema'
import type { Editor } from '@/core/createEditor'
import { useEditor } from '@/core/useEditor'

/**
 * Template-variable registry helpers, layered over the editor store.
 *
 * The registry lives on `design.variables`; mutations go through
 * `store.updateVariables` so they participate in undo/redo and autosave. Each
 * action uses a distinct history key — per-variable for `update` so rapid
 * fallback edits to one variable coalesce into a single undo step.
 */
export function useVariables(store: Editor = useEditor()) {
  const list = computed<DesignVariable[]>(() => store.design.variables ?? [])

  function get(name: string): DesignVariable | undefined {
    return list.value.find((v) => v.name === name)
  }

  function exists(name: string): boolean {
    return list.value.some((v) => v.name === name)
  }

  function create(variable: DesignVariable) {
    if (exists(variable.name)) {
      update(variable.name, variable)
      return
    }
    store.updateVariables([...list.value, variable], 'variables:create')
  }

  function update(name: string, patch: Partial<DesignVariable>) {
    store.updateVariables(
      list.value.map((v) => (v.name === name ? { ...v, ...patch } : v)),
      `variables:update:${name}`,
    )
  }

  function remove(name: string) {
    store.updateVariables(
      list.value.filter((v) => v.name !== name),
      'variables:remove',
    )
  }

  return { list, get, exists, create, update, remove }
}
