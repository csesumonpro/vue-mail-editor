import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  Column,
  Content,
  Design,
  Device,
  Row,
  Selection,
  SelectionKind,
} from '@/types/schema'
import { createRow } from '@/config/defaults'
import { createContent } from '@/config/blockDefaults'
import { createDesign } from '@/config/seed'
import { deepClone } from '@/utils/clone'
import { uid } from '@/utils/id'
import type { ContentType } from '@/types/schema'

const HISTORY_LIMIT = 50
/** Edits sharing a key within this window coalesce into one undo step. */
const COALESCE_MS = 700

export const useEditorStore = defineStore('editor', () => {
  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  const design = ref<Design>(createDesign())
  const selection = ref<Selection>({ kind: 'body', id: null })
  const device = ref<Device>('desktop')
  const previewMode = ref(false)

  // Snapshot history (serialized JSON to keep memory small).
  const past = ref<string[]>([])
  const future = ref<string[]>([])
  let lastKey: string | null = null
  let lastTime = -Infinity

  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)

  /* ------------------------------------------------------------------ */
  /* History                                                            */
  /* ------------------------------------------------------------------ */
  /** Record the *current* state before mutating. Pass a key to coalesce a burst. */
  function record(key?: string) {
    const now = performance.now()
    const sameBurst = key != null && key === lastKey && now - lastTime < COALESCE_MS
    lastKey = key ?? null
    lastTime = now
    if (sameBurst) return
    past.value.push(JSON.stringify(design.value))
    if (past.value.length > HISTORY_LIMIT) past.value.shift()
    future.value = []
  }

  function undo() {
    const prev = past.value.pop()
    if (prev === undefined) return
    future.value.push(JSON.stringify(design.value))
    design.value = JSON.parse(prev) as Design
    lastKey = null
    normalizeSelection()
  }

  function redo() {
    const next = future.value.pop()
    if (next === undefined) return
    past.value.push(JSON.stringify(design.value))
    design.value = JSON.parse(next) as Design
    lastKey = null
    normalizeSelection()
  }

  /* ------------------------------------------------------------------ */
  /* Lookups                                                            */
  /* ------------------------------------------------------------------ */
  function findRow(id: string): Row | null {
    return design.value.body.rows.find((r) => r.id === id) ?? null
  }

  function findColumn(
    id: string,
  ): { row: Row; column: Column; index: number } | null {
    for (const row of design.value.body.rows) {
      const index = row.columns.findIndex((c) => c.id === id)
      if (index !== -1) return { row, column: row.columns[index], index }
    }
    return null
  }

  function findContent(
    id: string,
  ): { row: Row; column: Column; content: Content; index: number } | null {
    for (const row of design.value.body.rows) {
      for (const column of row.columns) {
        const index = column.contents.findIndex((c) => c.id === id)
        if (index !== -1)
          return { row, column, content: column.contents[index], index }
      }
    }
    return null
  }

  /* ------------------------------------------------------------------ */
  /* Selection                                                          */
  /* ------------------------------------------------------------------ */
  function select(kind: SelectionKind, id: string | null) {
    selection.value = { kind, id }
  }

  function selectBody() {
    selection.value = { kind: 'body', id: design.value.body.id }
  }

  function clearSelection() {
    selectBody()
  }

  /** After undo/redo or deletion, drop selection if its node vanished. */
  function normalizeSelection() {
    const { kind, id } = selection.value
    if (kind === 'body' || kind === null) return
    const exists =
      (kind === 'row' && findRow(id!)) ||
      (kind === 'column' && findColumn(id!)) ||
      (kind === 'content' && findContent(id!))
    if (!exists) selectBody()
  }

  /* ------------------------------------------------------------------ */
  /* View state                                                         */
  /* ------------------------------------------------------------------ */
  function setDevice(d: Device) {
    device.value = d
  }

  function togglePreview(value?: boolean) {
    previewMode.value = value ?? !previewMode.value
  }

  /* ------------------------------------------------------------------ */
  /* Value updates                                                      */
  /* ------------------------------------------------------------------ */
  function updateBodyValues(patch: Record<string, unknown>, key?: string) {
    record(key)
    Object.assign(design.value.body.values, patch)
  }

  function updateRowValues(
    id: string,
    patch: Record<string, unknown>,
    key?: string,
  ) {
    const row = findRow(id)
    if (!row) return
    record(key)
    Object.assign(row.values, patch)
  }

  function updateColumnValues(
    id: string,
    patch: Record<string, unknown>,
    key?: string,
  ) {
    const found = findColumn(id)
    if (!found) return
    record(key)
    Object.assign(found.column.values, patch)
  }

  function updateContentValues(
    id: string,
    patch: Record<string, unknown>,
    key?: string,
  ) {
    const found = findContent(id)
    if (!found) return
    record(key)
    Object.assign(found.content.values, patch)
  }

  /* ------------------------------------------------------------------ */
  /* Structure mutations                                                */
  /* ------------------------------------------------------------------ */
  function addRow(cells: number[] = [12], atIndex?: number): Row {
    record()
    const row = createRow(cells)
    const rows = design.value.body.rows
    rows.splice(atIndex ?? rows.length, 0, row)
    select('row', row.id)
    return row
  }

  function addContent(content: Content, columnId: string, atIndex?: number) {
    const found = findColumn(columnId)
    if (!found) return
    record()
    const { contents } = found.column
    contents.splice(atIndex ?? contents.length, 0, content)
    select('content', content.id)
  }

  /**
   * Add a block of `type` at a location inferred from the current selection:
   * after the selected content, into the selected column, else the last row's
   * first column (creating a row if the body is empty).
   */
  function addBlock(type: ContentType) {
    const content = createContent(type)
    const sel = selection.value

    if (sel.kind === 'content' && sel.id) {
      const found = findContent(sel.id)
      if (found) {
        record()
        found.column.contents.splice(found.index + 1, 0, content)
        select('content', content.id)
        return content
      }
    }

    if (sel.kind === 'column' && sel.id) {
      const found = findColumn(sel.id)
      if (found) {
        record()
        found.column.contents.push(content)
        select('content', content.id)
        return content
      }
    }

    // Fall back to the last row's first column.
    record()
    const rows = design.value.body.rows
    if (!rows.length) rows.push(createRow([12]))
    rows[rows.length - 1].columns[0].contents.push(content)
    select('content', content.id)
    return content
  }

  function removeNode(kind: Exclude<SelectionKind, 'body' | null>, id: string) {
    record()
    if (kind === 'row') {
      design.value.body.rows = design.value.body.rows.filter((r) => r.id !== id)
    } else if (kind === 'content') {
      const found = findContent(id)
      if (found) found.column.contents.splice(found.index, 1)
    }
    normalizeSelection()
  }

  function duplicateNode(kind: 'row' | 'content', id: string) {
    record()
    if (kind === 'row') {
      const idx = design.value.body.rows.findIndex((r) => r.id === id)
      if (idx === -1) return
      const copy = reId(deepClone(design.value.body.rows[idx])) as Row
      design.value.body.rows.splice(idx + 1, 0, copy)
      select('row', copy.id)
    } else {
      const found = findContent(id)
      if (!found) return
      const copy = reId(deepClone(found.content)) as Content
      found.column.contents.splice(found.index + 1, 0, copy)
      select('content', copy.id)
    }
  }

  /** Move a content node to a (column, index). Used by drag & drop. */
  function moveContent(contentId: string, toColumnId: string, toIndex: number) {
    const from = findContent(contentId)
    const to = findColumn(toColumnId)
    if (!from || !to) return
    record()
    from.column.contents.splice(from.index, 1)
    const insertAt =
      from.column === to.column && from.index < toIndex ? toIndex - 1 : toIndex
    to.column.contents.splice(insertAt, 0, from.content)
  }

  /** Nudge a content node up/down within its column (toolbar arrows). */
  function moveContentWithinColumn(id: string, delta: number) {
    const found = findContent(id)
    if (!found) return
    const arr = found.column.contents
    const next = found.index + delta
    if (next < 0 || next >= arr.length) return
    record()
    const [item] = arr.splice(found.index, 1)
    arr.splice(next, 0, item)
  }

  function moveRow(fromIndex: number, toIndex: number) {
    const rows = design.value.body.rows
    if (fromIndex === toIndex) return
    record()
    const [row] = rows.splice(fromIndex, 1)
    rows.splice(toIndex, 0, row)
  }

  /* ------------------------------------------------------------------ */
  /* Load / reset                                                       */
  /* ------------------------------------------------------------------ */
  function loadDesign(next: Design, recordHistory = true) {
    if (recordHistory) record()
    design.value = next
    normalizeSelection()
  }

  function resetDesign() {
    record()
    design.value = createDesign()
    selectBody()
  }

  return {
    // state
    design,
    selection,
    device,
    previewMode,
    canUndo,
    canRedo,
    // history
    record,
    undo,
    redo,
    // lookups
    findRow,
    findColumn,
    findContent,
    // selection
    select,
    selectBody,
    clearSelection,
    // view
    setDevice,
    togglePreview,
    // values
    updateBodyValues,
    updateRowValues,
    updateColumnValues,
    updateContentValues,
    // structure
    addRow,
    addContent,
    addBlock,
    removeNode,
    duplicateNode,
    moveContent,
    moveContentWithinColumn,
    moveRow,
    // load
    loadDesign,
    resetDesign,
  }
})

/* Give every node in a cloned subtree fresh ids (for duplicate). */
function reId(node: Row | Content): Row | Content {
  if ('cells' in node) {
    node.id = uid('row')
    for (const col of node.columns) {
      col.id = uid('col')
      for (const content of col.contents) content.id = uid('el')
    }
  } else {
    node.id = uid('el')
  }
  return node
}
