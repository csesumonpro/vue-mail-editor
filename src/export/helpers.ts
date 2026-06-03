import type { BgImage, BorderValue, BoxValue } from '@/types/schema'

/** Context passed to every block's `toHtml`. */
export interface ExportContext {
  contentWidth: number
  linkColor: string
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
