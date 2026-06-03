import type { Directive, DirectiveBinding } from 'vue'

/**
 * `v-tooltip` — lightweight hover/focus tooltip rendered to <body> (so it never
 * gets clipped by panel overflow). Placement via arg: v-tooltip:right="'Label'".
 */

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface TipEl extends HTMLElement {
  __tt?: {
    text: string
    placement: Placement
    enter: () => void
    leave: () => void
  }
}

let tip: HTMLElement | null = null

function hide() {
  if (tip) {
    tip.remove()
    tip = null
  }
}

function show(el: TipEl) {
  if (!el.__tt || !el.__tt.text) return
  hide()
  const { text, placement } = el.__tt

  tip = document.createElement('div')
  tip.className = 'app-tooltip'
  tip.textContent = text
  // The tooltip lives on <body>, outside the themed editor root, so copy the
  // resolved theme colors from the trigger element.
  const cs = getComputedStyle(el)
  const bg = cs.getPropertyValue('--cvee-text').trim()
  const fg = cs.getPropertyValue('--cvee-bg').trim()
  if (bg) tip.style.background = bg
  if (fg) tip.style.color = fg
  document.body.appendChild(tip)

  const r = el.getBoundingClientRect()
  const t = tip.getBoundingClientRect()
  const gap = 8
  let top = 0
  let left = 0

  switch (placement) {
    case 'right':
      left = r.right + gap
      top = r.top + r.height / 2 - t.height / 2
      break
    case 'left':
      left = r.left - t.width - gap
      top = r.top + r.height / 2 - t.height / 2
      break
    case 'top':
      top = r.top - t.height - gap
      left = r.left + r.width / 2 - t.width / 2
      break
    default: // bottom
      top = r.bottom + gap
      left = r.left + r.width / 2 - t.width / 2
  }

  // Keep inside the viewport.
  const pad = 4
  left = Math.min(Math.max(pad, left), window.innerWidth - t.width - pad)
  top = Math.min(Math.max(pad, top), window.innerHeight - t.height - pad)

  tip.style.top = `${top}px`
  tip.style.left = `${left}px`
  requestAnimationFrame(() => tip?.classList.add('is-visible'))
}

export const vTooltip: Directive<TipEl, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
    const placement = (binding.arg as Placement) || 'bottom'
    const enter = () => show(el)
    const leave = () => hide()
    el.__tt = { text: binding.value, placement, enter, leave }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('focus', enter)
    el.addEventListener('blur', leave)
    el.addEventListener('click', leave)
  },
  updated(el, binding) {
    if (el.__tt) el.__tt.text = binding.value
  },
  beforeUnmount(el) {
    if (el.__tt) {
      el.removeEventListener('mouseenter', el.__tt.enter)
      el.removeEventListener('mouseleave', el.__tt.leave)
      el.removeEventListener('focus', el.__tt.enter)
      el.removeEventListener('blur', el.__tt.leave)
      el.removeEventListener('click', el.__tt.leave)
    }
    hide()
  },
}
