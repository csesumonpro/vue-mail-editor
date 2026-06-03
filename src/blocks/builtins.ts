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
import type { AnyBlockDefinition } from '@/api/types'
import { defineBlock } from '@/api/defineBlock'
import { blockDefaults } from '@/config/blockDefaults'
import { blockInspectors } from '@/config/inspectorSchemas'

import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import ParagraphBlock from '@/components/blocks/ParagraphBlock.vue'
import ButtonBlock from '@/components/blocks/ButtonBlock.vue'
import ImageBlock from '@/components/blocks/ImageBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import SpacerBlock from '@/components/blocks/SpacerBlock.vue'
import SocialBlock from '@/components/blocks/SocialBlock.vue'
import MenuBlock from '@/components/blocks/MenuBlock.vue'
import HtmlBlock from '@/components/blocks/HtmlBlock.vue'

import {
  headingToHtml,
  paragraphToHtml,
  buttonToHtml,
  imageToHtml,
  dividerToHtml,
  spacerToHtml,
  socialToHtml,
  menuToHtml,
  htmlToHtml,
} from './export'

/** Built-in blocks, authored through the public `defineBlock` API. */
export const BUILTIN_BLOCKS: AnyBlockDefinition[] = [
  defineBlock({
    type: 'heading',
    label: 'Heading',
    icon: Heading,
    category: 'content',
    defaultValues: blockDefaults.heading,
    render: HeadingBlock,
    inspector: blockInspectors.heading,
    toHtml: headingToHtml,
  }),
  defineBlock({
    type: 'paragraph',
    label: 'Text',
    icon: Pilcrow,
    category: 'content',
    defaultValues: blockDefaults.paragraph,
    render: ParagraphBlock,
    inspector: blockInspectors.paragraph,
    toHtml: paragraphToHtml,
  }),
  defineBlock({
    type: 'button',
    label: 'Button',
    icon: RectangleHorizontal,
    category: 'content',
    defaultValues: blockDefaults.button,
    render: ButtonBlock,
    inspector: blockInspectors.button,
    toHtml: buttonToHtml,
  }),
  defineBlock({
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    category: 'content',
    defaultValues: blockDefaults.image,
    render: ImageBlock,
    inspector: blockInspectors.image,
    toHtml: imageToHtml,
  }),
  defineBlock({
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    category: 'content',
    defaultValues: blockDefaults.divider,
    render: DividerBlock,
    inspector: blockInspectors.divider,
    toHtml: dividerToHtml,
  }),
  defineBlock({
    type: 'spacer',
    label: 'Spacer',
    icon: MoveVertical,
    category: 'content',
    defaultValues: blockDefaults.spacer,
    render: SpacerBlock,
    inspector: blockInspectors.spacer,
    toHtml: spacerToHtml,
  }),
  defineBlock({
    type: 'social',
    label: 'Social',
    icon: Users,
    category: 'content',
    defaultValues: blockDefaults.social,
    render: SocialBlock,
    inspector: blockInspectors.social,
    toHtml: socialToHtml,
  }),
  defineBlock({
    type: 'menu',
    label: 'Menu',
    icon: MenuIcon,
    category: 'content',
    defaultValues: blockDefaults.menu,
    render: MenuBlock,
    inspector: blockInspectors.menu,
    toHtml: menuToHtml,
  }),
  defineBlock({
    type: 'html',
    label: 'HTML',
    icon: Code,
    category: 'content',
    defaultValues: blockDefaults.html,
    render: HtmlBlock,
    inspector: blockInspectors.html,
    toHtml: htmlToHtml,
  }),
]
