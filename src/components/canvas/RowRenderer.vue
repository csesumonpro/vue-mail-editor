<script setup lang="ts">
import { computed } from 'vue'
import type { Row } from '@/types/schema'
import { useEditor } from "@/core/useEditor"
import { padding, border, bgImage } from '@/utils/style'
import SelectableWrapper from './SelectableWrapper.vue'
import ColumnRenderer from './ColumnRenderer.vue'

const props = defineProps<{ row: Row }>()
const store = useEditor()

const stacked = computed(
  () => store.device === 'mobile' && props.row.values.stackOnMobile,
)

const hidden = computed(() => {
  if (!store.previewMode) return false
  const { hideOn } = props.row.values
  return store.device === 'desktop' ? hideOn.desktop : hideOn.mobile
})

const dimmed = computed(() => {
  if (store.previewMode) return false
  const { hideOn } = props.row.values
  return store.device === 'desktop' ? hideOn.desktop : hideOn.mobile
})
</script>

<template>
  <SelectableWrapper
    v-if="!hidden"
    kind="row"
    :id="row.id"
    label="Row"
  >
    <div
      :style="{
        backgroundColor:
          row.values.backgroundColor === 'transparent'
            ? undefined
            : row.values.backgroundColor,
        ...bgImage(row.values.backgroundImage),
        padding: padding(row.values.padding),
        border: border(row.values.border),
        borderRadius: row.values.borderRadius + 'px',
      }"
      :class="{ 'opacity-40': dimmed }"
    >
      <div
        class="flex"
        :class="stacked ? 'flex-col' : 'flex-row'"
        :style="{
          backgroundColor:
            row.values.columnsBackground === 'transparent'
              ? undefined
              : row.values.columnsBackground,
        }"
      >
        <div
          v-for="(column, i) in row.columns"
          :key="column.id"
          :style="{
            flex: stacked ? '1 1 100%' : `${row.cells[i]} 0 0%`,
            width: stacked ? '100%' : undefined,
            minWidth: 0,
          }"
        >
          <ColumnRenderer :column="column" :row-id="row.id" />
        </div>
      </div>
    </div>
  </SelectableWrapper>
</template>
