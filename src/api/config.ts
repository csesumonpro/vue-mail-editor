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
  export?: boolean
}

export interface EditorConfig {
  /** Default email content width for new designs. */
  contentWidth?: number
  /** Which device toggles to show. */
  devices?: Device[]
  /** Show/hide built-in actions. */
  actions?: EditorActions
  /** Starter templates (replaces the built-ins). */
  templates?: TemplateDef[]
  /** Autosave debounce in ms (local storage mode). */
  autosaveMs?: number
}

export interface ResolvedConfig {
  contentWidth?: number
  devices: Device[]
  actions: Required<EditorActions>
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
      export: c?.actions?.export ?? true,
    },
    templates: c?.templates,
    autosaveMs: c?.autosaveMs ?? 800,
  }
}
