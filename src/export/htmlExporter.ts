/**
 * Design JSON → email-client-safe HTML.
 *
 * Structure: a centered container table; each Row is a table row; columns use the
 * inline-block + MSO ghost-table hybrid so they sit side by side in Outlook and
 * stack on mobile via media queries. Per-block markup comes from the block
 * registry's `toHtml`, so custom blocks export too.
 */
import type { Column, Content, Design, Row } from '@/types/schema'
import type { BlockRegistry } from '@/core/registry'
import {
  esc,
  pad,
  borderCss,
  bgColor,
  bgImageCss,
  resolveVariables,
  type ExportContext,
  type VariableMode,
} from './helpers'

function renderContent(content: Content, blocks: BlockRegistry, ctx: ExportContext): string {
  const def = blocks.get(content.type)
  return def ? def.toHtml(content.values, ctx) : ''
}

function renderColumn(
  column: Column,
  widthPx: number,
  stack: boolean,
  blocks: BlockRegistry,
  ctx: ExportContext,
): string {
  const v = column.values
  const colClass = stack ? 'col' : 'col-nostack'
  const innerBorder = borderCss(v.border)
  const inner = column.contents.map((c) => renderContent(c, blocks, ctx)).join('')
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

function renderRow(row: Row, ctx: ExportContext, blocks: BlockRegistry): string {
  const v = row.values
  const innerWidth = ctx.contentWidth - v.padding.left - v.padding.right
  const totalCells = row.cells.reduce((a, b) => a + b, 0) || 12

  const columns = row.columns
    .map((col, i) => {
      const w = Math.floor((row.cells[i] / totalCells) * innerWidth)
      return renderColumn(col, w, v.stackOnMobile, blocks, ctx)
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

export function exportHtml(
  design: Design,
  blocks: BlockRegistry,
  mode: VariableMode = 'token',
): string {
  const body = design.body
  const v = body.values
  const ctx: ExportContext = {
    contentWidth: v.contentWidth,
    linkColor: v.linkColor,
    variables: design.variables,
    variableMode: mode,
  }

  const rows = body.rows.map((r) => renderRow(r, ctx, blocks)).join('')

  // Preview text moved into design.meta.preview; fall back to the older
  // body.values.preheaderText for designs authored before that.
  const previewText = design.meta?.preview || v.preheaderText
  const preheader = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${v.contentBackground};">${esc(previewText)}</div>`
    : ''

  const container =
    `<!--[if mso]><table role="presentation" width="${v.contentWidth}" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->` +
    `<table role="presentation" class="container" width="${v.contentWidth}" align="center" cellpadding="0" cellspacing="0" style="width:${v.contentWidth}px;max-width:${v.contentWidth}px;margin:0 auto;background-color:${v.contentBackground};${bgImageCss(v.backgroundImage)}">` +
    rows +
    `</table>` +
    `<!--[if mso]></td></tr></table><![endif]-->`

  const doc = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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

  // In fallback mode, resolve any remaining raw `{{{name}}}` tokens left in plain
  // fields (preheader, button text/href, etc.) that don't pass through a block's
  // variable-aware toHtml. In token mode the document is returned untouched.
  return mode === 'fallback' ? resolveVariables(doc, design.variables, 'fallback') : doc
}
