import type { Design } from '@/types/schema'
import { SCHEMA_VERSION } from '@/types/schema'

/** Trigger a download of the design as a pretty-printed JSON file. */
export function downloadDesign(design: Design, filename = 'email-design.json') {
  const blob = new Blob([JSON.stringify(design, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Trigger a download of arbitrary text (used for HTML export). */
export function downloadText(text: string, filename: string, mime = 'text/plain') {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Parse and validate a design JSON file chosen by the user. */
export function readDesignFile(file: File): Promise<Design> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Design
        if (!data || typeof data !== 'object' || !data.body) {
          throw new Error('Not a valid design file')
        }
        if (data.schemaVersion !== SCHEMA_VERSION) {
          throw new Error(
            `Unsupported design version ${data.schemaVersion} (expected ${SCHEMA_VERSION})`,
          )
        }
        resolve(data)
      } catch (e) {
        reject(e instanceof Error ? e : new Error('Invalid JSON'))
      }
    }
    reader.readAsText(file)
  })
}
