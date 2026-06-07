<script setup lang="ts">
import { ref } from 'vue'
import { useEditor } from '@/core/useEditor'
import { useConfig } from '@/core/useConfig'
import VariableInput from '@/components/common/VariableInput.vue'

const FIELD_CLASS =
  'min-w-0 flex-1 border-0 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-faint'

const store = useEditor()
const meta = useConfig().meta

// Optional rows start collapsed (a chip on the right of From/Subject) but
// auto-expand when they already carry a value, or when their parent row is off.
const replyToOpen = ref(!!store.design.meta?.replyTo || !meta.from)
const previewOpen = ref(!!store.design.body.values.preheaderText || !meta.subject)

function setMeta(patch: Record<string, string>, key: string) {
  store.updateMeta(patch, `meta:${key}`)
}
function setPreview(v: string) {
  store.updateBodyValues({ preheaderText: v }, 'meta:preview')
}
</script>

<template>
  <div class="border-b border-line bg-surface">
    <div class="mx-auto max-w-3xl px-8">
      <!-- From -->
      <div
        v-if="meta.from"
        class="flex min-h-[46px] items-center gap-3 border-b border-line-subtle last:border-b-0"
      >
        <label class="w-[84px] shrink-0 text-sm text-subtle">From</label>
        <input
          class="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-faint"
          placeholder="Acme <acme@example.com>"
          :value="store.design.meta?.from"
          @input="setMeta({ from: ($event.target as HTMLInputElement).value }, 'from')"
        />
        <button
          v-if="meta.replyTo && !replyToOpen"
          type="button"
          class="shrink-0 text-sm text-subtle hover:text-ink"
          @click="replyToOpen = true"
        >
          Reply-To
        </button>
      </div>

      <!-- Reply-To -->
      <div
        v-if="meta.replyTo && replyToOpen"
        class="flex min-h-[46px] items-center gap-3 border-b border-line-subtle last:border-b-0"
      >
        <label class="w-[84px] shrink-0 text-sm text-subtle">Reply-To</label>
        <input
          class="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-faint"
          placeholder="reply@example.com"
          :value="store.design.meta?.replyTo"
          @input="setMeta({ replyTo: ($event.target as HTMLInputElement).value }, 'replyTo')"
        />
      </div>

      <!-- Subject -->
      <div
        v-if="meta.subject"
        class="flex min-h-[46px] items-center gap-3 border-b border-line-subtle last:border-b-0"
      >
        <label class="w-[84px] shrink-0 text-sm text-subtle">Subject</label>
        <VariableInput
          :model-value="store.design.meta?.subject ?? ''"
          :input-class="FIELD_CLASS"
          placeholder="Subject"
          @update:model-value="setMeta({ subject: $event }, 'subject')"
        />
        <button
          v-if="meta.preview && !previewOpen"
          type="button"
          class="shrink-0 text-sm text-subtle hover:text-ink"
          @click="previewOpen = true"
        >
          Preview text
        </button>
      </div>

      <!-- Preview text (preheader) -->
      <div
        v-if="meta.preview && previewOpen"
        class="flex min-h-[46px] items-center gap-3 border-b border-line-subtle last:border-b-0"
      >
        <label class="w-[84px] shrink-0 text-sm text-subtle">Preview</label>
        <VariableInput
          :model-value="store.design.body.values.preheaderText"
          :input-class="FIELD_CLASS"
          placeholder="Inbox preview text"
          @update:model-value="setPreview($event)"
        />
      </div>
    </div>
  </div>
</template>
