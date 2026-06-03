import type { Component } from 'vue'

/** Control kinds the inspector can render. */
export type ControlType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'slider'
  | 'color'
  | 'select'
  | 'align'
  | 'spacing'
  | 'border'
  | 'font'
  | 'toggle'
  | 'link'
  | 'image'
  | 'background'
  | 'list'

export interface SelectOption {
  label: string
  value: string | number
}

export interface ControlDef {
  type: ControlType
  /** Value key this control binds to (within the node's `values`). */
  key: string
  label?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: SelectOption[]
  placeholder?: string
  /** For the list editor: which item shape to edit. */
  itemKind?: 'social' | 'menu'
}

export interface AccordionGroup {
  title: string
  icon?: Component
  controls: ControlDef[]
}

export type InspectorSchema = AccordionGroup[]
