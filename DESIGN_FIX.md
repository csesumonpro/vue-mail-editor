# Design regression on `feature/npm-package` — diagnosis & fix plan

Reference: `main` (the good design). Target: make `feature/npm-package` look identical.

## Symptoms (feature/npm-package vs main)
- **RTE inline bubble toolbar** (B/I/U/S/link/color/lists): on main it's a clean
  rounded white popover; on feature it has **no background/border**, icons overlap
  the text (screenshot 20).
- **Tooltips** (hover rail blocks / top-bar icons): broken on feature.
- **Export modal / Templates modal**: not the crisp centered cards from main
  (screenshots 21–22) — backgrounds/sizing look off.

## Root cause (confirmed)
On **main**, design tokens are declared on **`:root`** (global):
```css
:root { --inkp-bg: …; --inkp-bg-surface: …; --inkp-text: …; /* etc */ }
.dark { … }
```
So **anything in the DOM** can resolve `var(--inkp-*)` — including elements that
render **outside** the editor via portals:
- the **Tiptap `BubbleMenu`** (tippy.js appends it to `document.body`), and
- the **`v-tooltip`** directive (appends a div to `document.body`).

Both use token-based classes/vars:
- bubble menu wrapper: `class="… rounded-lg border border-line bg-surface p-1 shadow-lg"`
- `.app-tooltip { background: var(--inkp-text); color: var(--inkp-bg); }`

On **feature/npm-package** (P3) I moved tokens to **`.vue-email-editor`** (scoped):
```css
.vue-email-editor { --inkp-* … }
.vue-email-editor.dark { … }
```
→ body-portaled elements are **outside** `.vue-email-editor`, so `var(--inkp-*)`
is **undefined** there → bubble menu has no bg/border, tooltip has no colors.
Modals are in-tree so colors resolve, but verify their layout on the branch.

## Fix plan (implement on `feature/npm-package`)
1. **Tokens: emit a global `:root` default _and_ keep instance scoping.**
   In `src/style.css`:
   - `:root { …all light tokens… }`  ← restores main behavior; portals resolve.
   - `.dark, .vue-email-editor.dark { …dark overrides… }`  ← support global `.dark`
     **and** per-instance dark (the editor toggles `.dark` on its own root).
   - Keep the per-instance `theme` prop `<style>` overrides (already in
     `EmailEditor.vue` via `themeToCss`) — they're more specific than `:root`.
   Net: default look is global (works everywhere); dark + custom themes still scoped.

2. **Tiptap BubbleMenu**: also append inside the editor so dark/custom themes apply
   to it too. In `src/components/common/RichTextEditor.vue`:
   `:tippy-options="{ duration: 100, appendTo: () => editorRoot }"` where
   `editorRoot` is the closest `.vue-email-editor` ancestor (or `'parent'` if no
   clipping). With step 1 the light default already works even without this; this
   makes dark/instance-theme correct for the popover.

3. **Tooltip** (`src/directives/tooltip.ts`): keep reading the resolved
   `--inkp-text` / `--inkp-bg` from the trigger element (already added) so it themes
   correctly regardless of where it's appended. With step 1 the base also works.

4. **Modals** (`ExportModal.vue`, `TemplatesModal.vue`): confirm they render as
   centered cards (`fixed inset-0 flex items-center justify-center` + `bg-surface`
   card). With step 1 `bg-surface` resolves. If layout is still off, check that no
   ancestor establishes a containing block for `position:fixed` (transform/filter/
   contain) and that Tailwind utilities are present.

5. Rebuild, **bump version**, `npm pack`, retest in playground + consumer.

## Reference values (from main `src/style.css`)
Light tokens (must be the default everywhere):
```
--inkp-bg:#f8fafc; --inkp-bg-sidebar:#ffffff; --inkp-bg-surface:#ffffff;
--inkp-bg-muted:#f1f5f9; --inkp-bg-hover:#f1f5f9; --inkp-bg-active:#e2e8f0;
--inkp-bg-input:#ffffff; --inkp-border:#e2e8f0; --inkp-border-subtle:#f1f5f9;
--inkp-text:#0f172a; --inkp-text-secondary:#64748b; --inkp-text-muted:#94a3b8;
--inkp-text-strong:#1e293b; --inkp-btn-primary-bg:#0f172a; --inkp-btn-primary-text:#f8fafc;
--inkp-link:#2563eb; --inkp-accent:#0f172a; --inkp-accent-hover:#1e293b; --inkp-on-accent:#ffffff;
--inkp-header-bg:#ffffff; --inkp-header-fg:#0f172a; --inkp-canvas:#eef2f6; --inkp-canvas-grid:#dbe2ea;
```
Dark overrides: bg `#0b0f1a`, sidebar/surface `#111827`, muted/hover `#1e293b`,
active `#334155`, input `#1e293b`, border `#1e293b`, text `#f8fafc`,
accent `#f8fafc`, on-accent `#0f172a`, primary `#f8fafc`/`#0f172a`,
header-bg `#0b0f1a`, canvas `#0b0f1a`/grid `#1b2536`.
