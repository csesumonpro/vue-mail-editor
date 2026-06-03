/**
 * Design JSON → email-client-safe HTML.
 *
 * Strategy: a centered container table; each Row is a table row; columns use the
 * inline-block + MSO ghost-table hybrid so they sit side by side in Outlook and
 * stack on mobile via media queries. All styles are inlined; a small <style>
 * head block carries the responsive rules Outlook ignores anyway.
 */
import type {
  BgImage,
  BorderValue,
  BoxValue,
  ButtonValues,
  Column,
  Content,
  DividerValues,
  Design,
  HeadingValues,
  HtmlValues,
  ImageValues,
  MenuValues,
  ParagraphValues,
  Row,
  SocialValues,
  SpacerValues,
} from '@/types/schema'
import { resolveSocial } from '@/config/social'

interface Ctx {
  contentWidth: number
  linkColor: string
}

/* ---------------------------- helpers ----------------------------- */

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function pad(b: BoxValue): string {
  return `${b.top}px ${b.right}px ${b.bottom}px ${b.left}px`
}

function borderCss(b: BorderValue): string {
  return b.width > 0 ? `${b.width}px ${b.style} ${b.color}` : ''
}

function bgColor(c: string | undefined): string {
  return c && c !== 'transparent' ? c : ''
}

function bgImageCss(b: BgImage): string {
  if (!b.url) return ''
  return `background-image:url('${b.url}');background-repeat:${b.repeat};background-size:${b.size};background-position:${b.position};`
}

/** Strip Tiptap block wrappers so heading text stays inline. */
function inlineText(html: string): string {
  return html
    .replace(/<\/p>\s*<p[^>]*>/gi, '<br>')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<\/?div[^>]*>/gi, '')
}

/* ------------------------- block renderers ------------------------ */

function renderHeading(v: HeadingValues): string {
  const inner = inlineText(v.text)
  const text = v.href
    ? `<a href="${esc(v.href)}" style="color:inherit;text-decoration:none;">${inner}</a>`
    : inner
  return cell(
    v.align,
    pad(v.padding),
    `<${v.level} style="margin:0;font-family:${v.fontFamily.value};font-size:${v.fontSize}px;font-weight:${v.fontWeight};color:${v.color};line-height:${v.lineHeight};letter-spacing:${v.letterSpacing}px;">${text}</${v.level}>`,
  )
}

function renderParagraph(v: ParagraphValues): string {
  return cell(
    v.align,
    pad(v.padding),
    `<div style="font-family:${v.fontFamily.value};font-size:${v.fontSize}px;color:${v.color};line-height:${v.lineHeight};">${v.text}</div>`,
  )
}

function renderButton(v: ButtonValues): string {
  const b = borderCss(v.border)
  const a = `<a href="${esc(v.href)}" target="${v.target}" style="display:inline-block;background:${v.backgroundColor};color:${v.color};font-family:${v.fontFamily.value};font-size:${v.fontSize}px;font-weight:${v.fontWeight};text-decoration:none;border-radius:${v.borderRadius}px;${b ? `border:${b};` : ''}padding:${pad(v.innerPadding)};mso-padding-alt:0;${v.fullWidth ? 'width:100%;text-align:center;box-sizing:border-box;' : ''}">${esc(v.text)}</a>`
  return cell(v.align, pad(v.containerPadding), a)
}

function renderImage(v: ImageValues): string {
  const img = `<img src="${esc(v.src)}" alt="${esc(v.alt)}" width="${v.autoWidth ? '' : v.width}" style="display:block;border:0;outline:none;text-decoration:none;max-width:100%;width:${v.autoWidth ? '100%' : v.width + 'px'};height:auto;border-radius:${v.borderRadius}px;" />`
  const wrapped = v.href ? `<a href="${esc(v.href)}">${img}</a>` : img
  // Center via align on the cell; inline-block to honor alignment.
  return cell(
    v.align,
    pad(v.padding),
    `<span style="display:inline-block;max-width:100%;">${wrapped}</span>`,
  )
}

function renderDivider(v: DividerValues): string {
  const line = `<table role="presentation" width="${v.width}%" cellpadding="0" cellspacing="0" style="width:${v.width}%;"><tr><td style="border-top:${v.thickness}px ${v.style} ${v.color};font-size:0;line-height:0;">&nbsp;</td></tr></table>`
  return cell(v.align, pad(v.padding), line)
}

function renderSpacer(v: SpacerValues): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:${v.height}px;line-height:${v.height}px;font-size:0;">&nbsp;</td></tr></table>`
}

function renderSocial(v: SocialValues): string {
  const radius = v.iconStyle === 'rounded' ? '50%' : '6px'
  const glyph = Math.round(v.size * 0.55)
  const icons = v.icons
    .map((item) => {
      const s = resolveSocial(item)
      const inner = s.image
        ? `<img src="${esc(s.image)}" alt="${esc(s.label)}" width="${s.isCustom ? v.size : glyph}" height="${s.isCustom ? v.size : glyph}" style="display:block;border:0;${s.isCustom ? '' : `width:${glyph}px;height:${glyph}px;`}" />`
        : `<span style="color:#fff;font-family:Arial,sans-serif;font-size:${Math.round(v.size * 0.4)}px;line-height:${v.size}px;">${(item.network[0] || '?').toUpperCase()}</span>`
      return `<a href="${esc(item.url)}" style="display:inline-block;width:${v.size}px;height:${v.size}px;background:${s.color};border-radius:${radius};text-align:center;text-decoration:none;vertical-align:middle;margin:0 ${Math.round(v.spacing / 2)}px;"><table role="presentation" width="${v.size}" height="${v.size}" cellpadding="0" cellspacing="0" style="width:${v.size}px;height:${v.size}px;"><tr><td align="center" valign="middle">${inner}</td></tr></table></a>`
    })
    .join('')
  return cell(v.align, pad(v.padding), icons)
}

function renderMenu(v: MenuValues): string {
  if (v.layout === 'vertical') {
    const items = v.items
      .map(
        (it) =>
          `<div style="padding:${Math.round(v.spacing / 2)}px 0;"><a href="${esc(it.url)}" style="color:${v.color};text-decoration:none;font-family:${v.fontFamily.value};font-size:${v.fontSize}px;">${esc(it.text)}</a></div>`,
      )
      .join('')
    return cell(v.align, pad(v.padding), items)
  }
  const items = v.items
    .map(
      (it, i) =>
        `<a href="${esc(it.url)}" style="color:${v.color};text-decoration:none;font-family:${v.fontFamily.value};font-size:${v.fontSize}px;padding:0 ${Math.round(v.spacing / 2)}px;">${esc(it.text)}</a>${i < v.items.length - 1 && v.separator ? `<span style="color:${v.color};opacity:0.5;">${esc(v.separator)}</span>` : ''}`,
    )
    .join('')
  return cell(
    v.align,
    pad(v.padding),
    `<div style="font-family:${v.fontFamily.value};font-size:${v.fontSize}px;">${items}</div>`,
  )
}

function renderHtml(v: HtmlValues): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td>${v.html}</td></tr></table>`
}

/** Standard single-cell wrapper used by most blocks. */
function cell(align: string, padding: string, inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="${align}" style="padding:${padding};">${inner}</td></tr></table>`
}

function renderContent(content: Content): string {
  switch (content.type) {
    case 'heading':
      return renderHeading(content.values as HeadingValues)
    case 'paragraph':
      return renderParagraph(content.values as ParagraphValues)
    case 'button':
      return renderButton(content.values as ButtonValues)
    case 'image':
      return renderImage(content.values as ImageValues)
    case 'divider':
      return renderDivider(content.values as DividerValues)
    case 'spacer':
      return renderSpacer(content.values as SpacerValues)
    case 'social':
      return renderSocial(content.values as SocialValues)
    case 'menu':
      return renderMenu(content.values as MenuValues)
    case 'html':
      return renderHtml(content.values as HtmlValues)
    default:
      return ''
  }
}

/* ------------------------ structure renderers --------------------- */

function renderColumn(column: Column, widthPx: number, stack: boolean): string {
  const v = column.values
  const colClass = stack ? 'col' : 'col-nostack'
  const innerBorder = borderCss(v.border)
  const inner = column.contents.map(renderContent).join('')
  const tableStyle = [
    bgColor(v.backgroundColor) ? `background:${bgColor(v.backgroundColor)};` : '',
    innerBorder ? `border:${innerBorder};` : '',
    v.borderRadius ? `border-radius:${v.borderRadius}px;` : '',
  ].join('')

  return (
    `<!--[if mso]><td width="${widthPx}" valign="${v.verticalAlign}"><![endif]-->` +
    `<div class="${colClass}" style="display:inline-block;vertical-align:${v.verticalAlign};width:100%;max-width:${widthPx}px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${tableStyle}"><tr><td valign="${v.verticalAlign}" style="padding:${pad(v.padding)};">${inner}</td></tr></table>` +
    `</div>` +
    `<!--[if mso]></td><![endif]-->`
  )
}

function renderRow(row: Row, ctx: Ctx): string {
  const v = row.values
  const innerWidth = ctx.contentWidth - v.padding.left - v.padding.right
  const totalCells = row.cells.reduce((a, b) => a + b, 0) || 12

  const columns = row.columns
    .map((col, i) => {
      const w = Math.floor((row.cells[i] / totalCells) * innerWidth)
      return renderColumn(col, w, v.stackOnMobile)
    })
    .join('')

  const colsWrap =
    `<div style="font-size:0;text-align:center;">` +
    `<!--[if mso]><table role="presentation" width="${innerWidth}" cellpadding="0" cellspacing="0"><tr><![endif]-->` +
    columns +
    `<!--[if mso]></tr></table><![endif]-->` +
    `</div>`

  const tdStyle = [
    bgColor(v.backgroundColor) ? `background-color:${bgColor(v.backgroundColor)};` : '',
    bgImageCss(v.backgroundImage),
    `padding:${pad(v.padding)};`,
    borderCss(v.border) ? `border:${borderCss(v.border)};` : '',
    v.borderRadius ? `border-radius:${v.borderRadius}px;` : '',
  ].join('')

  const cls = [
    v.hideOn.mobile ? 'hide-mobile' : '',
    v.hideOn.desktop ? 'hide-desktop' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return `<tr><td class="${cls}" style="${tdStyle}">${colsWrap}</td></tr>`
}

/* ----------------------------- document --------------------------- */

export function exportHtml(design: Design): string {
  const body = design.body
  const v = body.values
  const ctx: Ctx = { contentWidth: v.contentWidth, linkColor: v.linkColor }

  const rows = body.rows.map((r) => renderRow(r, ctx)).join('')

  const preheader = v.preheaderText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${v.contentBackground};">${esc(v.preheaderText)}</div>`
    : ''

  const container =
    `<!--[if mso]><table role="presentation" width="${v.contentWidth}" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->` +
    `<table role="presentation" class="container" width="${v.contentWidth}" align="center" cellpadding="0" cellspacing="0" style="width:${v.contentWidth}px;max-width:${v.contentWidth}px;margin:0 auto;background-color:${v.contentBackground};${bgImageCss(v.backgroundImage)}">` +
    rows +
    `</table>` +
    `<!--[if mso]></td></tr></table><![endif]-->`

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${v.language}" dir="${v.direction}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<title></title>
<!--[if mso]>
<style>table,td,div,p,a{font-family:Arial,sans-serif;}</style>
<![endif]-->
<style>
  html,body{margin:0 auto !important;padding:0 !important;}
  *{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;}
  img{-ms-interpolation-mode:bicubic;}
  a{color:${v.linkColor};}
  @media only screen and (max-width:600px){
    .container{width:100% !important;max-width:100% !important;}
    .col{display:block !important;width:100% !important;max-width:100% !important;}
    .hide-mobile{display:none !important;max-height:0 !important;overflow:hidden !important;}
    img{height:auto !important;}
  }
  @media only screen and (min-width:601px){
    .hide-desktop{display:none !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${v.backgroundColor};">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${v.backgroundColor};">
<tr><td align="center" style="padding:${pad(v.padding)};">
${container}
</td></tr>
</table>
</body>
</html>`
}
