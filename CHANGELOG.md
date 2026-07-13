# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-07-13

### Added

- **`config.lockVariables`** — lock the template-variable registry to the set the
  host provides. Users can still insert those variables and edit each one's
  fallback value, but cannot create or delete any: the "Create Variable" row, the
  Delete button and the name/type fields are hidden, and `create()` / `remove()`
  no-op. Pair it with `config.variables` when your merge tags come from your own
  system (a CRM schema, an ESP's merge fields) and a user-invented token would
  export something your backend can't resolve. The standalone `TextEditor` takes
  the same flag as a `lock-variables` prop. `api.setVariables()` is unaffected, so
  the host stays in control.
- **Image `height`** — the image block only supported width (height was always
  auto). It now has a `height` value with an `autoHeight` toggle, which defaults
  to auto so aspect ratio is preserved and older designs are unchanged. Adds a
  generic `showIf` predicate to inspector controls, so the Width / Height fields
  appear only when their "Full width" / "Auto height" toggle is off.
- Export the built-in starter templates as `TEMPLATES` so consumers can reuse or
  extend the default gallery (e.g. preload a template as the initial design).

### Fixed

- The configuration docs listed `meta` as shown by default; it is off unless you
  opt in with `meta: true` or a field object.

## [1.2.0] - 2026-07-09

### Added

- **`config.deviceWidths`** — override the canvas/preview width (px) for each
  device toggle (`desktop` / `tablet` / `mobile`). Omitted devices keep their
  defaults (`mobile` 375, `tablet` 600, `desktop` = content width). Adds the
  exported `DeviceWidths` type.
- **Selection breadcrumb** in the settings panel (`Body › Row › Column › Block`)
  — one click to jump to any ancestor level, so a filled column's (and its
  row's) settings are always reachable.

### Fixed

- Inline preview no longer stacks multi-column rows: the desktop preview now
  renders above the 600 px responsive breakpoint, matching the Export dialog and
  real desktop clients.
- The row **Columns color** (`columnsBackground`) is now written to the exported
  HTML, so the two-tone row / card effect ships instead of showing only on the
  editor canvas.

## [1.1.0] - 2026-07-06

### Added

- **Real inline preview.** Preview mode now renders the actual exported email in
  an isolated, auto-sizing iframe (no editing chrome, spacers, or selection
  borders) instead of the editable canvas.
- **`config.variableSyntax`** (`'double' | 'triple'`, default `'triple'`) to
  choose the merge-token delimiter — `{{name}}` vs `{{{name}}}` — applied to both
  the editor chips and the exported HTML.
- **`TextEditor` `toolbarItems`** — an allowlist to show only chosen toolbar
  buttons (e.g. `['variable']` for a variable-only editor). Adds the exported
  `RteToolbarItem` type.

### Fixed

- Top-bar dividers no longer leave an orphaned or doubled separator when a whole
  action group is hidden via `config.actions`.
- Raise the fullscreen overlay `z-index` so it reliably covers host page chrome.

## [1.0.3] - 2026-07-06

### Added

- Fullscreen toggle in the top bar — expands the editor to a full-window overlay
  (a second click or `Esc` exits). Configurable via `config.actions.fullscreen`
  and `config.labels.fullscreen`.
- `config.labeledActions` option to show text labels on the Save/Export buttons.

### Changed

- The Save and Export buttons now render icon-only by default, with the label as
  a tooltip. Set `labeledActions: true` for the previous labeled style.

## [1.0.2] - 2026-07-05

### Added

- Automated GitHub Release creation from the matching `CHANGELOG.md` section on
  each version tag.
- Contributing guide with a documented release process.

### Changed

- Updated the maintainer contact email in package metadata.

## [1.0.1] - 2026-07-05


### Changed

- Maintenance release verifying the automated, tag-triggered npm publishing
  pipeline (GitHub Actions + Trusted Publishing/OIDC). No functional changes to
  the library.

## [1.0.0] - 2026-07-05

### Added

- Initial public release of **vue-mail-editor** — a customizable, extensible
  drag-and-drop email template editor for Vue 3.
- Drag-and-drop canvas with built-in blocks, inspector controls, theming,
  template variables, and HTML export.
- Standalone `TextEditor` component for lightweight rich-text editing.
- `#meta` scoped slot and `design.meta.preview` for custom email metadata
  headers.
- Documentation site with guides, API reference, and a live interactive demo.

[Unreleased]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/csesumonpro/vue-mail-editor/releases/tag/v1.0.0
