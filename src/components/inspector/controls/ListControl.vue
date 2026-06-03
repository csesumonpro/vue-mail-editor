<script setup lang="ts">
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-vue-next'
import { SOCIAL_NETWORKS } from '@/config/social'

type Item = Record<string, string>

const props = defineProps<{
  modelValue: Item[]
  itemKind?: 'social' | 'menu'
}>()
const emit = defineEmits<{ 'update:modelValue': [Item[]] }>()

const networks = [
  ...SOCIAL_NETWORKS.map((n) => ({ value: n.key, label: n.label })),
  { value: 'custom', label: 'Custom' },
]

function newItem(): Item {
  if (props.itemKind === 'menu') return { text: 'Link', url: '#' }
  return { network: 'facebook', url: 'https://' }
}

function patchItem(i: number, p: Partial<Item>) {
  const next = props.modelValue.map((it, idx) =>
    idx === i ? ({ ...it, ...p } as Item) : it,
  )
  emit('update:modelValue', next)
}
function add() {
  emit('update:modelValue', [...props.modelValue, newItem()])
}
function remove(i: number) {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, idx) => idx !== i),
  )
}
function move(i: number, delta: number) {
  const ni = i + delta
  if (ni < 0 || ni >= props.modelValue.length) return
  const next = [...props.modelValue]
  const [x] = next.splice(i, 1)
  next.splice(ni, 0, x)
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="w-full space-y-2">
    <div
      v-for="(item, i) in modelValue"
      :key="i"
      class="space-y-1.5 rounded-md border border-line bg-muted p-2"
    >
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-semibold uppercase text-faint"
          >#{{ i + 1 }}</span
        >
        <div class="flex items-center gap-0.5 text-faint">
          <button type="button" class="rte-btn !h-6 !w-6" :disabled="i === 0" @click="move(i, -1)">
            <ChevronUp class="h-3 w-3" />
          </button>
          <button
            type="button"
            class="rte-btn !h-6 !w-6"
            :disabled="i === modelValue.length - 1"
            @click="move(i, 1)"
          >
            <ChevronDown class="h-3 w-3" />
          </button>
          <button type="button" class="rte-btn !h-6 !w-6 hover:!text-danger" @click="remove(i)">
            <Trash2 class="h-3 w-3" />
          </button>
        </div>
      </div>

      <!-- Social -->
      <template v-if="itemKind === 'social'">
        <select
          :value="item.network"
          class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs outline-none focus:border-brand"
          @change="patchItem(i, { network: ($event.target as HTMLSelectElement).value })"
        >
          <option v-for="n in networks" :key="n.value" :value="n.value">
            {{ n.label }}
          </option>
        </select>
        <input
          :value="item.url"
          placeholder="Profile URL"
          class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs outline-none focus:border-brand"
          @input="patchItem(i, { url: ($event.target as HTMLInputElement).value })"
        />
        <input
          :value="item.icon || ''"
          :placeholder="
            item.network === 'custom' ? 'Custom icon URL (required)' : 'Custom icon URL (optional)'
          "
          class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs outline-none focus:border-brand"
          @input="patchItem(i, { icon: ($event.target as HTMLInputElement).value })"
        />
      </template>

      <!-- Menu -->
      <template v-else-if="itemKind === 'menu'">
        <input
          :value="item.text"
          placeholder="Label"
          class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs outline-none focus:border-brand"
          @input="patchItem(i, { text: ($event.target as HTMLInputElement).value })"
        />
        <input
          :value="item.url"
          placeholder="URL"
          class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs outline-none focus:border-brand"
          @input="patchItem(i, { url: ($event.target as HTMLInputElement).value })"
        />
      </template>
    </div>

    <button
      type="button"
      class="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-line py-2 text-xs font-medium text-subtle hover:border-brand hover:text-brand-dark"
      @click="add"
    >
      <Plus class="h-3.5 w-3.5" />
      Add item
    </button>
  </div>
</template>
