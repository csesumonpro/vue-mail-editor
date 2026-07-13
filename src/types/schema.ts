/**
 * Email design schema.
 *
 * The whole email is one serializable JSON tree:
 *   Design → Body → Row[] → Column[] → Content[]
 *
 * `values` bags hold every inspector-editable property. They are intentionally
 * loose (per-block shapes) but the shared value primitives below are typed so
 * controls and the export engine can rely on them.
 */

export const SCHEMA_VERSION = 1

/* ------------------------------------------------------------------ */
/* Shared value primitives                                            */
/* ------------------------------------------------------------------ */

export interface BoxValue {
  top: number
  right: number
  bottom: number
  left: number
}

export interface BorderValue {
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  color: string
}

export interface BgImage {
  url: string
  repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  size: 'auto' | 'cover' | 'contain'
  position: string
}

export interface FontValue {
  label: string
  /** CSS font stack, e.g. `Arial, Helvetica, sans-serif` */
  value: string
}

export type TextAlign = 'left' | 'center' | 'right'
export type VerticalAlign = 'top' | 'middle' | 'bottom'

/* ------------------------------------------------------------------ */
/* Content blocks                                                     */
/* ------------------------------------------------------------------ */

export type ContentType =
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'divider'
  | 'spacer'
  | 'social'
  | 'menu'
  | 'html'

export interface HeadingValues {
  text: string
  level: 'h1' | 'h2' | 'h3' | 'h4'
  fontFamily: FontValue
  fontSize: number
  fontWeight: number
  color: string
  align: TextAlign
  lineHeight: number
  letterSpacing: number
  href: string
  padding: BoxValue
}

export interface ParagraphValues {
  text: string
  fontFamily: FontValue
  fontSize: number
  color: string
  align: TextAlign
  lineHeight: number
  padding: BoxValue
}

export interface ButtonValues {
  text: string
  href: string
  target: '_blank' | '_self'
  backgroundColor: string
  color: string
  fontFamily: FontValue
  fontSize: number
  fontWeight: number
  border: BorderValue
  borderRadius: number
  innerPadding: BoxValue
  containerPadding: BoxValue
  align: TextAlign
  fullWidth: boolean
}

export interface ImageValues {
  src: string
  alt: string
  width: number
  autoWidth: boolean
  height: number
  autoHeight: boolean
  align: TextAlign
  href: string
  borderRadius: number
  padding: BoxValue
}

export interface DividerValues {
  color: string
  thickness: number
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  align: TextAlign
  padding: BoxValue
}

export interface SpacerValues {
  height: number
  mobileHeight: number | null
}

export interface SocialIcon {
  network: string
  url: string
  /** Optional custom icon image URL (overrides the predefined network icon). */
  icon?: string
}

export interface SocialValues {
  icons: SocialIcon[]
  iconStyle: 'color' | 'outline' | 'rounded'
  size: number
  spacing: number
  align: TextAlign
  padding: BoxValue
}

export interface MenuItem {
  text: string
  url: string
}

export interface MenuValues {
  items: MenuItem[]
  layout: 'horizontal' | 'vertical'
  fontFamily: FontValue
  fontSize: number
  color: string
  separator: string
  spacing: number
  align: TextAlign
  padding: BoxValue
}

export interface HtmlValues {
  html: string
}

/** Map of content type → its value bag, for typed helpers. */
export interface ContentValueMap {
  heading: HeadingValues
  paragraph: ParagraphValues
  button: ButtonValues
  image: ImageValues
  divider: DividerValues
  spacer: SpacerValues
  social: SocialValues
  menu: MenuValues
  html: HtmlValues
}

export interface Content<T extends ContentType = ContentType> {
  id: string
  type: T
  values: ContentValueMap[T]
}

/* ------------------------------------------------------------------ */
/* Structure: Column → Row → Body                                    */
/* ------------------------------------------------------------------ */

export interface ColumnValues {
  backgroundColor: string
  padding: BoxValue
  border: BorderValue
  borderRadius: number
  verticalAlign: VerticalAlign
}

export interface Column {
  id: string
  contents: Content[]
  values: ColumnValues
}

export interface RowValues {
  backgroundColor: string
  columnsBackground: string
  backgroundImage: BgImage
  fullWidth: boolean
  padding: BoxValue
  border: BorderValue
  borderRadius: number
  verticalAlign: VerticalAlign
  hideOn: { desktop: boolean; mobile: boolean }
  stackOnMobile: boolean
}

export interface Row {
  id: string
  /** 12-grid distribution, e.g. [12] | [6,6] | [4,4,4] */
  cells: number[]
  columns: Column[]
  values: RowValues
}

export interface BodyValues {
  contentWidth: number
  backgroundColor: string
  contentBackground: string
  backgroundImage: BgImage
  fontFamily: FontValue
  textColor: string
  linkColor: string
  preheaderText: string
  direction: 'ltr' | 'rtl'
  language: string
  padding: BoxValue
}

export interface Body {
  id: string
  values: BodyValues
  rows: Row[]
}

/** A template-level merge variable, reusable across the whole design. */
export interface DesignVariable {
  name: string
  type: 'string' | 'number'
  fallback: string
}

/**
 * Email sending metadata (subject, sender, reply-to). Not part of the rendered
 * HTML — your app reads it from the design for sending. The "preview text"
 * (preheader) lives in `body.values.preheaderText` since it IS in the export.
 */
export interface DesignMeta {
  subject?: string
  from?: string
  replyTo?: string
  /** Inbox preview text (the email's hidden preheader). */
  preview?: string
  /** Custom fields (e.g. a campaign id) set via the `#meta` slot — they
   *  round-trip in the design and are readable server-side. */
  [key: string]: string | undefined
}

export interface Design {
  schemaVersion: number
  /** Template merge variables (optional — old designs parse without it). */
  variables?: DesignVariable[]
  /** Sending metadata (subject/from/reply-to), optional. */
  meta?: DesignMeta
  body: Body
}

/* ------------------------------------------------------------------ */
/* Selection                                                          */
/* ------------------------------------------------------------------ */

export type SelectionKind = 'body' | 'row' | 'column' | 'content' | null

export interface Selection {
  kind: SelectionKind
  id: string | null
}

export type Device = 'desktop' | 'tablet' | 'mobile'
