/**
 * Place a fixed-position popover anchored to a target, flipping above the anchor
 * when it would overflow the bottom of the viewport and clamping horizontally.
 */
export function placeAnchored(
  anchorTop: number,
  anchorBottom: number,
  anchorLeft: number,
  el: HTMLElement,
  gap = 4,
): { top: number; left: number } {
  const margin = 8
  const vh = window.innerHeight
  const vw = window.innerWidth
  const h = el.offsetHeight
  const w = el.offsetWidth

  let top = anchorBottom + gap
  if (top + h > vh - margin) {
    const above = anchorTop - gap - h
    top = above >= margin ? above : Math.max(margin, vh - h - margin)
  }

  let left = anchorLeft
  if (left + w > vw - margin) left = Math.max(margin, vw - w - margin)
  if (left < margin) left = margin

  return { top, left }
}
