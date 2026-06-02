let counter = 0

/**
 * Short, collision-resistant id for design nodes. Uses crypto.randomUUID when
 * available, with a counter+time fallback. Not security sensitive.
 */
export function uid(prefix = 'el'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
  }
  counter += 1
  return `${prefix}_${counter.toString(36)}${Math.floor(performance.now()).toString(36)}`
}
