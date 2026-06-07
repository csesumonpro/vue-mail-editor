import type { BgImage, BorderValue, DesignVariable } from '@/types/schema'
import { formatToken, tokenRe, chipRe } from '@/utils/variableToken'

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
    .replace(/'/g, '&#39;')
}

/**
 * Allow only safe URL schemes in exported `href`/`src` values. Relative and
 * anchor URLs pass through; `javascript:`, `data:text/html`, `vbscript:` etc.
 * are dropped (returns ''). Set `allowDataImage` for `<img src>` to permit
 * inline `data:image/*` (used by the base64 upload fallback).
 */
const SAFE_SCHEME = /^(https?|mailto|tel):/i
export function safeUrl(url: string | null | undefined, allowDataImage = false): string {
  const u = (url ?? '').trim()
  if (!u) return ''
  // No scheme at all → relative path / anchor / query → safe.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) return u
  if (SAFE_SCHEME.test(u)) return u
  if (allowDataImage && /^data:image\//i.test(u)) return u
  return ''
}

// `pad()` is the same box→shorthand as the canvas `padding()` — single source.
export { padding as pad } from '@/utils/style'

export function borderCss(b: BorderValue): string {
  return b.width > 0 ? `${b.width}px ${b.style} ${b.color}` : ''
}

export function bgColor(c: string | undefined): string {
  return c && c !== 'transparent' ? c : ''
}

export function bgImageCss(b: BgImage): string {
  const url = safeUrl(b.url, true)
  if (!url) return ''
  // Inside url('…') — neutralize chars that could break out of the declaration.
  const safe = url.replace(/['"()\\\n\r]/g, encodeURIComponent)
  return `background-image:url('${safe}');background-repeat:${b.repeat};background-size:${b.size};background-position:${b.position};`
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
  let out = html.replace(chipRe(), (_m, name: string) => {
    if (mode === 'token') return formatToken(name)
    const v = variables?.find((x) => x.name === name)
    return esc(v?.fallback ?? '')
  })
  // 2) Fallback mode also resolves raw typed `{{{name}}}` tokens.
  if (mode === 'fallback') {
    out = out.replace(tokenRe(), (_m, name: string) => {
      const v = variables?.find((x) => x.name === name)
      return v ? esc(v.fallback) : formatToken(name)
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
