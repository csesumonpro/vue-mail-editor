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
