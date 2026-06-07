/**
 * Merge-patch emitter for object-valued v-model controls. Replaces the repeated
 *   function patch(p) { emit('update:modelValue', { ...props.modelValue, ...p }) }
 * boilerplate in inspector controls.
 */
export function usePatch<T extends object>(
  props: { modelValue: T },
  emit: (event: 'update:modelValue', value: T) => void,
) {
  return (patch: Partial<T>): void => emit('update:modelValue', { ...props.modelValue, ...patch })
}
