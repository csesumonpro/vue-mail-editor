/** Rich-text toolbar buttons, in their fixed display order. Pass a subset as
 *  `toolbarItems` to show only those (e.g. `['variable']` for just the variable
 *  button). Treated as an allowlist — order is fixed by the toolbar layout. */
export type RteToolbarItem =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'link'
  | 'color'
  | 'bulletList'
  | 'orderedList'
  | 'variable'
