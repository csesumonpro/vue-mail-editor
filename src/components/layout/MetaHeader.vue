<script setup lang="ts">
import { ref } from 'vue'
import { ChevronUp, Plus } from 'lucide-vue-next'
import { useEditor } from '@/core/useEditor'
import { useConfig } from '@/core/useConfig'
import VariableInput from '@/components/common/VariableInput.vue'

const store = useEditor()
const meta = useConfig().meta

// Reply-To / Preview start collapsed (a pill on the right) unless they already
// carry a value, or their parent row is disabled.
const replyToOpen = ref(!!store.design.meta?.replyTo || !meta.from)
const previewOpen = ref(!!store.design.meta?.preview || !meta.subject)

function setMeta(patch: Record<string, string>, key: string) {
  store.updateMeta(patch, `meta:${key}`)
}

const FIELD_CLASS =
  'w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-faint'
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-line bg-surface px-5 shadow-sm">
    <div>
      <!-- From -->
      <div v-if="meta.from" class="cvee-meta-row">
        <span class="cvee-meta-label">From</span>
        <input
          :class="FIELD_CLASS"
          placeholder="Acme &lt;acme@example.com&gt;"
          :value="store.design.meta?.from"
          @input="setMeta({ from: ($event.target as HTMLInputElement).value }, 'from')"
        />
        <button
          v-if="meta.replyTo && !replyToOpen"
          type="button"
          class="cvee-meta-pill"
          :class="store.design.meta?.replyTo ? 'cvee-meta-pill--filled' : ''"
          @click="replyToOpen = true"
        >
          <Plus class="h-3 w-3" /> Reply-To
        </button>
      </div>

      <!-- Reply-To (collapsible) -->
      <div v-if="meta.replyTo && replyToOpen" class="cvee-meta-row">
        <button type="button" class="cvee-meta-label cvee-meta-label--toggle" @click="replyToOpen = false">
          Reply-To <ChevronUp class="h-3 w-3" />
        </button>
        <input
          :class="FIELD_CLASS"
          placeholder="reply@example.com"
          :value="store.design.meta?.replyTo"
          @input="setMeta({ replyTo: ($event.target as HTMLInputElement).value }, 'replyTo')"
        />
      </div>

      <!-- Subject -->
      <div v-if="meta.subject" class="cvee-meta-row">
        <span class="cvee-meta-label">Subject</span>
        <VariableInput
          :model-value="store.design.meta?.subject ?? ''"
          :input-class="FIELD_CLASS"
          placeholder="Subject"
          @update:model-value="setMeta({ subject: $event }, 'subject')"
        />
        <button
          v-if="meta.preview && !previewOpen"
          type="button"
          class="cvee-meta-pill"
          :class="store.design.meta?.preview ? 'cvee-meta-pill--filled' : ''"
          @click="previewOpen = true"
        >
          <Plus class="h-3 w-3" /> Preview
        </button>
      </div>

      <!-- Preview / preheader (collapsible) -->
      <div v-if="meta.preview && previewOpen" class="cvee-meta-row">
        <button type="button" class="cvee-meta-label cvee-meta-label--toggle" @click="previewOpen = false">
          Preview <ChevronUp class="h-3 w-3" />
        </button>
        <VariableInput
          :model-value="store.design.meta?.preview ?? ''"
          :input-class="FIELD_CLASS"
          placeholder="Inbox preview text"
          @update:model-value="setMeta({ preview: $event }, 'preview')"
        />
      </div>
    </div>
  </div>
</template>
