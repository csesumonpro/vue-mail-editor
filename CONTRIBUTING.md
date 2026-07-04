# Contributing to vue-mail-editor

First off — thank you for taking the time to contribute! 🎉

`vue-mail-editor` is a drag-and-drop email template editor for Vue 3. This guide
covers how to set up the project, make changes, and open a pull request.

- 📖 Docs: <https://csesumonpro.github.io/vue-mail-editor/>
- 🐛 Issues: <https://github.com/csesumonpro/vue-mail-editor/issues>

## Ways to contribute

- **Report a bug** — open an issue with a clear title, reproduction steps, and
  what you expected vs. what happened. A minimal repro (CodeSandbox/StackBlitz or
  a small snippet) helps enormously.
- **Request a feature** — open an issue describing the use case before writing
  code, so we can agree on the approach.
- **Improve the docs** — the `docs/` directory is a full [VitePress](https://vitepress.dev)
  site; typo fixes and clarifications are very welcome.
- **Submit code** — fix a bug or build a feature (ideally one that has an open,
  agreed-upon issue).

## Prerequisites

- **Node.js 20+**
- **npm** (the repo ships a `package-lock.json`)

## Getting started

1. **Fork** the repository and **clone** your fork:

   ```bash
   git clone https://github.com/<your-username>/vue-mail-editor.git
   cd vue-mail-editor
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the library once** (the docs' live demo imports the built output from
   `dist/`):

   ```bash
   npm run build
   ```

## Development workflow

| Command                 | What it does                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Runs the local **playground** (`playground/`) with hot reload   |
| `npm run build`         | Type-checks and builds the **library** into `dist/`             |
| `npm run typecheck`     | Runs `vue-tsc --noEmit` (no build)                              |
| `npm run docs:dev`      | Runs the **docs** site locally (run `npm run build` first)      |
| `npm run docs:build`    | Builds the docs site                                            |
| `npm run docs:preview`  | Serves the built docs                                           |

Most editor development happens in the **playground**: run `npm run dev` and edit
files under `src/`.

## Project structure

```
src/            # library source (the published package)
  EmailEditor.vue   # main component
  blocks/           # built-in blocks + block API
  components/       # UI (canvas, inspector, layout, common)
  composables/      # history, autosave, variables, toast, patch
  config/           # defaults, schemas, templates, fonts
  core/             # editor state, registry, actions
  export/           # HTML exporter
  types/            # public + internal types
playground/     # local dev demo (NOT published to npm)
docs/           # VitePress documentation site
```

Only `dist/` is published to npm (see the `files` field in `package.json`), so
the playground and docs never ship to consumers.

## Making changes

1. Create a branch off `main`:

   ```bash
   git checkout -b fix/short-description
   ```

2. Make your change. Keep the diff focused and match the surrounding code style.

3. **Before committing, make sure these pass:**

   ```bash
   npm run typecheck
   npm run build
   ```

### Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/).
Use a type prefix and an optional scope:

```
feat(blocks): add countdown timer block
fix(variables): chip inherits surrounding typography
docs(theming): clarify dark-mode token overrides
chore: bump dependencies
```

Common types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`.

## Pull requests

1. Push your branch to your fork and open a PR against `main`.
2. Fill in the PR description: what changed, why, and how you tested it.
3. Link any related issue (e.g. `Closes #123`).
4. Keep PRs reasonably small and single-purpose — it makes review faster.

A maintainer will review, may request changes, and merge once it's ready. CI must
be green.

## Releasing

> For maintainers. Releases are automated via GitHub Actions — pushing a
> `v*` tag publishes to npm (using [Trusted Publishing / OIDC](https://docs.npmjs.com/trusted-publishers),
> no token) **and** creates a GitHub Release from the changelog.

1. **Update `CHANGELOG.md`.** Add a new section at the **top**, above the
   previous version, following [Keep a Changelog](https://keepachangelog.com):

   ```markdown
   ## [1.0.2] - 2026-07-10

   ### Fixed

   - Short, user-facing description of the change.
   ```

   Group entries under `Added` / `Changed` / `Fixed` / `Removed` as appropriate,
   and add the compare link at the bottom of the file.

2. **Bump the version** (must match the tag you'll push):

   ```bash
   npm version 1.0.2 --no-git-tag-version
   ```

3. **Commit and push to `main`:**

   ```bash
   git commit -am "chore(release): 1.0.2"
   git push origin main
   ```

4. **Tag and push the tag** — this triggers the publish workflow:

   ```bash
   git tag v1.0.2
   git push origin v1.0.2
   ```

The `.github/workflows/publish.yml` workflow then builds, verifies the tag
matches `package.json`, publishes to npm, and creates the GitHub Release using
the matching `CHANGELOG.md` section as the release notes.

**Notes**

- The tag **must** be `vX.Y.Z` and match the `version` in `package.json`, or the
  workflow fails fast.
- Always update `CHANGELOG.md` **before** pushing the tag — the workflow reads
  the changelog at the tagged commit.
- Never reuse a version number; npm publishes are immutable.

## Reporting security issues

Please **do not** open a public issue for security vulnerabilities. Instead,
email the maintainer at csesumonpro@gmail.com so it can be addressed privately.

## License

By contributing, you agree that your contributions will be licensed under the
project's [MIT License](./LICENSE).
