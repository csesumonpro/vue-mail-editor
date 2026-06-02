<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { padding, bgImage } from '@/utils/style'
import RowRenderer from './RowRenderer.vue'

const store = useEditorStore()
const body = computed(() => store.design.body)

const selected = computed(() => store.selection.kind === 'body')

function selectBody() {
  if (store.previewMode) return
  store.selectBody()
}
</script>

<template>
  <div
    class="relative transition-[outline] outline-offset-[-2px]"
    :class="
      selected && !store.previewMode
        ? 'outline outline-2 outline-brand'
        : 'outline outline-2 outline-transparent'
    "
    :style="{
      backgroundColor: body.values.contentBackground,
      ...bgImage(body.values.backgroundImage),
      fontFamily: body.values.fontFamily.value,
      color: body.values.textColor,
      padding: padding(body.values.padding),
      direction: body.values.direction,
    }"
    @click="selectBody"
  >
    <RowRenderer v-for="row in body.rows" :key="row.id" :row="row" />

    <div
      v-if="!body.rows.length"
      class="flex min-h-40 flex-col items-center justify-center gap-1 text-center text-slate-400"
    >
      <p class="text-sm font-medium">Empty email</p>
      <p class="text-xs">Drag a block from the left to get started.</p>
    </div>
  </div>
</template>
