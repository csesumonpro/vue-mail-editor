// Single source of truth for the template-variable token syntax. The delimiter
// is configurable (`config.variableSyntax`): `triple` → {{{name}}} (default,
// Mustache/Handlebars raw), `double` → {{name}}. Change a call site and every
// consumer (chip, export, autocomplete) stays in sync.

export type VariableSyntax = 'double' | 'triple'

/** Format a variable name as its merge token (`{{{name}}}` or `{{name}}`). */
export function formatToken(name: string, syntax: VariableSyntax = 'triple'): string {
  return syntax === 'double' ? `{{${name}}}` : `{{{${name}}}}`
}

/** Matches a raw token (name = word chars) for the given syntax. */
export function tokenRe(syntax: VariableSyntax = 'triple'): RegExp {
  return syntax === 'double' ? /\{\{(\w+)\}\}/g : /\{\{\{(\w+)\}\}\}/g
}

/** Matches a serialized variable chip: `<span data-variable="name">…</span>`. */
export function chipRe(): RegExp {
  return /<span[^>]*\bdata-variable="([^"]*)"[^>]*>.*?<\/span>/gi
}
