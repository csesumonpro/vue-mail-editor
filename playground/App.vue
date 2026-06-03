<script setup lang="ts">
import { EmailEditor } from '@/index'
import type { EditorConfig } from '@/index'

// Demo config — everything is optional; this exercises P4 (slots + config).
const config: EditorConfig = {
  contentWidth: 600,
}

function publish() {
  // eslint-disable-next-line no-alert
  alert('Host "Publish" action — wire to your backend.')
}
</script>

<template>
  <EmailEditor :config="config" color-mode="light">
    <template #header-actions>
      <button
        type="button"
        class="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-header-fg hover:bg-ink/10"
        @click="publish"
      >
        Publish
      </button>
    </template>
  </EmailEditor>
</template>
