import type { InjectionKey } from 'vue'
import type { Editor } from './createEditor'
import type { BlockRegistry } from './registry'
import type { ResolvedConfig } from '@/api/config'

/** Injection key for the per-instance editor context. */
export const EDITOR_KEY: InjectionKey<Editor> = Symbol('vue-email-editor')

/** Injection key for the per-instance block registry. */
export const BLOCKS_KEY: InjectionKey<BlockRegistry> = Symbol('vue-email-editor-blocks')

/** Injection key for the resolved editor config. */
export const CONFIG_KEY: InjectionKey<ResolvedConfig> = Symbol('vue-email-editor-config')

/** Host-delegated actions (save, image upload, …). */
export interface EditorActionsContext {
  /** Upload an image; resolves to a URL. Falls back to a base64 data URL. */
  uploadImage: (file: File) => Promise<string>
  /** Persist the current design (host hook or local download fallback). */
  save: () => void | Promise<void>
  /** Save the current design as a template (host hook). */
  saveTemplate: () => void | Promise<void>
  /** Whether a save-template handler is available (for showing its button). */
  canSaveTemplate: boolean
}

export const ACTIONS_KEY: InjectionKey<EditorActionsContext> = Symbol(
  'vue-email-editor-actions',
)
