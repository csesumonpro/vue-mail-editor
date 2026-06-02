import type { Content, ContentType, Design } from '@/types/schema'
import { SCHEMA_VERSION } from '@/types/schema'
import { createBody, createRow } from '@/config/defaults'
import { createContent } from '@/config/blockDefaults'
import { createEmptyDesign } from '@/config/seed'

/** Make a content node with overridden values. */
function block<T extends ContentType>(
  type: T,
  overrides: Partial<Content<T>['values']> = {},
): Content<T> {
  const c = createContent(type)
  Object.assign(c.values, overrides)
  return c
}

export interface TemplateDef {
  id: string
  name: string
  description: string
  /** Tailwind gradient classes for the thumbnail card. */
  accent: string
  build: () => Design
}

function welcome(): Design {
  const body = createBody()
  body.values.contentBackground = '#ffffff'
  body.values.backgroundColor = '#eef2ff'

  const hero = createRow([12])
  hero.values.padding = { top: 32, right: 24, bottom: 8, left: 24 }
  hero.columns[0].contents = [
    block('image', {
      src: 'https://placehold.co/120x120/6366f1/ffffff?text=Logo',
      autoWidth: false,
      width: 96,
      align: 'center',
    }),
    block('heading', { text: '<p>Welcome aboard! 🎉</p>', fontSize: 30 }),
    block('paragraph', {
      text: '<p>We are thrilled to have you. Here is everything you need to get started with your new account.</p>',
      align: 'center',
    }),
    block('button', { text: 'Get Started', href: '#' }),
  ]

  const div = createRow([12])
  div.columns[0].contents = [block('divider')]

  const footer = createRow([12])
  footer.values.padding = { top: 8, right: 24, bottom: 24, left: 24 }
  footer.columns[0].contents = [
    block('social', { align: 'center' }),
    block('paragraph', {
      text: '<p>You receive this email because you signed up. Unsubscribe anytime.</p>',
      align: 'center',
      fontSize: 12,
      color: '#94a3b8',
    }),
  ]

  body.rows = [hero, div, footer]
  return { schemaVersion: SCHEMA_VERSION, body }
}

function newsletter(): Design {
  const body = createBody()
  body.values.backgroundColor = '#f1f5f9'

  const header = createRow([12])
  header.values.backgroundColor = '#0f172a'
  header.values.padding = { top: 20, right: 24, bottom: 20, left: 24 }
  header.columns[0].contents = [
    block('heading', {
      text: '<p>The Weekly Digest</p>',
      color: '#ffffff',
      fontSize: 24,
    }),
  ]

  const feature = createRow([12])
  feature.columns[0].contents = [
    block('image', { src: 'https://placehold.co/600x300/38bdf8/ffffff?text=Feature' }),
    block('heading', { text: '<p>This week in review</p>', align: 'left', fontSize: 22 }),
    block('paragraph', {
      text: '<p>Catch up on the latest updates, tips, and stories from our team. Here are the highlights you do not want to miss.</p>',
    }),
    block('button', { text: 'Read more', align: 'left' }),
  ]

  const twoCol = createRow([6, 6])
  twoCol.columns[0].contents = [
    block('image', { src: 'https://placehold.co/280x160/a78bfa/ffffff?text=Story+1' }),
    block('paragraph', { text: '<p>A short story summary goes here.</p>', fontSize: 13 }),
  ]
  twoCol.columns[1].contents = [
    block('image', { src: 'https://placehold.co/280x160/f472b6/ffffff?text=Story+2' }),
    block('paragraph', { text: '<p>Another short summary right here.</p>', fontSize: 13 }),
  ]

  const footer = createRow([12])
  footer.columns[0].contents = [
    block('divider'),
    block('menu', { align: 'center' }),
  ]

  body.rows = [header, feature, twoCol, footer]
  return { schemaVersion: SCHEMA_VERSION, body }
}

function promo(): Design {
  const body = createBody()
  body.values.contentBackground = '#111827'
  body.values.backgroundColor = '#000000'
  body.values.textColor = '#ffffff'

  const hero = createRow([12])
  hero.values.padding = { top: 40, right: 24, bottom: 40, left: 24 }
  hero.columns[0].contents = [
    block('heading', {
      text: '<p>FLASH SALE</p>',
      color: '#facc15',
      fontSize: 40,
      letterSpacing: 2,
    }),
    block('heading', {
      text: '<p>Up to 50% off everything</p>',
      color: '#ffffff',
      fontSize: 24,
    }),
    block('image', { src: 'https://placehold.co/600x320/1f2937/facc15?text=Sale' }),
    block('button', {
      text: 'Shop Now',
      backgroundColor: '#facc15',
      color: '#111827',
      fontSize: 16,
    }),
    block('paragraph', {
      text: '<p>Offer ends Sunday. Terms apply.</p>',
      align: 'center',
      color: '#9ca3af',
      fontSize: 12,
    }),
  ]

  body.rows = [hero]
  return { schemaVersion: SCHEMA_VERSION, body }
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from an empty canvas.',
    accent: 'from-slate-200 to-slate-300',
    build: createEmptyDesign,
  },
  {
    id: 'welcome',
    name: 'Welcome',
    description: 'Onboarding email with logo, intro and CTA.',
    accent: 'from-indigo-400 to-violet-500',
    build: welcome,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Weekly digest with feature and two stories.',
    accent: 'from-sky-400 to-cyan-500',
    build: newsletter,
  },
  {
    id: 'promo',
    name: 'Promo',
    description: 'Bold dark-mode sale announcement.',
    accent: 'from-yellow-400 to-amber-500',
    build: promo,
  },
]
