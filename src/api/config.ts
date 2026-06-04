import type { Device } from '@/types/schema'
import type { TemplateDef } from '@/config/templates'

export type { TemplateDef }

/** Which top-bar actions are shown. */
export interface EditorActions {
  undo?: boolean
  preview?: boolean
  theme?: boolean
  templates?: boolean
  new?: boolean
  import?: boolean
  save?: boolean
  saveTemplate?: boolean
  export?: boolean
}

/** Text/tooltip labels for built-in actions (rename without replacing the bar). */
export interface EditorLabels {
  brand?: string
  save?: string
  export?: string
  saveTemplate?: string
  undo?: string
  redo?: string
  preview?: string
  templates?: string
  new?: string
  import?: string
}

export interface EditorConfig {
  /** Default email content width for new designs. */
  contentWidth?: number
  /** Which device toggles to show. */
  devices?: Device[]
  /** Show/hide built-in actions. */
  actions?: EditorActions
  /** Rename built-in action labels/tooltips. */
  labels?: EditorLabels
  /** Starter templates (replaces the built-ins). */
  templates?: TemplateDef[]
  /** Autosave debounce in ms (local storage mode). */
  autosaveMs?: number
}

export interface ResolvedConfig {
  contentWidth?: number
  devices: Device[]
  actions: Required<EditorActions>
  labels: Required<EditorLabels>
  templates?: TemplateDef[]
  autosaveMs: number
}

export function resolveConfig(c?: EditorConfig): ResolvedConfig {
  return {
    contentWidth: c?.contentWidth,
    devices: c?.devices ?? ['desktop', 'tablet', 'mobile'],
    actions: {
      undo: c?.actions?.undo ?? true,
      preview: c?.actions?.preview ?? true,
      theme: c?.actions?.theme ?? true,
      templates: c?.actions?.templates ?? true,
      new: c?.actions?.new ?? true,
      import: c?.actions?.import ?? true,
      save: c?.actions?.save ?? true,
      saveTemplate: c?.actions?.saveTemplate ?? false,
      export: c?.actions?.export ?? true,
    },
    labels: {
      brand: c?.labels?.brand ?? 'Vue Email Editor',
      save: c?.labels?.save ?? 'Save Design',
      export: c?.labels?.export ?? 'Export HTML',
      saveTemplate: c?.labels?.saveTemplate ?? 'Save as template',
      undo: c?.labels?.undo ?? 'Undo',
      redo: c?.labels?.redo ?? 'Redo',
      preview: c?.labels?.preview ?? 'Preview',
      templates: c?.labels?.templates ?? 'Templates',
      new: c?.labels?.new ?? 'New design',
      import: c?.labels?.import ?? 'Import design JSON',
    },
    templates: c?.templates,
    autosaveMs: c?.autosaveMs ?? 800,
  }
}
