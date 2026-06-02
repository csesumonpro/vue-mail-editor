import type { Content, ContentType } from '@/types/schema'
import { DEFAULT_FONT } from '@/config/fonts'
import { box, noBorder } from '@/config/defaults'
import { uid } from '@/utils/id'

/**
 * Default value bags for each content block. Phase 3's block registry imports
 * these so rendering, the inspector, and export all start from one source.
 */
export const blockDefaults: { [K in ContentType]: () => Content<K>['values'] } = {
  heading: () => ({
    text: 'Your headline here',
    level: 'h2',
    fontFamily: DEFAULT_FONT,
    fontSize: 26,
    fontWeight: 700,
    color: '#1f2937',
    align: 'center',
    lineHeight: 1.3,
    letterSpacing: 0,
    href: '',
    padding: box(10, 10, 10, 10),
  }),
  paragraph: () => ({
    text: 'This is a paragraph of text. Click to edit and replace it with your own content.',
    fontFamily: DEFAULT_FONT,
    fontSize: 14,
    color: '#4b5563',
    align: 'left',
    lineHeight: 1.6,
    padding: box(10, 10, 10, 10),
  }),
  button: () => ({
    text: 'Click me',
    href: '#',
    target: '_blank',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontFamily: DEFAULT_FONT,
    fontSize: 14,
    fontWeight: 600,
    border: noBorder(),
    borderRadius: 6,
    innerPadding: box(12, 24, 12, 24),
    containerPadding: box(10, 10, 10, 10),
    align: 'center',
    fullWidth: false,
  }),
  image: () => ({
    src: 'https://placehold.co/560x280/e2e8f0/64748b?text=Image',
    alt: '',
    width: 560,
    autoWidth: true,
    align: 'center',
    href: '',
    borderRadius: 0,
    padding: box(0, 0, 0, 0),
  }),
  divider: () => ({
    color: '#e5e7eb',
    thickness: 1,
    width: 100,
    style: 'solid',
    align: 'center',
    padding: box(10, 10, 10, 10),
  }),
  spacer: () => ({
    height: 24,
    mobileHeight: null,
  }),
  social: () => ({
    icons: [
      { network: 'facebook', url: 'https://facebook.com' },
      { network: 'twitter', url: 'https://twitter.com' },
      { network: 'instagram', url: 'https://instagram.com' },
    ],
    iconStyle: 'rounded',
    size: 32,
    spacing: 8,
    align: 'center',
    padding: box(10, 10, 10, 10),
  }),
  menu: () => ({
    items: [
      { text: 'Home', url: '#' },
      { text: 'About', url: '#' },
      { text: 'Contact', url: '#' },
    ],
    layout: 'horizontal',
    fontFamily: DEFAULT_FONT,
    fontSize: 14,
    color: '#1f2937',
    separator: '|',
    spacing: 16,
    align: 'center',
    padding: box(10, 10, 10, 10),
  }),
  carousel: () => ({
    slides: [
      { src: 'https://placehold.co/560x280/dbeafe/1e3a8a?text=Slide+1', alt: '', href: '' },
      { src: 'https://placehold.co/560x280/dcfce7/166534?text=Slide+2', alt: '', href: '' },
    ],
    padding: box(0, 0, 0, 0),
  }),
  html: () => ({
    html: '<p style="text-align:center;color:#64748b">Your custom HTML</p>',
  }),
}

/** Create a fresh content node of the given type with default values. */
export function createContent<T extends ContentType>(type: T): Content<T> {
  return {
    id: uid('el'),
    type,
    values: blockDefaults[type]() as Content<T>['values'],
  } as Content<T>
}
