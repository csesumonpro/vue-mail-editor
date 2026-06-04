<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import { LinkMark } from './LinkMark'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: string
    editable?: boolean
    lists?: boolean
    placeholder?: string
  }>(),
  { editable: false, lists: false, placeholder: 'Type here…' },
)
const emit = defineEmits<{ 'update:modelValue': [string]; focus: []; blur: [] }>()

const root = ref<HTMLElement | null>(null)

const editor = useEditor({
  editable: props.editable,
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: false }),
    Underline,
    LinkMark,
    TextStyle,
    Color,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  editorProps: {
    attributes: { class: 'rte-content' },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
    updateMenu()
  },
  onSelectionUpdate: () => updateMenu(),
  onFocus: () => {
    emit('focus')
    updateMenu()
  },
  onBlur: () => {
    emit('blur')
    menuVisible.value = false
  },
})

/* Lightweight bubble menu ------------------------------------------- */
// Replaces @tiptap/vue-3's <BubbleMenu> (which bundles tippy.js + @popperjs/core,
// ~34 KB gzip) with a `position: fixed` toolbar positioned from the selection's
// own client rect — no extra deps, same behaviour.
const menuVisible = ref(false)
const menuTop = ref(0)
const menuLeft = ref(0)

function updateMenu() {
  const ed = editor.value
  if (!ed || !ed.isEditable || !ed.isFocused) {
    menuVisible.value = false
    return
  }
  const { from, to, empty } = ed.state.selection
  if (empty) {
    menuVisible.value = false
    return
  }
  // Bounding box of the selection across its start/end positions.
  const start = ed.view.coordsAtPos(from)
  const end = ed.view.coordsAtPos(to)
  menuLeft.value = (Math.min(start.left, end.left) + Math.max(start.right, end.right)) / 2
  menuTop.value = Math.min(start.top, end.top)
  menuVisible.value = true
}

function onScrollOrResize() {
  if (menuVisible.value) updateMenu()
}

onMounted(() => {
  window.addEventListener('scroll', onScrollOrResize, true)
  window.addEventListener('resize', onScrollOrResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
  editor.value?.destroy()
})

watch(
  () => props.editable,
  (v) => {
    editor.value?.setEditable(v)
    if (v && editor.value && !editor.value.isFocused) {
      editor.value.commands.focus()
    }
    if (!v) menuVisible.value = false
  },
)
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val, false)
    }
  },
)

function setLink() {
  const prev = editor.value?.getAttributes('link').href ?? ''
  const url = window.prompt('Link URL', prev)
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  } else {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  nextTick(updateMenu)
}

function setColor(e: Event) {
  editor.value?.chain().focus().setColor((e.target as HTMLInputElement).value).run()
}
</script>

<template>
  <div ref="root">
    <!-- Bubble toolbar: fixed-positioned, kept inside the themed root so tokens
         and dark mode resolve. @mousedown.prevent keeps the editor selection
         from collapsing when a button is pressed. -->
    <div
      v-if="editor && menuVisible"
      class="bubble-menu flex items-center gap-0.5 rounded-lg border border-line bg-surface p-1 shadow-lg"
      :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
      @mousedown.prevent
    >
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Bold class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Italic class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <UnderlineIcon class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <Strikethrough class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        class="rte-btn"
        :class="{ 'rte-active': editor.isActive('link') }"
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
          :class="{ 'rte-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <List class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="rte-btn"
          :class="{ 'rte-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <ListOrdered class="h-3.5 w-3.5" />
        </button>
      </template>
    </div>

    <EditorContent :editor="editor" />
  </div>
</template>
