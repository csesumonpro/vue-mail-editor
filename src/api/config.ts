import type { Device, DesignVariable } from '@/types/schema'
import type { TemplateDef } from '@/config/templates'

export type { TemplateDef }

/** Which top-bar actions are shown. */
export interface EditorActions {
  undo?: boolean
  preview?: boolean
  theme?: boolean
  fullscreen?: boolean
  templates?: boolean
  new?: boolean
  import?: boolean
  save?: boolean
  saveTemplate?: boolean
  export?: boolean
}

/** Which fields the email metadata header shows (subject, from, reply-to, preview). */
export interface MetaFields {
  from?: boolean
  replyTo?: boolean
  subject?: boolean
  preview?: boolean
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
  fullscreen?: string
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
  /**
   * Show text labels on the primary Save/Export buttons. Off by default — they
   * render icon-only (with the label as a tooltip). Set `true` for labeled
   * buttons.
   */
  labeledActions?: boolean
  /** Starter templates (replaces the built-ins). */
  templates?: TemplateDef[]
  /** Autosave debounce in ms (local storage mode). */
  autosaveMs?: number
  /** Predefined template variables (seeded into new/empty designs). */
  variables?: DesignVariable[]
  /**
   * Email metadata header (subject / from / reply-to / preview text) above the
   * canvas. Off by default — `true` shows all fields, or pass an object to pick
   * fields. For a fully custom header (e.g. a domain-validated From), use the
   * `#meta` slot instead.
   */
  meta?: boolean | MetaFields
}

export interface ResolvedConfig {
  contentWidth?: number
  devices: Device[]
  actions: Required<EditorActions>
  labels: Required<EditorLabels>
  templates?: TemplateDef[]
  autosaveMs: number
  variables: DesignVariable[]
  meta: Required<MetaFields>
  labeledActions: boolean
}

export function resolveConfig(c?: EditorConfig): ResolvedConfig {
  return {
    contentWidth: c?.contentWidth,
    devices: c?.devices ?? ['desktop', 'tablet', 'mobile'],
    actions: {
      undo: c?.actions?.undo ?? true,
      preview: c?.actions?.preview ?? true,
      theme: c?.actions?.theme ?? true,
      fullscreen: c?.actions?.fullscreen ?? true,
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
      fullscreen: c?.labels?.fullscreen ?? 'Fullscreen',
      templates: c?.labels?.templates ?? 'Templates',
      new: c?.labels?.new ?? 'New design',
      import: c?.labels?.import ?? 'Import design JSON',
    },
    templates: c?.templates,
    autosaveMs: c?.autosaveMs ?? 800,
    variables: c?.variables ?? [],
    meta: resolveMeta(c?.meta),
    labeledActions: c?.labeledActions ?? false,
  }
}

/** Resolve the metadata-header config to a concrete per-field flag set. */
function resolveMeta(m: EditorConfig['meta']): Required<MetaFields> {
  // Off by default — opt in with `meta: true` / a field object, or use the
  // `#meta` slot for a fully custom header.
  if (!m) return { from: false, replyTo: false, subject: false, preview: false }
  if (m === true) return { from: true, replyTo: true, subject: true, preview: true }
  return {
    from: m.from ?? true,
    replyTo: m.replyTo ?? true,
    subject: m.subject ?? true,
    preview: m.preview ?? true,
  }
}
