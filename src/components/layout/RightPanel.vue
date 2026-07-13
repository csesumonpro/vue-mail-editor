<script setup lang="ts">
import { vTooltip } from "@/directives/tooltip"
import { computed } from 'vue'
import { X, Copy, Trash2, ChevronRight } from 'lucide-vue-next'
import { useEditor } from '@/core/useEditor'
import { useBlocks } from '@/core/registry'
import type { SelectionKind } from '@/types/schema'
import type { ControlDef, InspectorSchema } from '@/config/inspector'
import {
  bodyInspector,
  rowInspector,
  columnInspector,
} from '@/config/inspectorSchemas'
import Accordion from '@/components/inspector/Accordion.vue'
import InspectorControl from '@/components/inspector/InspectorControl.vue'

const store = useEditor()
const blocks = useBlocks()

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
    const def = blocks.get(found.content.type)
    return {
      title: def?.label ?? found.content.type,
      schema: def?.inspector ?? [],
      values: found.content.values as unknown as Record<string, unknown>,
      update: (patch, key) => store.updateContentValues(sel.id!, patch, key),
    }
  }
  return null
})

// Ancestor path of the current selection (Body › Row › Column › Block), so the
// user can jump directly to any level — one click, no walking up the toolbar,
// and it always shows where they are. The last crumb is the current selection.
interface Crumb {
  label: string
  kind: SelectionKind
  id: string
}
const crumbs = computed<Crumb[]>(() => {
  const sel = store.selection
  const list: Crumb[] = [{ label: 'Body', kind: 'body', id: store.design.body.id }]
  if (sel.kind === 'row' && sel.id) {
    list.push({ label: 'Row', kind: 'row', id: sel.id })
  } else if (sel.kind === 'column' && sel.id) {
    const f = store.findColumn(sel.id)
    if (f) {
      list.push({ label: 'Row', kind: 'row', id: f.row.id })
      list.push({ label: 'Column', kind: 'column', id: f.column.id })
    }
  } else if (sel.kind === 'content' && sel.id) {
    const f = store.findContent(sel.id)
    if (f) {
      const def = blocks.get(f.content.type)
      list.push({ label: 'Row', kind: 'row', id: f.row.id })
      list.push({ label: 'Column', kind: 'column', id: f.column.id })
      list.push({ label: def?.label ?? f.content.type, kind: 'content', id: f.content.id })
    }
  }
  return list
})
function goTo(c: Crumb) {
  store.selectAndInspect(c.kind, c.id)
}

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

/** Controls in a group that pass their `showIf` predicate for the current values. */
function visibleControls(controls: ControlDef[]): ControlDef[] {
  const values = target.value?.values ?? {}
  return controls.filter((c) => !c.showIf || c.showIf(values))
}

const hasControls = computed(
  () =>
    !!target.value &&
    target.value.schema.some((g) => visibleControls(g.controls).length),
)

const sel = computed(() => store.selection)
const canDuplicate = computed(
  () => sel.value.kind === 'row' || sel.value.kind === 'content',
)
const canDelete = computed(() => sel.value.kind !== 'body' && sel.value.kind !== null)
const deleteLabel = computed(() =>
  sel.value.kind === 'column' ? 'Delete container' : `Delete ${target.value?.title.toLowerCase()}`,
)

function duplicate() {
  const s = sel.value
  if ((s.kind === 'row' || s.kind === 'content') && s.id) {
    store.duplicateNode(s.kind, s.id)
  }
}

function remove() {
  const s = sel.value
  if ((s.kind === 'row' || s.kind === 'content') && s.id) {
    store.removeNode(s.kind, s.id)
  } else if (s.kind === 'column' && s.id) {
    // Removing a column removes its parent container (row).
    const found = store.findColumn(s.id)
    if (found) store.removeNode('row', found.row.id)
  }
}
</script>

<template>
  <aside class="flex w-80 shrink-0 flex-col border-l border-line bg-panel">
    <div class="flex items-center justify-between border-b border-line px-4 py-3">
      <h2 class="text-xs font-semibold uppercase tracking-wide text-subtle">
        {{ target ? target.title + ' settings' : 'Settings' }}
      </h2>
      <div class="flex items-center gap-0.5">
        <button
          v-if="canDuplicate"
          type="button"
          v-tooltip="'Duplicate'"
          class="flex h-7 w-7 items-center justify-center rounded-md text-faint transition hover:bg-hover hover:text-ink"
          @click="duplicate"
        >
          <Copy class="h-4 w-4" />
        </button>
        <button
          v-if="canDelete"
          type="button"
          v-tooltip="deleteLabel"
          class="flex h-7 w-7 items-center justify-center rounded-md text-faint transition hover:bg-danger-soft hover:text-danger"
          @click="remove"
        >
          <Trash2 class="h-4 w-4" />
        </button>
        <div v-if="canDelete" class="mx-0.5 h-5 w-px bg-line" />
        <button
          type="button"
          v-tooltip="'Close'"
          class="flex h-7 w-7 items-center justify-center rounded-md text-faint transition hover:bg-hover hover:text-ink"
          @click="store.closeInspector()"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Selection path: click any level to jump straight to it. -->
    <nav
      v-if="target && crumbs.length > 1"
      class="flex flex-wrap items-center gap-0.5 border-b border-line px-4 py-2 text-xs"
      aria-label="Selection path"
    >
      <template v-for="(c, i) in crumbs" :key="c.kind + c.id">
        <ChevronRight v-if="i > 0" class="h-3 w-3 shrink-0 text-faint" />
        <button
          type="button"
          class="max-w-[9rem] truncate rounded px-1 py-0.5 transition"
          :class="
            i === crumbs.length - 1
              ? 'font-semibold text-ink'
              : 'text-faint hover:bg-hover hover:text-ink'
          "
          :disabled="i === crumbs.length - 1"
          @click="goTo(c)"
        >
          {{ c.label }}
        </button>
      </template>
    </nav>

    <div class="scroll-thin flex-1 overflow-y-auto">
      <template v-if="target && hasControls">
        <Accordion
          v-for="(group, gi) in target.schema.filter((g) => visibleControls(g.controls).length)"
          :key="group.title + gi"
          :title="group.title"
          :icon="group.icon"
        >
          <InspectorControl
            v-for="(ctrl, ci) in visibleControls(group.controls)"
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
