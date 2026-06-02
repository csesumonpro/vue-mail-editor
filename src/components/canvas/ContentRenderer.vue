<script setup lang="ts">
import { computed } from 'vue'
import type {
  ButtonValues,
  CarouselValues,
  Content,
  DividerValues,
  HeadingValues,
  HtmlValues,
  ImageValues,
  MenuValues,
  ParagraphValues,
  SocialValues,
  SpacerValues,
} from '@/types/schema'
import { padding, border, justify } from '@/utils/style'

const props = defineProps<{ content: Content }>()

// Narrowed accessors keep the template tidy.
const heading = computed(() => props.content.values as HeadingValues)
const paragraph = computed(() => props.content.values as ParagraphValues)
const button = computed(() => props.content.values as ButtonValues)
const image = computed(() => props.content.values as ImageValues)
const divider = computed(() => props.content.values as DividerValues)
const spacer = computed(() => props.content.values as SpacerValues)
const social = computed(() => props.content.values as SocialValues)
const menu = computed(() => props.content.values as MenuValues)
const carousel = computed(() => props.content.values as CarouselValues)
const html = computed(() => props.content.values as HtmlValues)
</script>

<template>
  <!-- Heading -->
  <component
    :is="heading.level"
    v-if="content.type === 'heading'"
    :style="{
      margin: 0,
      padding: padding(heading.padding),
      fontFamily: heading.fontFamily.value,
      fontSize: heading.fontSize + 'px',
      fontWeight: heading.fontWeight,
      color: heading.color,
      textAlign: heading.align,
      lineHeight: heading.lineHeight,
      letterSpacing: heading.letterSpacing + 'px',
    }"
    v-html="heading.text"
  />

  <!-- Paragraph -->
  <div
    v-else-if="content.type === 'paragraph'"
    :style="{
      padding: padding(paragraph.padding),
      fontFamily: paragraph.fontFamily.value,
      fontSize: paragraph.fontSize + 'px',
      color: paragraph.color,
      textAlign: paragraph.align,
      lineHeight: paragraph.lineHeight,
    }"
    v-html="paragraph.text"
  />

  <!-- Button -->
  <div
    v-else-if="content.type === 'button'"
    :style="{
      padding: padding(button.containerPadding),
      display: 'flex',
      justifyContent: justify(button.align),
    }"
  >
    <span
      :style="{
        display: 'inline-block',
        width: button.fullWidth ? '100%' : 'auto',
        textAlign: 'center',
        backgroundColor: button.backgroundColor,
        color: button.color,
        fontFamily: button.fontFamily.value,
        fontSize: button.fontSize + 'px',
        fontWeight: button.fontWeight,
        border: border(button.border),
        borderRadius: button.borderRadius + 'px',
        padding: padding(button.innerPadding),
      }"
      >{{ button.text }}</span
    >
  </div>

  <!-- Image -->
  <div
    v-else-if="content.type === 'image'"
    :style="{
      padding: padding(image.padding),
      textAlign: image.align,
    }"
  >
    <img
      :src="image.src"
      :alt="image.alt"
      :style="{
        display: 'inline-block',
        width: image.autoWidth ? '100%' : image.width + 'px',
        maxWidth: '100%',
        borderRadius: image.borderRadius + 'px',
      }"
    />
  </div>

  <!-- Divider -->
  <div
    v-else-if="content.type === 'divider'"
    :style="{ padding: padding(divider.padding), textAlign: divider.align }"
  >
    <div
      :style="{
        display: 'inline-block',
        width: divider.width + '%',
        borderTop: `${divider.thickness}px ${divider.style} ${divider.color}`,
      }"
    />
  </div>

  <!-- Spacer -->
  <div
    v-else-if="content.type === 'spacer'"
    :style="{ height: spacer.height + 'px' }"
    class="bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.03)_6px,rgba(0,0,0,0.03)_12px)]"
  />

  <!-- Social -->
  <div
    v-else-if="content.type === 'social'"
    :style="{
      padding: padding(social.padding),
      display: 'flex',
      gap: social.spacing + 'px',
      justifyContent: justify(social.align),
    }"
  >
    <span
      v-for="(icon, i) in social.icons"
      :key="i"
      :style="{
        width: social.size + 'px',
        height: social.size + 'px',
        borderRadius: social.iconStyle === 'rounded' ? '50%' : '4px',
        background: '#1f2937',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: social.size * 0.4 + 'px',
        textTransform: 'capitalize',
      }"
      >{{ icon.network.charAt(0) }}</span
    >
  </div>

  <!-- Menu -->
  <div
    v-else-if="content.type === 'menu'"
    :style="{
      padding: padding(menu.padding),
      display: 'flex',
      flexDirection: menu.layout === 'vertical' ? 'column' : 'row',
      gap: menu.spacing + 'px',
      justifyContent: justify(menu.align),
      alignItems: 'center',
      fontFamily: menu.fontFamily.value,
      fontSize: menu.fontSize + 'px',
      color: menu.color,
    }"
  >
    <template v-for="(item, i) in menu.items" :key="i">
      <span>{{ item.text }}</span>
      <span
        v-if="menu.layout === 'horizontal' && i < menu.items.length - 1"
        :style="{ opacity: 0.4 }"
        >{{ menu.separator }}</span
      >
    </template>
  </div>

  <!-- Carousel -->
  <div
    v-else-if="content.type === 'carousel'"
    :style="{ padding: padding(carousel.padding) }"
  >
    <img
      v-if="carousel.slides.length"
      :src="carousel.slides[0].src"
      :alt="carousel.slides[0].alt"
      style="display: block; width: 100%; max-width: 100%"
    />
    <div
      class="mt-1 flex justify-center gap-1"
      v-if="carousel.slides.length > 1"
    >
      <span
        v-for="(_, i) in carousel.slides"
        :key="i"
        class="h-1.5 w-1.5 rounded-full"
        :class="i === 0 ? 'bg-slate-600' : 'bg-slate-300'"
      />
    </div>
  </div>

  <!-- Raw HTML -->
  <div v-else-if="content.type === 'html'" v-html="html.html" />
</template>
