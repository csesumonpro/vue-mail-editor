import type { Design } from '@/types/schema'
import { SCHEMA_VERSION } from '@/types/schema'
import { createBody, createRow } from '@/config/defaults'
import { createContent } from '@/config/blockDefaults'

/** A fresh starter design with a little sample content to render. */
export function createDesign(): Design {
  const body = createBody()

  const row = createRow([12])
  row.columns[0].contents = [
    createContent('heading'),
    createContent('paragraph'),
    createContent('button'),
  ]

  body.rows = [row]
  return { schemaVersion: SCHEMA_VERSION, variables: [], body }
}

/** A completely empty design: body with one empty 1-column row. */
export function createEmptyDesign(): Design {
  const body = createBody()
  body.rows = [createRow([12])]
  return { schemaVersion: SCHEMA_VERSION, variables: [], body }
}
