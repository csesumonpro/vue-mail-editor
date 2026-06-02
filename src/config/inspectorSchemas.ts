import {
  Settings,
  Palette,
  Move,
  SquareDashed,
  Image as ImageIcon,
  Type,
  Smartphone,
} from 'lucide-vue-next'
import type { ContentType } from '@/types/schema'
import type { AccordionGroup, InspectorSchema, SelectOption } from '@/config/inspector'
import { FONT_WEIGHTS } from '@/config/fonts'

const weightOptions: SelectOption[] = FONT_WEIGHTS.map((w) => ({
  label: w.label,
  value: w.value,
}))
const levelOptions: SelectOption[] = [
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
]
const targetOptions: SelectOption[] = [
  { label: 'New tab', value: '_blank' },
  { label: 'Same tab', value: '_self' },
]
const lineStyleOptions: SelectOption[] = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
]
const vAlignOptions: SelectOption[] = [
  { label: 'Top', value: 'top' },
  { label: 'Middle', value: 'middle' },
  { label: 'Bottom', value: 'bottom' },
]

/* ------------------------------------------------------------------ */
/* Structure inspectors                                               */
/* ------------------------------------------------------------------ */

export const bodyInspector: InspectorSchema = [
  {
    title: 'General',
    icon: Settings,
    controls: [
      { type: 'number', key: 'contentWidth', label: 'Content width', unit: 'px', min: 320, max: 900 },
      { type: 'font', key: 'fontFamily', label: 'Font' },
      { type: 'color', key: 'textColor', label: 'Text color' },
      { type: 'text', key: 'preheaderText', label: 'Preheader', placeholder: 'Inbox preview text' },
      {
        type: 'select',
        key: 'direction',
        label: 'Direction',
        options: [
          { label: 'LTR', value: 'ltr' },
          { label: 'RTL', value: 'rtl' },
        ],
      },
    ],
  },
  {
    title: 'Background',
    icon: Palette,
    controls: [
      { type: 'color', key: 'backgroundColor', label: 'Page color' },
      { type: 'color', key: 'contentBackground', label: 'Email color' },
      { type: 'background', key: 'backgroundImage', label: 'Background image' },
    ],
  },
  {
    title: 'Links',
    icon: Type,
    controls: [{ type: 'color', key: 'linkColor', label: 'Link color' }],
  },
  {
    title: 'Spacing',
    icon: Move,
    controls: [{ type: 'spacing', key: 'padding', label: 'Padding' }],
  },
]

export const rowInspector: InspectorSchema = [
  {
    title: 'Background',
    icon: Palette,
    controls: [
      { type: 'color', key: 'backgroundColor', label: 'Row color' },
      { type: 'color', key: 'columnsBackground', label: 'Columns color' },
      { type: 'background', key: 'backgroundImage', label: 'Background image' },
    ],
  },
  {
    title: 'Layout',
    icon: Move,
    controls: [
      { type: 'spacing', key: 'padding', label: 'Padding' },
      { type: 'select', key: 'verticalAlign', label: 'Align', options: vAlignOptions },
      { type: 'toggle', key: 'fullWidth', label: 'Full width' },
    ],
  },
  {
    title: 'Border',
    icon: SquareDashed,
    controls: [
      { type: 'border', key: 'border', label: 'Border' },
      { type: 'number', key: 'borderRadius', label: 'Radius', unit: 'px', min: 0 },
    ],
  },
  {
    title: 'Responsive',
    icon: Smartphone,
    controls: [
      { type: 'toggle', key: 'stackOnMobile', label: 'Stack on mobile' },
      { type: 'toggle', key: 'hideOn.mobile', label: 'Hide on mobile' },
      { type: 'toggle', key: 'hideOn.desktop', label: 'Hide on desktop' },
    ],
  },
]

export const columnInspector: InspectorSchema = [
  {
    title: 'Background',
    icon: Palette,
    controls: [{ type: 'color', key: 'backgroundColor', label: 'Color' }],
  },
  {
    title: 'Layout',
    icon: Move,
    controls: [
      { type: 'spacing', key: 'padding', label: 'Padding' },
      { type: 'select', key: 'verticalAlign', label: 'Align', options: vAlignOptions },
    ],
  },
  {
    title: 'Border',
    icon: SquareDashed,
    controls: [
      { type: 'border', key: 'border', label: 'Border' },
      { type: 'number', key: 'borderRadius', label: 'Radius', unit: 'px', min: 0 },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Block inspectors                                                   */
/* ------------------------------------------------------------------ */

const spacingGroup = (key = 'padding'): AccordionGroup => ({
  title: 'Spacing',
  icon: Move,
  controls: [{ type: 'spacing', key, label: 'Padding' }],
})

export const blockInspectors: Record<ContentType, InspectorSchema> = {
  heading: [
    {
      title: 'Content',
      icon: Type,
      controls: [
        { type: 'textarea', key: 'text', label: 'Text' },
        { type: 'select', key: 'level', label: 'Tag', options: levelOptions },
        { type: 'link', key: 'href', label: 'Link' },
      ],
    },
    {
      title: 'Style',
      icon: Palette,
      controls: [
        { type: 'font', key: 'fontFamily', label: 'Font' },
        { type: 'number', key: 'fontSize', label: 'Size', unit: 'px', min: 8, max: 80 },
        { type: 'select', key: 'fontWeight', label: 'Weight', options: weightOptions },
        { type: 'color', key: 'color', label: 'Color' },
        { type: 'align', key: 'align', label: 'Align' },
        { type: 'number', key: 'lineHeight', label: 'Line height', step: 0.1, min: 0.8, max: 3 },
        { type: 'number', key: 'letterSpacing', label: 'Letter spacing', unit: 'px' },
      ],
    },
    spacingGroup(),
  ],
  paragraph: [
    {
      title: 'Content',
      icon: Type,
      controls: [{ type: 'textarea', key: 'text', label: 'Text' }],
    },
    {
      title: 'Style',
      icon: Palette,
      controls: [
        { type: 'font', key: 'fontFamily', label: 'Font' },
        { type: 'number', key: 'fontSize', label: 'Size', unit: 'px', min: 8, max: 48 },
        { type: 'color', key: 'color', label: 'Color' },
        { type: 'align', key: 'align', label: 'Align' },
        { type: 'number', key: 'lineHeight', label: 'Line height', step: 0.1, min: 0.8, max: 3 },
      ],
    },
    spacingGroup(),
  ],
  button: [
    {
      title: 'Content',
      icon: Type,
      controls: [
        { type: 'text', key: 'text', label: 'Label' },
        { type: 'link', key: 'href', label: 'Link' },
        { type: 'select', key: 'target', label: 'Target', options: targetOptions },
      ],
    },
    {
      title: 'Style',
      icon: Palette,
      controls: [
        { type: 'color', key: 'backgroundColor', label: 'Background' },
        { type: 'color', key: 'color', label: 'Text color' },
        { type: 'font', key: 'fontFamily', label: 'Font' },
        { type: 'number', key: 'fontSize', label: 'Size', unit: 'px', min: 8, max: 32 },
        { type: 'select', key: 'fontWeight', label: 'Weight', options: weightOptions },
        { type: 'number', key: 'borderRadius', label: 'Radius', unit: 'px', min: 0 },
        { type: 'border', key: 'border', label: 'Border' },
        { type: 'align', key: 'align', label: 'Align' },
        { type: 'toggle', key: 'fullWidth', label: 'Full width' },
      ],
    },
    {
      title: 'Spacing',
      icon: Move,
      controls: [
        { type: 'spacing', key: 'innerPadding', label: 'Inner padding' },
        { type: 'spacing', key: 'containerPadding', label: 'Container padding' },
      ],
    },
  ],
  image: [
    {
      title: 'Content',
      icon: ImageIcon,
      controls: [
        { type: 'image', key: 'src', label: 'Image' },
        { type: 'text', key: 'alt', label: 'Alt text' },
        { type: 'link', key: 'href', label: 'Link' },
      ],
    },
    {
      title: 'Style',
      icon: Palette,
      controls: [
        { type: 'toggle', key: 'autoWidth', label: 'Full width' },
        { type: 'number', key: 'width', label: 'Width', unit: 'px', min: 20 },
        { type: 'align', key: 'align', label: 'Align' },
        { type: 'number', key: 'borderRadius', label: 'Radius', unit: 'px', min: 0 },
      ],
    },
    spacingGroup(),
  ],
  divider: [
    {
      title: 'Style',
      icon: Palette,
      controls: [
        { type: 'color', key: 'color', label: 'Color' },
        { type: 'number', key: 'thickness', label: 'Thickness', unit: 'px', min: 1, max: 20 },
        { type: 'slider', key: 'width', label: 'Width', unit: '%', min: 10, max: 100 },
        { type: 'select', key: 'style', label: 'Style', options: lineStyleOptions },
        { type: 'align', key: 'align', label: 'Align' },
      ],
    },
    spacingGroup(),
  ],
  spacer: [
    {
      title: 'Style',
      icon: Move,
      controls: [{ type: 'slider', key: 'height', label: 'Height', unit: 'px', min: 4, max: 200 }],
    },
  ],
  // Social / Menu / Carousel inspectors are fleshed out in Phase 7.
  social: [],
  menu: [],
  carousel: [],
  html: [
    {
      title: 'Content',
      icon: Type,
      controls: [{ type: 'textarea', key: 'html', label: 'HTML' }],
    },
  ],
}
