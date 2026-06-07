# Server-side & database

The editor is **backend-agnostic**. It never talks to your server directly —
you wire a few hooks and own persistence, uploads, and sending. This guide
covers the whole lifecycle: storing designs, loading them back to edit,
rendering HTML, and personalizing per recipient at send time.

## The model in one minute

- **The `Design` is a plain JSON object** — the single source of truth for an
  email (every block, style, and merge variable lives inside it).
- **The HTML is *derived*** from the design via `exportHtml()` — it's what you
  actually send, not what you store-to-edit.
- **Your app owns** the subject line, recipients, scheduling, and analytics —
  those live *outside* the editor.

```
 ┌─ create / edit ─────────────┐      ┌─ send ──────────────────────┐
 │ <EmailEditor v-model>        │      │ stored HTML (has tokens)     │
 │   ⇅ Design JSON  ── @save ──▶│  DB  │  + design.variables          │
 │                              │ ◀────│  + recipient data            │
 │   loadDesign(design) ◀───────│      │  ⇒ merge ⇒ personalized HTML │
 └──────────────────────────────┘      │  ⇒ your ESP (Resend, SES…)   │
                                        └──────────────────────────────┘
```

Set `storage="none"` so nothing is written to `localStorage` and your database
becomes the only source of truth.

## Hooks & events at a glance

| Prop / event | Fires when | You do |
| ------------ | ---------- | ------ |
| `onLoad()` | editor mounts | fetch & return the `Design` JSON |
| `@change(design)` | every edit (~300ms debounced) | autosave / dirty-tracking |
| `onSave(design)` / `@save` | **Save** clicked | persist the design |
| `onSaveTemplate(payload)` / `@save-template` | **Save as template** | persist a named template |
| `onImageUpload(file)` | an image is added | upload, return its URL |
| `exportHtml(mode?)` / `@export(html, design)` | you ask, or **Export** | get the email HTML |
| `@ready(api)` | editor is ready | grab the [imperative API](/reference/api) |

## `save` vs `Save as template`

Both hand you the **same `Design` JSON** — the difference is intent:

- **`onSave(design)`** — persist **this email** (the campaign/draft the user is
  editing). This is your everyday save.
- **`onSaveTemplate({ name, design })`** — save a **named, reusable template**
  (a starting point for future emails). The editor prompts for the name and
  passes `{ name, design }`. The button only appears when you wire
  `onSaveTemplate` **and** enable it with `config.actions.saveTemplate: true`.

> Practically: `save` writes to your **emails/drafts** table; `saveTemplate`
> writes to your **templates** table. Reusable templates can later be fed back
> as the starter gallery via `config.templates`.

## What to store

Persist the **`Design` object** in one JSON column. Everything — blocks,
styling, light/dark, content width, and the merge-variable registry
(`design.variables`) — is inside it.

| Database | Column type |
| -------- | ----------- |
| PostgreSQL | `jsonb` |
| MySQL | `json` |
| SQLite | `text` |
| MongoDB | the document itself |

A pragmatic schema (split "reusable templates" from "emails you send"):

```sql
-- reusable starting points (Save as template)
templates (
  id          uuid primary key,
  name        text not null,
  design      jsonb not null,        -- the Design object
  updated_at  timestamptz default now()
)

-- the actual emails / campaigns (Save)
emails (
  id          uuid primary key,
  subject     text,                  -- your app owns the subject
  design      jsonb not null,        -- editable source of truth
  html        text,                  -- OPTIONAL: cached exportHtml() for sending
  updated_at  timestamptz default now()
)
```

You **don't have to** store the HTML — it's always re-derivable from the design.
But caching it on every save makes sending instant (no re-render needed).

## 1. Load a design to edit

The `Design` JSON you saved is exactly what you load back. Two ways:

::: code-group

```vue [v-model]
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import type { Design } from '@csesumonpro/vue-email-editor'

const design = ref<Design>()

onMounted(async () => {
  design.value = (await fetch(`/api/emails/${id}`).then((r) => r.json())).design
})
</script>

<template>
  <div style="height: 100vh">
    <EmailEditor v-model="design" storage="none" @save="save" />
  </div>
</template>
```

```vue [onLoad hook]
<script setup lang="ts">
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import type { Design } from '@csesumonpro/vue-email-editor'

// The editor calls this on mount and renders what you return.
async function load(): Promise<Design> {
  return (await fetch(`/api/emails/${id}`).then((r) => r.json())).design
}
</script>

<template>
  <div style="height: 100vh">
    <EmailEditor storage="none" :on-load="load" @save="save" />
  </div>
</template>
```

:::

Or imperatively after grabbing the API: `api.loadDesign(designFromServer)`.

**Edit flow:** user clicks *Edit* → you `GET` the `design` JSON → pass it in →
the editor renders exactly where they left off → on save you receive the updated
`Design` → `UPDATE` the row.

## 2. Save from the editor

`onSave` gives you the design. To **also cache the HTML**, grab the API from
`@ready` and call `exportHtml()` in the same handler:

::: code-group

```vue [TS]
<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import type { Design, EditorApi, TemplatePayload } from '@csesumonpro/vue-email-editor'

const api = ref<EditorApi>()

async function save(design: Design) {
  const html = api.value?.exportHtml() // email-safe HTML (with {{{token}}}s)
  await fetch(`/api/emails/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ design, html }),
  })
}

async function saveTemplate({ name, design }: TemplatePayload) {
  await fetch('/api/templates', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, design }),
  })
}
</script>

<template>
  <EmailEditor
    storage="none"
    :config="{ actions: { saveTemplate: true } }"
    :on-load="load"
    :on-save="save"
    :on-save-template="saveTemplate"
    @ready="api = $event"
  />
</template>
```

```vue [JS]
<script setup>
import { ref } from 'vue'
import { EmailEditor } from '@csesumonpro/vue-email-editor'

const api = ref()

async function save(design) {
  const html = api.value?.exportHtml()
  await fetch(`/api/emails/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ design, html }),
  })
}

async function saveTemplate({ name, design }) {
  await fetch('/api/templates', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, design }),
  })
}
</script>

<template>
  <EmailEditor
    storage="none"
    :config="{ actions: { saveTemplate: true } }"
    :on-load="load"
    :on-save="save"
    :on-save-template="saveTemplate"
    @ready="api = $event"
  />
</template>
```

:::

## 3. Autosave to your database

::: warning `autosaveMs` does not apply here
`config.autosaveMs` **only** debounces the built-in `localStorage` autosave
(`storage="local"`). With `storage="none"` it does nothing — you own the cadence.
:::

The `change` event already fires ~300ms-debounced. Add your own debounce to
batch DB writes:

::: code-group

```vue [TS]
<script setup lang="ts">
import { debounce } from 'lodash-es'
import { EmailEditor } from '@csesumonpro/vue-email-editor'
import type { Design } from '@csesumonpro/vue-email-editor'

// your real-DB "autosaveMs" — tune freely
const autosave = debounce((design: Design) => {
  fetch(`/api/emails/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ design }),
  })
}, 1000)
</script>

<template>
  <EmailEditor storage="none" :on-load="load" @change="autosave" />
</template>
```

```vue [JS]
<script setup>
import { debounce } from 'lodash-es'
import { EmailEditor } from '@csesumonpro/vue-email-editor'

const autosave = debounce((design) => {
  fetch(`/api/emails/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ design }),
  })
}, 1000)
</script>

<template>
  <EmailEditor storage="none" :on-load="load" @change="autosave" />
</template>
```

:::

## 4. Image uploads

When a user adds an image, `onImageUpload(file)` runs — upload it to your
storage and **return the public URL**. Without a handler, the editor falls back
to inlining a base64 data URL (fine for previews, heavy for real emails).

```ts
async function upload(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const { url } = await fetch('/api/uploads', { method: 'POST', body }).then((r) => r.json())
  return url // becomes the block's <img src>
}
```

```vue-html
<EmailEditor storage="none" :on-image-upload="upload" />
```

## 5. Render HTML for sending

The HTML is produced by **`exportHtml(mode?)`** (or the `@export` event, which
gives `(html, design)`). Two strategies:

- **Cache on save (recommended).** Call `api.exportHtml()` whenever you save and
  store the result in the `html` column. At send time you just read it — no
  browser needed on the server. (See §2.)
- **Render on demand.** You always have the `design` JSON, but `exportHtml()` is
  a browser/Vue-side function — running it purely in Node (no DOM) is awkward.
  For most apps, caching the HTML on save is simpler and faster.

By default the HTML keeps <code v-pre>{{{name}}}</code> merge tokens (so a send-time engine can
fill them). Pass `exportHtml('fallback')` if you instead want a static render
with each variable's fallback baked in.

## 6. Personalize with template variables

The stored HTML contains <code v-pre>{{{name}}}</code> tokens. At send time,
merge each recipient's data, falling back to the variable's `fallback` (from
`design.variables`):

```js
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// html: the stored template; variables: design.variables; values: this recipient
function renderEmail(html, variables, values) {
  return html.replace(/\{\{\{(\w+)\}\}\}/g, (_, name) => {
    const v = values[name]
    if (v != null && v !== '') return escapeHtml(v)
    const def = variables.find((x) => x.name === name)
    return def ? escapeHtml(def.fallback) : ''
  })
}

// "Hi {{{first_name}}}" + { first_name: 'John' } -> "Hi John"
// missing value                                  -> the fallback ("there")
const finalHtml = renderEmail(email.html, email.design.variables, { first_name: 'John' })
```

<code v-pre>{{{name}}}</code> is standard Handlebars "unescaped" syntax, so you can also run the
HTML through **Handlebars** on the server — just merge fallbacks into the data
context first (Handlebars won't fall back on its own). See
[Template variables](/guide/variables) for the full model.

## End-to-end example

A minimal REST shape that ties it together:

```
GET    /api/emails/:id        → { id, subject, design, html }
PUT    /api/emails/:id        ← { design, html? }     (Save / autosave)
POST   /api/templates         ← { name, design }      (Save as template)
GET    /api/templates         → [{ id, name, design }] (starter gallery)
POST   /api/uploads           ← multipart file        → { url }
POST   /api/emails/:id/send   ← { recipients }         (server merges + sends)
```

The send endpoint (server, no editor involved):

```js
// POST /api/emails/:id/send
async function send(req, res) {
  const email = await db.emails.findById(req.params.id) // { html, design, subject }
  for (const r of req.body.recipients) {
    const html = renderEmail(email.html, email.design.variables, r.data)
    await esp.send({ to: r.email, subject: email.subject, html }) // Resend / SES / SendGrid
  }
  res.json({ sent: req.body.recipients.length })
}
```

## Security

- **The `html` block is a raw escape hatch.** Its content is emitted verbatim on
  export. If untrusted users author emails, sanitize the design / HTML before
  storing or sending.
- **Validate image URLs** returned from `onImageUpload` and any user-supplied
  links/hrefs.
- **Escape merge values** at send time (the `renderEmail` helper above does this)
  so recipient data can't inject markup.
- **Authorize** load/save/send endpoints — the editor is just the UI; access
  control is your server's job.

## Cheat sheet

| Goal | Use |
| ---- | --- |
| Own persistence (no localStorage) | `storage="none"` |
| Load a saved email to edit | `:on-load` or `v-model` / `api.loadDesign()` |
| Persist an email | `@save` / `:on-save` |
| Persist a reusable template | `:on-save-template` + `config.actions.saveTemplate` |
| Continuous autosave | debounce `@change` yourself |
| Host images | `:on-image-upload` → return a URL |
| Get send-ready HTML | `api.exportHtml()` (cache it) |
| Personalize per recipient | merge <code v-pre>{{{name}}}</code> server-side with fallbacks |
