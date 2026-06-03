import { inject } from 'vue'
import { CONFIG_KEY } from './keys'
import { resolveConfig, type ResolvedConfig } from '@/api/config'

/** Access the resolved editor config. Falls back to defaults outside an editor. */
export function useConfig(): ResolvedConfig {
  return inject(CONFIG_KEY) ?? resolveConfig()
}
