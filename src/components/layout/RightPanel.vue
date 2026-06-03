<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useEditorStore } from '@/stores/editor'
import type { InspectorSchema } from '@/config/inspector'
import {
  bodyInspector,
  rowInspector,
  columnInspector,
  blockInspectors,
} from '@/config/inspectorSchemas'
import { BLOCKS } from '@/config/blocks'
import Accordion from '@/components/inspector/Accordion.vue'
import InspectorControl from '@/components/inspector/InspectorControl.vue'

const store = useEditorStore()

interface Target {
  title: string
  schema: InspectorSchema
  values: Record<string, unknown>
  update: (patch: Record<string, unknown>, key?: string) => void
}

const target = computed<Target | null>(() => {
  const sel = store.selection
  if (sel.kind === 'body') {
    return {
      title: 'Body',
      schema: bodyInspector,
      values: store.design.body.values as unknown as Record<string, unknown>,
      update: (patch, key) => store.updateBodyValues(patch, key),
    }
  }
  if (sel.kind === 'row' && sel.id) {
    const row = store.findRow(sel.id)
    if (!row) return null
    return {
      title: 'Row',
      schema: rowInspector,
      values: row.values as unknown as Record<string, unknown>,
      update: (patch, key) => store.updateRowValues(sel.id!, patch, key),
    }
  }
  if (sel.kind === 'column' && sel.id) {
    const found = store.findColumn(sel.id)
    if (!found) return null
    return {
      title: 'Column',
      schema: columnInspector,
      values: found.column.values as unknown as Record<string, unknown>,
      update: (patch, key) => store.updateColumnValues(sel.id!, patch, key),
    }
  }
  if (sel.kind === 'content' && sel.id) {
    const found = store.findContent(sel.id)
    if (!found) return null
    return {
      title: BLOCKS[found.content.type].label,
      schema: blockInspectors[found.content.type],
      values: found.content.values as unknown as Record<string, unknown>,
      update: (patch, key) => store.updateContentValues(sel.id!, patch, key),
    }
  }
  return null
})

/** Read a (possibly dotted) key from the current values. */
function getValue(key: string): unknown {
  const v = target.value?.values
  if (!v) return undefined
  if (!key.includes('.')) return v[key]
  const [head, tail] = key.split('.')
  return (v[head] as Record<string, unknown> | undefined)?.[tail]
}

/** Write a (possibly dotted) key, coalescing history per control. */
function setValue(key: string, value: unknown) {
  const t = target.value
  if (!t) return
  const historyKey = `${store.selection.kind}:${store.selection.id}:${key}`
  if (key.includes('.')) {
    const [head, tail] = key.split('.')
    const branch = { ...(t.values[head] as Record<string, unknown>), [tail]: value }
    t.update({ [head]: branch }, historyKey)
  } else {
    t.update({ [key]: value }, historyKey)
  }
}

const hasControls = computed(
  () => !!target.value && target.value.schema.some((g) => g.controls.length),
)
</script>

<template>
  <aside class="flex w-80 shrink-0 flex-col border-l border-line bg-panel">
    <div class="flex items-center justify-between border-b border-line px-4 py-3">
      <h2 class="text-xs font-semibold uppercase tracking-wide text-subtle">
        {{ target ? target.title + ' settings' : 'Settings' }}
      </h2>
      <button
        type="button"
        title="Close"
        class="flex h-7 w-7 items-center justify-center rounded-md text-faint transition hover:bg-hover hover:text-ink"
        @click="store.closeInspector()"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <div class="scroll-thin flex-1 overflow-y-auto">
      <template v-if="target && hasControls">
        <Accordion
          v-for="(group, gi) in target.schema.filter((g) => g.controls.length)"
          :key="group.title + gi"
          :title="group.title"
          :icon="group.icon"
        >
          <InspectorControl
            v-for="(ctrl, ci) in group.controls"
            :key="ctrl.key + ci"
            :def="ctrl"
            :model-value="getValue(ctrl.key)"
            @update:model-value="setValue(ctrl.key, $event)"
          />
        </Accordion>
      </template>

      <div
        v-else
        class="flex flex-col items-center justify-center gap-1 p-8 text-center text-faint"
      >
        <p class="text-xs">No editable properties for this selection yet.</p>
      </div>
    </div>
  </aside>
</template>
