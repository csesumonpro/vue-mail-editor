<script setup lang="ts">
import { computed } from 'vue'
import type { ControlDef } from '@/config/inspector'

import ControlField from './controls/ControlField.vue'
import TextControl from './controls/TextControl.vue'
import TextareaControl from './controls/TextareaControl.vue'
import NumberControl from './controls/NumberControl.vue'
import SliderControl from './controls/SliderControl.vue'
import ColorControl from './controls/ColorControl.vue'
import SelectControl from './controls/SelectControl.vue'
import AlignControl from './controls/AlignControl.vue'
import ToggleControl from './controls/ToggleControl.vue'
import SpacingControl from './controls/SpacingControl.vue'
import BorderControl from './controls/BorderControl.vue'
import FontControl from './controls/FontControl.vue'
import LinkControl from './controls/LinkControl.vue'
import ImageControl from './controls/ImageControl.vue'
import BackgroundControl from './controls/BackgroundControl.vue'
import ListControl from './controls/ListControl.vue'

const props = defineProps<{ def: ControlDef; modelValue: unknown }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const map = {
  text: TextControl,
  textarea: TextareaControl,
  number: NumberControl,
  slider: SliderControl,
  color: ColorControl,
  select: SelectControl,
  align: AlignControl,
  toggle: ToggleControl,
  spacing: SpacingControl,
  border: BorderControl,
  font: FontControl,
  link: LinkControl,
  image: ImageControl,
  background: BackgroundControl,
  list: ListControl,
} as const

const component = computed(() => map[props.def.type])

// Controls that read better stacked under their label.
const STACKED = new Set([
  'spacing',
  'border',
  'background',
  'image',
  'textarea',
  'slider',
  'list',
])
const stacked = computed(() => STACKED.has(props.def.type))

function update(v: unknown) {
  emit('update:modelValue', v)
}
</script>

<template>
  <ControlField :label="def.label" :stack="stacked">
    <component
      :is="component"
      :model-value="modelValue"
      :min="def.min"
      :max="def.max"
      :step="def.step"
      :unit="def.unit"
      :options="def.options"
      :placeholder="def.placeholder"
      :item-kind="def.itemKind"
      :allow-transparent="def.type === 'color'"
      @update:model-value="update"
    />
  </ControlField>
</template>
