<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
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
// Render the bubble toolbar inside the editor root so it inherits theme/dark
// tokens; `strategy: 'fixed'` keeps it from being clipped by panel overflow.
const tippyOptions = {
  duration: 100,
  appendTo: () => root.value?.closest('.vue-email-editor') ?? document.body,
  popperOptions: { strategy: 'fixed' as const },
}

const editor = useEditor({
  editable: props.editable,
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: false }),
    Underline,
    Link.configure({ openOnClick: false, autolink: false }),
    TextStyle,
    Color,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  editorProps: {
    attributes: { class: 'rte-content' },
  },
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML()),
  onFocus: () => emit('focus'),
  onBlur: () => emit('blur'),
})

watch(
  () => props.editable,
  (v) => {
    editor.value?.setEditable(v)
    if (v && editor.value && !editor.value.isFocused) {
      editor.value.commands.focus()
    }
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

onBeforeUnmount(() => editor.value?.destroy())

function setLink() {
  const prev = editor.value?.getAttributes('link').href ?? ''
  const url = window.prompt('Link URL', prev)
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  } else {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

function setColor(e: Event) {
  editor.value?.chain().focus().setColor((e.target as HTMLInputElement).value).run()
}
</script>

<template>
  <div ref="root">
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="tippyOptions"
      class="flex items-center gap-0.5 rounded-lg border border-line bg-surface p-1 shadow-lg"
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
    </BubbleMenu>

    <EditorContent :editor="editor" />
  </div>
</template>
