import type { FontValue } from '@/types/schema'

/** Email-safe font stacks. Web fonts degrade to these in most clients. */
export const FONTS: FontValue[] = [
  { label: 'Arial', value: "Arial, Helvetica, sans-serif" },
  { label: 'Helvetica', value: "Helvetica, Arial, sans-serif" },
  { label: 'Verdana', value: "Verdana, Geneva, sans-serif" },
  { label: 'Tahoma', value: "Tahoma, Geneva, sans-serif" },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: 'Georgia', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Courier New', value: "'Courier New', Courier, monospace" },
  { label: 'Lucida Sans', value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
]

export const DEFAULT_FONT: FontValue = FONTS[0]

export const FONT_WEIGHTS = [
  { label: 'Light', value: 300 },
  { label: 'Normal', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semi Bold', value: 600 },
  { label: 'Bold', value: 700 },
]
