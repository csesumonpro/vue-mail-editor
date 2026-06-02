import type { BgImage, BorderValue, BoxValue, TextAlign } from '@/types/schema'

/** `10px 12px 10px 12px` from a BoxValue. */
export function padding(b: BoxValue): string {
  return `${b.top}px ${b.right}px ${b.bottom}px ${b.left}px`
}

/** CSS border shorthand, or `none` when width is 0. */
export function border(b: BorderValue): string {
  return b.width > 0 ? `${b.width}px ${b.style} ${b.color}` : 'none'
}

/** Flex/text alignment from a TextAlign. */
export function justify(a: TextAlign): string {
  return a === 'left' ? 'flex-start' : a === 'right' ? 'flex-end' : 'center'
}

/** Background-image CSS props, or empty object when no url. */
export function bgImage(b: BgImage): Record<string, string> {
  if (!b.url) return {}
  return {
    backgroundImage: `url('${b.url}')`,
    backgroundRepeat: b.repeat,
    backgroundSize: b.size,
    backgroundPosition: b.position,
  }
}
