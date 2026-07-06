import type {
  ButtonValues,
  DividerValues,
  HeadingValues,
  HtmlValues,
  ImageValues,
  MenuValues,
  ParagraphValues,
  SocialValues,
  SpacerValues,
} from '@/types/schema'
import type { ExportContext } from '@/export/helpers'
import { esc, pad, borderCss, cell, inlineText, resolveVariables, safeUrl } from '@/export/helpers'
import { resolveSocial } from '@/config/social'

export function headingToHtml(v: HeadingValues, ctx: ExportContext): string {
  const inner = inlineText(resolveVariables(v.text, ctx.variables, ctx.variableMode, ctx.variableSyntax))
  const text = v.href
    ? `<a href="${esc(safeUrl(v.href))}" style="color:inherit;text-decoration:none;">${inner}</a>`
    : inner
  return cell(
    v.align,
    pad(v.padding),
    `<${v.level} style="margin:0;font-family:${v.fontFamily.value};font-size:${v.fontSize}px;font-weight:${v.fontWeight};color:${v.color};line-height:${v.lineHeight};letter-spacing:${v.letterSpacing}px;">${text}</${v.level}>`,
  )
}

export function paragraphToHtml(v: ParagraphValues, ctx: ExportContext): string {
  return cell(
    v.align,
    pad(v.padding),
    `<div style="font-family:${v.fontFamily.value};font-size:${v.fontSize}px;color:${v.color};line-height:${v.lineHeight};">${resolveVariables(v.text, ctx.variables, ctx.variableMode, ctx.variableSyntax)}</div>`,
  )
}

export function buttonToHtml(v: ButtonValues, ctx: ExportContext): string {
  const b = borderCss(v.border)
  const label = inlineText(resolveVariables(v.text, ctx.variables, ctx.variableMode, ctx.variableSyntax))
  const a = `<a href="${esc(safeUrl(v.href))}" target="${v.target}" style="display:inline-block;background:${v.backgroundColor};color:${v.color};font-family:${v.fontFamily.value};font-size:${v.fontSize}px;font-weight:${v.fontWeight};text-decoration:none;border-radius:${v.borderRadius}px;${b ? `border:${b};` : ''}padding:${pad(v.innerPadding)};mso-padding-alt:0;${v.fullWidth ? 'width:100%;text-align:center;box-sizing:border-box;' : ''}">${label}</a>`
  return cell(v.align, pad(v.containerPadding), a)
}

export function imageToHtml(v: ImageValues): string {
  const img = `<img src="${esc(safeUrl(v.src, true))}" alt="${esc(v.alt)}" width="${v.autoWidth ? '' : v.width}" style="display:block;border:0;outline:none;text-decoration:none;max-width:100%;width:${v.autoWidth ? '100%' : v.width + 'px'};height:auto;border-radius:${v.borderRadius}px;" />`
  const wrapped = v.href ? `<a href="${esc(safeUrl(v.href))}">${img}</a>` : img
  return cell(
    v.align,
    pad(v.padding),
    `<span style="display:inline-block;max-width:100%;">${wrapped}</span>`,
  )
}

export function dividerToHtml(v: DividerValues): string {
  const line = `<table role="presentation" width="${v.width}%" cellpadding="0" cellspacing="0" style="width:${v.width}%;"><tr><td style="border-top:${v.thickness}px ${v.style} ${v.color};font-size:0;line-height:0;">&nbsp;</td></tr></table>`
  return cell(v.align, pad(v.padding), line)
}

export function spacerToHtml(v: SpacerValues): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:${v.height}px;line-height:${v.height}px;font-size:0;">&nbsp;</td></tr></table>`
}

export function socialToHtml(v: SocialValues): string {
  const radius = v.iconStyle === 'rounded' ? '50%' : '6px'
  const glyph = Math.round(v.size * 0.55)
  const icons = v.icons
    .map((item) => {
      const s = resolveSocial(item)
      const inner = s.image
        ? `<img src="${esc(safeUrl(s.image, true))}" alt="${esc(s.label)}" width="${s.isCustom ? v.size : glyph}" height="${s.isCustom ? v.size : glyph}" style="display:block;border:0;${s.isCustom ? '' : `width:${glyph}px;height:${glyph}px;`}" />`
        : `<span style="color:#fff;font-family:Arial,sans-serif;font-size:${Math.round(v.size * 0.4)}px;line-height:${v.size}px;">${(item.network[0] || '?').toUpperCase()}</span>`
      return `<a href="${esc(safeUrl(item.url))}" style="display:inline-block;width:${v.size}px;height:${v.size}px;background:${s.color};border-radius:${radius};text-align:center;text-decoration:none;vertical-align:middle;margin:0 ${Math.round(v.spacing / 2)}px;"><table role="presentation" width="${v.size}" height="${v.size}" cellpadding="0" cellspacing="0" style="width:${v.size}px;height:${v.size}px;"><tr><td align="center" valign="middle">${inner}</td></tr></table></a>`
    })
    .join('')
  return cell(v.align, pad(v.padding), icons)
}

export function menuToHtml(v: MenuValues): string {
  if (v.layout === 'vertical') {
    const items = v.items
      .map(
        (it) =>
          `<div style="padding:${Math.round(v.spacing / 2)}px 0;"><a href="${esc(safeUrl(it.url))}" style="color:${v.color};text-decoration:none;font-family:${v.fontFamily.value};font-size:${v.fontSize}px;">${esc(it.text)}</a></div>`,
      )
      .join('')
    return cell(v.align, pad(v.padding), items)
  }
  const items = v.items
    .map(
      (it, i) =>
        `<a href="${esc(safeUrl(it.url))}" style="color:${v.color};text-decoration:none;font-family:${v.fontFamily.value};font-size:${v.fontSize}px;padding:0 ${Math.round(v.spacing / 2)}px;">${esc(it.text)}</a>${i < v.items.length - 1 && v.separator ? `<span style="color:${v.color};opacity:0.5;">${esc(v.separator)}</span>` : ''}`,
    )
    .join('')
  return cell(
    v.align,
    pad(v.padding),
    `<div style="font-family:${v.fontFamily.value};font-size:${v.fontSize}px;">${items}</div>`,
  )
}

export function htmlToHtml(v: HtmlValues): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td>${v.html}</td></tr></table>`
}
