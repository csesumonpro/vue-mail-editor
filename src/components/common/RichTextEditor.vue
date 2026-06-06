<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import { LinkMark } from './LinkMark'
import { VariableNode, type VariableEditRequest } from './VariableNode'
import VariablePopover from './VariablePopover.vue'
import { useEditor as useEditorStore } from '@/core/useEditor'
import { useVariables } from '@/composables/useVariables'
import { placeAnchored } from '@/utils/popover'
import type { DesignVariable } from '@/types/schema'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
  Plus,
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: string
    editable?: boolean
    lists?: boolean
    placeholder?: string
    /** Single-line mode (e.g. buttons): no formatting toolbar, no newlines. */
    plain?: boolean
  }>(),
  { editable: false, lists: false, placeholder: 'Type here…', plain: false },
)
const emit = defineEmits<{ 'update:modelValue': [string]; focus: []; blur: [] }>()

const root = ref<HTMLElement | null>(null)
const store = useEditorStore()
const variables = useVariables(store)

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
    VariableNode.configure({
      getVariable: (name) => variables.get(name),
      isPreview: () => store.previewMode,
      onEdit: (req) => openEdit(req),
    }),
  ],
  editorProps: {
    attributes: { class: 'rte-content' },
    // Drive the `{{` popover from the keyboard when it is open.
    handleKeyDown: (_view, event) => {
      if (!varMenuVisible.value) {
        // Single-line mode: swallow Enter so buttons stay one line.
        if (props.plain && event.key === 'Enter') return true
        return false
      }
      if (event.key === 'Escape') {
        hideVarMenu()
        return true
      }
      if (event.key === 'ArrowDown') {
        varActive.value = Math.min(varActive.value + 1, filteredVars.value.length)
        return true
      }
      if (event.key === 'ArrowUp') {
        varActive.value = Math.max(varActive.value - 1, 0)
        return true
      }
      if (event.key === 'Enter') {
        chooseActive()
        return true
      }
      return false
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
    updateMenu()
    detectTrigger()
  },
  onSelectionUpdate: () => {
    updateMenu()
    detectTrigger()
  },
  onFocus: () => {
    emit('focus')
    updateMenu()
  },
  onBlur: () => {
    emit('blur')
    menuVisible.value = false
    hideVarMenu()
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
  // Plain (single-line) fields never show the formatting toolbar.
  if (props.plain || !ed || !ed.isEditable || !ed.isFocused) {
    menuVisible.value = false
    return
  }
  const sel = ed.state.selection
  const { from, to, empty } = sel
  // A NodeSelection (e.g. a clicked variable chip / image) is not a text range —
  // don't pop the formatting toolbar over it.
  if (empty || (sel as { node?: unknown }).node) {
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
  if (varMenuVisible.value) positionVarMenu(varAnchor.value)
}

/* `{{` variable autocomplete ---------------------------------------- */
// A second floating layer (parallel to the bubble menu) listing template
// variables when the user types `{{`. Hand-rolled to avoid @tiptap/suggestion.
const varMenuVisible = ref(false)
const varMenuTop = ref(0)
const varMenuLeft = ref(0)
const varQuery = ref('')
const varActive = ref(0)
const varAnchor = ref(0)
const varListEl = ref<HTMLElement | null>(null)
const varMenuEl = ref<HTMLElement | null>(null)
// Caret rect edges (for flip-aware placement of the list + popover).
const caretTop = ref(0)
const caretBottom = ref(0)
const caretLeft = ref(0)

// Keep the keyboard-highlighted item visible when the list scrolls.
watch(varActive, (i) => {
  const el = varListEl.value?.children[i] as HTMLElement | undefined
  el?.scrollIntoView({ block: 'nearest' })
})

// Unified create/edit popover state (rendered outside the editor DOM).
const popoverOpen = ref(false)
const popoverMode = ref<'create' | 'edit'>('create')
const popoverAnchorTop = ref(0)
const popoverAnchorBottom = ref(0)
const popoverLeft = ref(0)
const popoverName = ref('')
const editPos = ref<number | null>(null)

const filteredVars = computed<DesignVariable[]>(() => {
  const q = varQuery.value.toLowerCase()
  return variables.list.value.filter((v) => v.name.toLowerCase().includes(q))
})

function hideVarMenu() {
  varMenuVisible.value = false
}

function positionVarMenu(pos: number) {
  const ed = editor.value
  if (!ed) return
  const c = ed.view.coordsAtPos(pos)
  caretTop.value = c.top
  caretBottom.value = c.bottom
  caretLeft.value = c.left
  varMenuTop.value = c.bottom + 4
  varMenuLeft.value = c.left
  nextTick(placeVarMenu)
}

// Flip the `{{` list above the caret when it would overflow the viewport bottom.
function placeVarMenu() {
  if (!varMenuEl.value) return
  const p = placeAnchored(caretTop.value, caretBottom.value, caretLeft.value, varMenuEl.value)
  varMenuTop.value = p.top
  varMenuLeft.value = p.left
}

function detectTrigger() {
  const ed = editor.value
  if (!ed || !ed.isEditable || !ed.isFocused) return hideVarMenu()
  const sel = ed.state.selection
  if (!sel.empty || (sel as { node?: unknown }).node) return hideVarMenu()
  const $from = sel.$from
  const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼')
  const m = /\{\{(\w*)$/.exec(textBefore)
  if (!m) return hideVarMenu()
  // Triple-brace guard: a `{` immediately before the matched `{{` means the user
  // is typing a literal `{{{token}}}` — don't trigger the autocomplete.
  const braceStart = textBefore.length - m[0].length
  if (textBefore[braceStart - 1] === '{') return hideVarMenu()
  varQuery.value = m[1]
  varActive.value = 0
  varAnchor.value = sel.from
  positionVarMenu(sel.from)
  varMenuVisible.value = true
}

function pickVariable(name: string) {
  const ed = editor.value
  if (!ed) return
  const { from } = ed.state.selection
  const start = from - (varQuery.value.length + 2) // 2 = the leading "{{"
  ed.chain().focus().deleteRange({ from: start, to: from }).insertVariable(name).run()
  hideVarMenu()
}

function chooseActive() {
  if (varActive.value < filteredVars.value.length) {
    pickVariable(filteredVars.value[varActive.value].name)
  } else {
    openCreate()
  }
}

function openCreate() {
  popoverMode.value = 'create'
  popoverName.value = varQuery.value
  popoverAnchorTop.value = caretTop.value
  popoverAnchorBottom.value = caretBottom.value
  popoverLeft.value = caretLeft.value
  hideVarMenu()
  popoverOpen.value = true
}

function openEdit(req: VariableEditRequest) {
  popoverMode.value = 'edit'
  popoverName.value = req.name
  editPos.value = req.pos
  popoverAnchorTop.value = req.rect.top
  popoverAnchorBottom.value = req.rect.bottom
  popoverLeft.value = req.rect.left
  hideVarMenu()
  popoverOpen.value = true
}

function onPopoverSubmit(variable: DesignVariable) {
  variables.create(variable)
  // Replace the typed `{{query` with the new chip.
  pickVariable(variable.name)
  popoverOpen.value = false
}

function onPopoverDelete() {
  const ed = editor.value
  if (ed && editPos.value != null) {
    const node = ed.state.doc.nodeAt(editPos.value)
    const size = node?.nodeSize ?? 1
    ed.chain().focus().deleteRange({ from: editPos.value, to: editPos.value + size }).run()
  }
  popoverOpen.value = false
}

// Build the display token in script — a `{{{…}}}` literal in a template
// interpolation confuses Vue's mustache parser.
function token(name: string): string {
  return `{{{${name}}}}`
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

    <!-- `{{` variable autocomplete: anchored to the caret (flips up if needed). -->
    <div
      v-if="editor && varMenuVisible"
      ref="varMenuEl"
      class="fixed z-[2147483600] w-60 overflow-hidden rounded-lg border border-line bg-surface p-1 text-xs shadow-xl"
      :style="{ top: varMenuTop + 'px', left: varMenuLeft + 'px' }"
      @mousedown.prevent
    >
      <div class="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-faint">
        Template variables
      </div>
      <div ref="varListEl" class="scroll-thin max-h-48 overflow-y-auto">
        <button
          v-for="(v, i) in filteredVars"
          :key="v.name"
          type="button"
          class="block w-full truncate rounded-md px-2 py-1.5 text-left font-mono text-ink"
          :class="i === varActive ? 'bg-hover' : ''"
          @click="pickVariable(v.name)"
          @mouseenter="varActive = i"
        >{{ token(v.name) }}</button>
      </div>
      <button
        type="button"
        class="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-ink"
        :class="varActive === filteredVars.length ? 'bg-hover' : ''"
        @click="openCreate"
        @mouseenter="varActive = filteredVars.length"
      >
        <Plus class="h-3.5 w-3.5" />
        Create Variable
      </button>
    </div>

    <VariablePopover
      :open="popoverOpen"
      :mode="popoverMode"
      :anchor-top="popoverAnchorTop"
      :anchor-bottom="popoverAnchorBottom"
      :left="popoverLeft"
      :name="popoverName"
      @submit="onPopoverSubmit"
      @delete="onPopoverDelete"
      @close="popoverOpen = false"
    />

    <EditorContent :editor="editor" />
  </div>
</template>
