/**
 * Deep clone a plain JSON-serializable value (design nodes, value bags).
 *
 * Inputs are usually Vue reactive Proxies, which `structuredClone` refuses to
 * clone (DataCloneError), so we JSON round-trip — reliable for our plain data.
 */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
