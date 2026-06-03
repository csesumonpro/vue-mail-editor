import type { InjectionKey } from 'vue'
import type { Editor } from './createEditor'

/** Injection key for the per-instance editor context. */
export const EDITOR_KEY: InjectionKey<Editor> = Symbol('vue-email-editor')
