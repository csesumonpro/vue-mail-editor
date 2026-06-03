/**
 * Public entry for @csesumonpro/vue-email-editor.
 * (The public API surface grows across phases P3–P8.)
 */
import './style.css'

export { default as EmailEditor } from './EmailEditor.vue'
export { defineBlock } from './api/defineBlock'
export { vTooltip } from './directives/tooltip'

export * as styleUtils from './utils/style'

export type {
  BlockDefinition,
  InspectorGroup,
  ControlDef,
  ControlType,
  SelectOption,
  ExportContext,
  Design,
  TemplatePayload,
  StorageMode,
  EditorApi,
} from './api/types'
export type { ThemeTokens, ThemeColors, ThemeFont } from './api/theme'
export type { EditorConfig, EditorActions, TemplateDef } from './api/config'
export type { ContentType } from './types/schema'
