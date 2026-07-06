/**
 * Public entry for vue-mail-editor.
 * (The public API surface grows across phases P3–P8.)
 */
import './style.css'

export { default as EmailEditor } from './EmailEditor.vue'
export { default as TextEditor } from './components/common/TextEditor.vue'
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
  VariableMode,
  Design,
  DesignVariable,
  DesignMeta,
  TemplatePayload,
  StorageMode,
  EditorApi,
} from './api/types'
export type { ThemeTokens, ThemeColors, ThemeFont } from './api/theme'
export type { RteToolbarItem } from './api/toolbar'
export type {
  EditorConfig,
  EditorActions,
  EditorLabels,
  MetaFields,
  TemplateDef,
  VariableSyntax,
} from './api/config'
export type { ContentType } from './types/schema'
