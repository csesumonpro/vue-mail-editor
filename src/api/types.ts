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
export type { VariableMode } from '@/export/helpers'
export type { Design, DesignVariable } from '@/types/schema'

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
  /** Clear to a fresh, empty design (no confirm prompt — that's the UI's job). */
  newDesign(): void
  /**
   * Render the current design to email-safe HTML and return it.
   * `mode` defaults to `'token'` (keep `{{{name}}}`); pass `'fallback'` to
   * substitute each variable's fallback value for static HTML.
   */
  exportHtml(mode?: import('@/export/helpers').VariableMode): string
  /** Read the template variable registry. */
  getVariables(): import('@/types/schema').DesignVariable[]
  /** Replace the template variable registry. */
  setVariables(variables: import('@/types/schema').DesignVariable[]): void
  /** Trigger the Save flow (emits `save` + runs the `onSave` prop, if any). */
  save(): void | Promise<void>
  /** Trigger the Export flow (emits `export` + runs the `onExport` prop, if any). */
  export(): void | Promise<void>
  undo(): void
  redo(): void
  registerBlock(def: AnyBlockDefinition): void
  selectBody(): void
}
