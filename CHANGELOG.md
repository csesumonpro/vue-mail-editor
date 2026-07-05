# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/csesumonpro/vue-mail-editor/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/csesumonpro/vue-mail-editor/releases/tag/v1.0.0
