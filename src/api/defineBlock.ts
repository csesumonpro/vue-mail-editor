import type { BlockDefinition } from './types'

/** Identity helper that gives full type inference when authoring a block. */
export function defineBlock<V extends Record<string, unknown>>(
  def: BlockDefinition<V>,
): BlockDefinition<V> {
  return def
}
