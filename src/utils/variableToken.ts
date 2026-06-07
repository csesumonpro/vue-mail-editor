// Single source of truth for the `{{{name}}}` template-variable token syntax.
// Change the delimiter here and every consumer (chip, export, autocomplete)
// stays in sync.

/** Format a variable name as its `{{{name}}}` merge token. */
export function formatToken(name: string): string {
  return `{{{${name}}}}`
}

/** Matches a raw `{{{name}}}` token (name = word chars). */
export function tokenRe(): RegExp {
  return /\{\{\{(\w+)\}\}\}/g
}

/** Matches a serialized variable chip: `<span data-variable="name">…</span>`. */
export function chipRe(): RegExp {
  return /<span[^>]*\bdata-variable="([^"]*)"[^>]*>.*?<\/span>/gi
}
