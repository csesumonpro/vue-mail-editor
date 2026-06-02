<script setup lang="ts">
import type { Column } from '@/types/schema'
import { padding, border } from '@/utils/style'
import SelectableWrapper from './SelectableWrapper.vue'
import ContentRenderer from './ContentRenderer.vue'

defineProps<{ column: Column }>()

const valign: Record<string, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
}
</script>

<template>
  <SelectableWrapper kind="column" :id="column.id" label="Column" class="h-full">
    <div
      class="flex h-full flex-col"
      :style="{
        backgroundColor:
          column.values.backgroundColor === 'transparent'
            ? undefined
            : column.values.backgroundColor,
        padding: padding(column.values.padding),
        border: border(column.values.border),
        borderRadius: column.values.borderRadius + 'px',
        justifyContent: valign[column.values.verticalAlign],
      }"
    >
      <template v-if="column.contents.length">
        <SelectableWrapper
          v-for="content in column.contents"
          :key="content.id"
          kind="content"
          :id="content.id"
          :label="content.type"
        >
          <ContentRenderer :content="content" />
        </SelectableWrapper>
      </template>

      <div
        v-else
        class="flex min-h-16 items-center justify-center rounded border border-dashed border-slate-300 text-[11px] text-slate-400"
      >
        Empty column
      </div>
    </div>
  </SelectableWrapper>
</template>
