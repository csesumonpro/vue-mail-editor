<script setup lang="ts">
import { computed } from 'vue'
import type { Content } from '@/types/schema'
import { blockComponent } from '@/config/blocks'

const props = defineProps<{ content: Content }>()

const component = computed(() => blockComponent(props.content.type))
</script>

<template>
  <component
    :is="component"
    v-if="component"
    :values="content.values"
    :content-id="content.id"
  />
</template>
