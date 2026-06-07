<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { safeUrl } from '@/export/helpers'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
  Braces,
} from 'lucide-vue-next'

const props = defineProps<{ editor: Editor; lists?: boolean; showVariables?: boolean }>()
const emit = defineEmits<{ variable: [] }>()

// The editor instance is a stable prop reference, so this child doesn't re-render
// on transactions on its own. Bump a tick on each transaction and read it in
// `active()` so the highlighted (rte-active) states stay in sync.
const tick = ref(0)
const bump = () => (tick.value += 1)
props.editor.on('transaction', bump)
onBeforeUnmount(() => props.editor.off('transaction', bump))
function active(name: string): boolean {
  void tick.value
  return props.editor.isActive(name)
}

function setLink() {
  const prev = props.editor.getAttributes('link').href ?? ''
  const url = window.prompt('Link URL', prev)
  if (url === null) return
  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  const href = safeUrl(url) // drop javascript:/data:text etc.
  if (!href) return
  props.editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
}
function setColor(e: Event) {
  props.editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()
}
</script>

<template>
  <button
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('bold') }"
    @click="editor.chain().focus().toggleBold().run()"
  >
    <Bold class="h-3.5 w-3.5" />
  </button>
  <button
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('italic') }"
    @click="editor.chain().focus().toggleItalic().run()"
  >
    <Italic class="h-3.5 w-3.5" />
  </button>
  <button
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('underline') }"
    @click="editor.chain().focus().toggleUnderline().run()"
  >
    <UnderlineIcon class="h-3.5 w-3.5" />
  </button>
  <button
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('strike') }"
    @click="editor.chain().focus().toggleStrike().run()"
  >
    <Strikethrough class="h-3.5 w-3.5" />
  </button>
  <button
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('link') }"
    @click="setLink"
  >
    <Link2 class="h-3.5 w-3.5" />
  </button>
  <label class="rte-btn relative cursor-pointer">
    <span class="h-3.5 w-3.5 rounded-sm border border-line bg-gradient-to-br from-red-500 via-green-500 to-blue-500" />
    <input type="color" class="absolute inset-0 cursor-pointer opacity-0" @input="setColor" />
  </label>
  <template v-if="lists">
    <span class="mx-0.5 h-4 w-px bg-line" />
    <button
      type="button"
      class="rte-btn"
      :class="{ 'rte-active': active('bulletList') }"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <List class="h-3.5 w-3.5" />
    </button>
    <button
      type="button"
      class="rte-btn"
      :class="{ 'rte-active': active('orderedList') }"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <ListOrdered class="h-3.5 w-3.5" />
    </button>
  </template>
  <!-- Insert template variable: opens the same list + Create popover as `{{`. -->
  <template v-if="showVariables">
    <span class="mx-0.5 h-4 w-px bg-line" />
    <button type="button" class="rte-btn" title="Insert variable" @click="emit('variable')">
      <Braces class="h-3.5 w-3.5" />
    </button>
  </template>
</template>
