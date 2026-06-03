import type { InjectionKey } from 'vue'
import type { Editor } from './createEditor'
import type { BlockRegistry } from './registry'

/** Injection key for the per-instance editor context. */
export const EDITOR_KEY: InjectionKey<Editor> = Symbol('vue-email-editor')

/** Injection key for the per-instance block registry. */
export const BLOCKS_KEY: InjectionKey<BlockRegistry> = Symbol('vue-email-editor-blocks')
