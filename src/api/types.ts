import type { Component } from 'vue'
import type { Content } from '@/types/schema'
import type { AccordionGroup, ControlDef } from '@/config/inspector'
import type { ExportContext } from '@/export/helpers'

export type { ControlDef, ExportContext }
export type { Design } from '@/types/schema'

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
