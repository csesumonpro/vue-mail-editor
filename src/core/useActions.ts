import { inject } from 'vue'
import { ACTIONS_KEY, type EditorActionsContext } from './keys'

/** Default base64 upload used when no host `onImageUpload` is provided. */
function base64Upload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

/** Access host-delegated actions. Safe fallbacks when used standalone. */
export function useActions(): EditorActionsContext {
  return (
    inject(ACTIONS_KEY) ?? {
      uploadImage: base64Upload,
      save: () => {},
      saveTemplate: () => {},
      canSaveTemplate: false,
    }
  )
}

export { base64Upload }
