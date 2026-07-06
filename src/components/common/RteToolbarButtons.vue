<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { safeUrl } from '@/export/helpers'
import type { RteToolbarItem } from '@/api/toolbar'
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

const props = defineProps<{
  editor: Editor
  lists?: boolean
  showVariables?: boolean
  /** Allowlist of buttons to show; omit for the default set. */
  items?: RteToolbarItem[]
}>()
const emit = defineEmits<{ variable: [] }>()

// Which buttons show. With `items` it's the allowlist; otherwise the legacy set
// (all formatting, lists via `lists`, variable via `showVariables`).
function allowed(item: RteToolbarItem): boolean {
  if (props.items) return props.items.includes(item)
  if (item === 'bulletList' || item === 'orderedList') return !!props.lists
  if (item === 'variable') return !!props.showVariables
  return true
}
// A divider is drawn before a group only when a visible group precedes it.
const anyFormatting = computed(() =>
  (['bold', 'italic', 'underline', 'strike', 'link', 'color'] as const).some(allowed),
)
const anyLists = computed(() => allowed('bulletList') || allowed('orderedList'))
// The variable button also needs the variable system enabled.
const showVar = computed(() => allowed('variable') && !!props.showVariables)

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
    v-if="allowed('bold')"
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('bold') }"
    @click="editor.chain().focus().toggleBold().run()"
  >
    <Bold class="h-3.5 w-3.5" />
  </button>
  <button
    v-if="allowed('italic')"
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('italic') }"
    @click="editor.chain().focus().toggleItalic().run()"
  >
    <Italic class="h-3.5 w-3.5" />
  </button>
  <button
    v-if="allowed('underline')"
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('underline') }"
    @click="editor.chain().focus().toggleUnderline().run()"
  >
    <UnderlineIcon class="h-3.5 w-3.5" />
  </button>
  <button
    v-if="allowed('strike')"
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('strike') }"
    @click="editor.chain().focus().toggleStrike().run()"
  >
    <Strikethrough class="h-3.5 w-3.5" />
  </button>
  <button
    v-if="allowed('link')"
    type="button"
    class="rte-btn"
    :class="{ 'rte-active': active('link') }"
    @click="setLink"
  >
    <Link2 class="h-3.5 w-3.5" />
  </button>
  <label v-if="allowed('color')" class="rte-btn relative cursor-pointer">
    <span class="h-3.5 w-3.5 rounded-sm border border-line bg-gradient-to-br from-red-500 via-green-500 to-blue-500" />
    <input type="color" class="absolute inset-0 cursor-pointer opacity-0" @input="setColor" />
  </label>
  <template v-if="anyLists">
    <span v-if="anyFormatting" class="mx-0.5 h-4 w-px bg-line" />
    <button
      v-if="allowed('bulletList')"
      type="button"
      class="rte-btn"
      :class="{ 'rte-active': active('bulletList') }"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <List class="h-3.5 w-3.5" />
    </button>
    <button
      v-if="allowed('orderedList')"
      type="button"
      class="rte-btn"
      :class="{ 'rte-active': active('orderedList') }"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <ListOrdered class="h-3.5 w-3.5" />
    </button>
  </template>
  <!-- Insert template variable: opens the same list + Create popover as `{{`. -->
  <template v-if="showVar">
    <span v-if="anyFormatting || anyLists" class="mx-0.5 h-4 w-px bg-line" />
    <button type="button" class="rte-btn" title="Insert variable" @click="emit('variable')">
      <Braces class="h-3.5 w-3.5" />
    </button>
  </template>
</template>
