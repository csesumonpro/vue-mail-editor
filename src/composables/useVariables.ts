import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import type { DesignVariable } from '@/types/schema'
import { EDITOR_KEY, VARIABLES_KEY, type VariablesController } from '@/core/keys'

export type { VariablesController }

/**
 * Build a variable-registry controller from a reactive list + a setter. Each
 * action uses a distinct history key — per-variable for `update` so rapid
 * fallback edits to one variable coalesce into a single undo step.
 */
export function createVariablesController(
  list: ComputedRef<DesignVariable[]>,
  set: (next: DesignVariable[], key?: string) => void,
): VariablesController {
  const get = (name: string) => list.value.find((v) => v.name === name)
  const exists = (name: string) => list.value.some((v) => v.name === name)
  const update = (name: string, patch: Partial<DesignVariable>) =>
    set(
      list.value.map((v) => (v.name === name ? { ...v, ...patch } : v)),
      `variables:update:${name}`,
    )
  const create = (variable: DesignVariable) => {
    if (exists(variable.name)) update(variable.name, variable)
    else set([...list.value, variable], 'variables:create')
  }
  const remove = (name: string) =>
    set(list.value.filter((v) => v.name !== name), 'variables:remove')
  return { list, get, exists, create, update, remove }
}

/**
 * Resolve the active variable controller. Order:
 *   1. a host-provided controller (VARIABLES_KEY — used by the standalone editor)
 *   2. the email-editor design store (EDITOR_KEY)
 *   3. an empty, read-only controller (no host context)
 */
export function useVariables(): VariablesController {
  const provided = inject(VARIABLES_KEY, null)
  if (provided) return provided

  const store = inject(EDITOR_KEY, null)
  if (store) {
    return createVariablesController(
      computed(() => store.design.variables ?? []),
      (next, key) => store.updateVariables(next, key),
    )
  }

  return createVariablesController(computed(() => []), () => {})
}
