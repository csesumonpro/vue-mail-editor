import type { BgImage, BorderValue, BoxValue, DesignVariable } from '@/types/schema'

/** How template variables are emitted on export. */
export type VariableMode = 'token' | 'fallback'

/** Context passed to every block's `toHtml`. */
export interface ExportContext {
  contentWidth: number
  linkColor: string
  /** Template variable registry (for resolving `{{{name}}}` tokens). */
  variables?: DesignVariable[]
  /** `token` keeps `{{{name}}}`; `fallback` substitutes the fallback value. */
  variableMode?: VariableMode
}

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function pad(b: BoxValue): string {
  return `${b.top}px ${b.right}px ${b.bottom}px ${b.left}px`
}

export function borderCss(b: BorderValue): string {
  return b.width > 0 ? `${b.width}px ${b.style} ${b.color}` : ''
}

export function bgColor(c: string | undefined): string {
  return c && c !== 'transparent' ? c : ''
}

export function bgImageCss(b: BgImage): string {
  if (!b.url) return ''
  return `background-image:url('${b.url}');background-repeat:${b.repeat};background-size:${b.size};background-position:${b.position};`
}

/**
 * Resolve variable chips/tokens in exported HTML.
 *
 * Chips are serialized by the editor as `<span data-variable="name">{{{name}}}</span>`.
 * In `token` mode they become bare `{{{name}}}` tokens (a server-side merge engine
 * replaces them at send time). In `fallback` mode they — and any raw typed
 * `{{{name}}}` tokens — are replaced with the variable's fallback value, producing
 * static HTML. `esc()` does not escape braces, so tokens survive HTML escaping.
 */
export function resolveVariables(
  html: string,
  variables: DesignVariable[] | undefined,
  mode: VariableMode = 'token',
): string {
  // 1) Chip spans → token or fallback. Atoms never nest, so non-greedy is safe.
  let out = html.replace(
    /<span[^>]*\bdata-variable="([^"]*)"[^>]*>.*?<\/span>/gi,
    (_m, name: string) => {
      if (mode === 'token') return `{{{${name}}}}`
      const v = variables?.find((x) => x.name === name)
      return esc(v?.fallback ?? '')
    },
  )
  // 2) Fallback mode also resolves raw typed `{{{name}}}` tokens.
  if (mode === 'fallback') {
    out = out.replace(/\{\{\{(\w+)\}\}\}/g, (_m, name: string) => {
      const v = variables?.find((x) => x.name === name)
      return v ? esc(v.fallback) : `{{{${name}}}}`
    })
  }
  return out
}

/** Strip Tiptap block wrappers so heading text stays inline. */
export function inlineText(html: string): string {
  return html
    .replace(/<\/p>\s*<p[^>]*>/gi, '<br>')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<\/?div[^>]*>/gi, '')
}

/** Standard single-cell wrapper used by most blocks. */
export function cell(align: string, padding: string, inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="${align}" style="padding:${padding};">${inner}</td></tr></table>`
}
