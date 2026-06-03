import type { Component } from 'vue'
import type { Content } from '@/types/schema'
import type {
  AccordionGroup,
  ControlDef,
  ControlType,
  SelectOption,
} from '@/config/inspector'
import type { ExportContext } from '@/export/helpers'

export type { ControlDef, ControlType, SelectOption, ExportContext }
export type { Design } from '@/types/schema'

/** Payload emitted/handled when saving the design as a template. */
export interface TemplatePayload {
  name: string
  design: import('@/types/schema').Design
}

/** Built-in persistence mode. */
export type StorageMode = 'local' | 'none'

/** An inspector accordion group (re-exported public name). */
export type InspectorGroup = AccordionGroup

/**
 * Public definition for a content block. Built-in blocks use the same shape, so
 * third-party blocks are first-class.
 *
 * The `render` component receives:
 *   props:  { values: V; selected: boolean; editing: boolean }
 *   emits:  (e: 'update', patch: Partial<V>)
 */
export interface BlockDefinition<V = Record<string, unknown>> {
  /** Unique block type key. */
  type: string
  /** Display name (palette tooltip + inspector title). */
  label: string
  /** Rail icon component. */
  icon: Component
  category?: 'content' | 'layout'
  /** Factory for a fresh value bag. */
  defaultValues: () => V
  /** Canvas render component. */
  render: Component
  /** Inspector accordions (allowed controls only). */
  inspector?: InspectorGroup[]
  /** Serialize to email-safe HTML. */
  toHtml: (values: V, ctx: ExportContext) => string
}

/** Loosely-typed definition used inside the registry. */
export type AnyBlockDefinition = BlockDefinition<any>

/** Imperative API exposed via `ready(api)` or a template ref. */
export interface EditorApi {
  /** A deep-cloned snapshot of the current design. */
  getDesign(): import('@/types/schema').Design
  loadDesign(design: import('@/types/schema').Design): void
  exportHtml(): string
  undo(): void
  redo(): void
  registerBlock(def: AnyBlockDefinition): void
  selectBody(): void
}
