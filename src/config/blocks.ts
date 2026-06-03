import type { Component } from 'vue'
import {
  Heading,
  Pilcrow,
  RectangleHorizontal,
  Image as ImageIcon,
  Minus,
  MoveVertical,
  Users,
  Menu as MenuIcon,
  Code,
} from 'lucide-vue-next'
import type { Content, ContentType } from '@/types/schema'
import { blockDefaults } from '@/config/blockDefaults'

import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import ParagraphBlock from '@/components/blocks/ParagraphBlock.vue'
import ButtonBlock from '@/components/blocks/ButtonBlock.vue'
import ImageBlock from '@/components/blocks/ImageBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import SpacerBlock from '@/components/blocks/SpacerBlock.vue'
import SocialBlock from '@/components/blocks/SocialBlock.vue'
import MenuBlock from '@/components/blocks/MenuBlock.vue'
import HtmlBlock from '@/components/blocks/HtmlBlock.vue'

/**
 * Single source of truth for every content block. Rendering (`component`),
 * defaults, the left palette, and — in later phases — the inspector schema and
 * HTML export all read from here. Add a block = add one entry.
 */
export interface BlockDef<T extends ContentType = ContentType> {
  type: T
  label: string
  icon: Component
  /** Canvas render component; receives a `values` prop. */
  component: Component
  /** Fresh default value bag. */
  defaults: () => Content<T>['values']
}

export const BLOCKS: { [K in ContentType]: BlockDef<K> } = {
  heading: {
    type: 'heading',
    label: 'Heading',
    icon: Heading,
    component: HeadingBlock,
    defaults: blockDefaults.heading,
  },
  paragraph: {
    type: 'paragraph',
    label: 'Text',
    icon: Pilcrow,
    component: ParagraphBlock,
    defaults: blockDefaults.paragraph,
  },
  button: {
    type: 'button',
    label: 'Button',
    icon: RectangleHorizontal,
    component: ButtonBlock,
    defaults: blockDefaults.button,
  },
  image: {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    component: ImageBlock,
    defaults: blockDefaults.image,
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    component: DividerBlock,
    defaults: blockDefaults.divider,
  },
  spacer: {
    type: 'spacer',
    label: 'Spacer',
    icon: MoveVertical,
    component: SpacerBlock,
    defaults: blockDefaults.spacer,
  },
  social: {
    type: 'social',
    label: 'Social',
    icon: Users,
    component: SocialBlock,
    defaults: blockDefaults.social,
  },
  menu: {
    type: 'menu',
    label: 'Menu',
    icon: MenuIcon,
    component: MenuBlock,
    defaults: blockDefaults.menu,
  },
  html: {
    type: 'html',
    label: 'HTML',
    icon: Code,
    component: HtmlBlock,
    defaults: blockDefaults.html,
  },
}

/** Ordered list for the palette. */
export const BLOCK_LIST: BlockDef[] = [
  BLOCKS.heading,
  BLOCKS.paragraph,
  BLOCKS.button,
  BLOCKS.image,
  BLOCKS.divider,
  BLOCKS.spacer,
  BLOCKS.social,
  BLOCKS.menu,
  BLOCKS.html,
]

export function blockComponent(type: ContentType): Component | undefined {
  return BLOCKS[type]?.component
}
