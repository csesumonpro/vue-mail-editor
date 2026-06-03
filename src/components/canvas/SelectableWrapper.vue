<script setup lang="ts">
import { computed } from 'vue'
import { ChevronUp, ChevronDown, Copy, Trash2, GripVertical } from 'lucide-vue-next'
import { useEditorStore } from '@/stores/editor'
import type { SelectionKind } from '@/types/schema'

const props = defineProps<{
  kind: Extract<SelectionKind, 'row' | 'column' | 'content'>
  id: string
  label: string
}>()

const store = useEditorStore()

const selected = computed(
  () => store.selection.kind === props.kind && store.selection.id === props.id,
)

function onClick(e: MouseEvent) {
  if (store.previewMode) return
  e.stopPropagation()
  store.selectAndInspect(props.kind, props.id)
}

/* Position-aware actions (rows reorder in body; contents reorder in column). */
const rowIndex = computed(() =>
  store.design.body.rows.findIndex((r) => r.id === props.id),
)
const contentLoc = computed(() =>
  props.kind === 'content' ? store.findContent(props.id) : null,
)

const canMoveUp = computed(() =>
  props.kind === 'row'
    ? rowIndex.value > 0
    : (contentLoc.value?.index ?? 0) > 0,
)
const canMoveDown = computed(() => {
  if (props.kind === 'row')
    return rowIndex.value < store.design.body.rows.length - 1
  const loc = contentLoc.value
  return !!loc && loc.index < loc.column.contents.length - 1
})

const hasActions = computed(() => props.kind === 'row' || props.kind === 'content')

function move(delta: number) {
  if (props.kind === 'row') {
    store.moveRow(rowIndex.value, rowIndex.value + delta)
  } else if (props.kind === 'content') {
    store.moveContentWithinColumn(props.id, delta)
  }
}

function duplicate() {
  if (props.kind === 'row' || props.kind === 'content') {
    store.duplicateNode(props.kind, props.id)
  }
}

function remove() {
  if (props.kind === 'row' || props.kind === 'content') {
    store.removeNode(props.kind, props.id)
  }
}

const dragHandleClass = computed(() =>
  props.kind === 'row'
    ? 'row-drag-handle'
    : props.kind === 'content'
      ? 'content-drag-handle'
      : '',
)

const ringClass = computed(() => {
  if (selected.value) return 'outline outline-2 outline-brand'
  return 'outline-1 outline-transparent hover:outline-dashed hover:outline-2 hover:outline-brand/50'
})
</script>

<template>
  <div
    class="group/sel relative outline-offset-[-1px] transition-[outline]"
    :class="ringClass"
    @click="onClick"
  >
    <!-- Action bar: shown on hover or when selected -->
    <div
      v-if="!store.previewMode && hasActions"
      class="absolute -top-px left-0 z-20 hidden -translate-y-full items-center gap-0.5 rounded-t bg-brand px-1 py-0.5 text-on-accent group-hover/sel:flex"
      :class="{ '!flex': selected }"
      @click.stop
    >
      <span
        :class="dragHandleClass"
        class="flex cursor-grab items-center px-0.5 active:cursor-grabbing"
        v-tooltip="'Drag to move'"
        @click.stop="onClick"
      >
        <GripVertical class="h-3.5 w-3.5" />
      </span>
      <button
        type="button"
        v-tooltip="'Move up'"
        class="rounded p-0.5 hover:bg-on-accent/20 disabled:opacity-40"
        :disabled="!canMoveUp"
        @click="move(-1)"
      >
        <ChevronUp class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        v-tooltip="'Move down'"
        class="rounded p-0.5 hover:bg-on-accent/20 disabled:opacity-40"
        :disabled="!canMoveDown"
        @click="move(1)"
      >
        <ChevronDown class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        v-tooltip="'Duplicate'"
        class="rounded p-0.5 hover:bg-on-accent/20"
        @click="duplicate"
      >
        <Copy class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        v-tooltip="'Delete'"
        class="rounded p-0.5 hover:bg-on-accent/20"
        @click="remove"
      >
        <Trash2 class="h-3.5 w-3.5" />
      </button>
    </div>

    <slot />
  </div>
</template>
