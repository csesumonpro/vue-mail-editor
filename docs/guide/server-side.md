# Server-side & database

By default the editor autosaves to `localStorage`. To make **your database** the
source of truth, set `storage="none"` and wire the load/save hooks.

```vue
<script setup lang="ts">
import { EmailEditor } from '@csesumonpro/vue-email-editor'

async function load()       { return (await api.get('/designs/1')).data.design }
async function save(design) { await api.put('/designs/1', { design }) }
async function upload(file) { return (await api.upload(file)).url }
</script>

<template>
  <EmailEditor
    storage="none"
    :on-load="load"
    :on-save="save"
    :on-image-upload="upload"
    @export="(html) => api.post('/render', { html })"
  >
    <template #header-actions>
      <button @click="publish">Publish</button>
    </template>
  </EmailEditor>
</template>
```

With `storage="none"` nothing is written to `localStorage` — your database is the
single source of truth.

## What to persist

The **`design` is plain JSON** — store it in a single column.

| Database | Column type |
| -------- | ----------- |
| PostgreSQL | `jsonb` |
| MySQL | `json` |
| SQLite | `text` |
| MongoDB | the document itself |

The exported `html` is **derived** from the design; only persist it if you want a
ready-to-send render cache.

```
designs:  id | name | design (jsonb) | html (text, optional) | updated_at
```

| Hook / event | Role |
| ------------ | ---- |
| `onLoad()` | Runs on mount → fetch & return the design JSON. |
| `onSave(design)` | Runs on **Save** → write the JSON to your DB. |
| `onImageUpload(file)` | Upload an image → return its URL. |
| `exportHtml()` / `@export` | Get the final email HTML. |

## Server-side autosave

::: warning autosaveMs does not apply here
`config.autosaveMs` **only** debounces the built-in `localStorage` autosave
(`storage="local"`). With `storage="none"` it does nothing — you own the save
cadence.
:::

For continuous save-to-database, debounce the `change` event yourself:

```vue
<script setup lang="ts">
import { debounce } from 'lodash-es'
import type { Design } from '@csesumonpro/vue-email-editor'

async function load() {
  return (await api.get('/designs/1')).data.design
}

// this 1000ms is your real-DB "autosaveMs" — tune it freely
const autosave = debounce((design: Design) => {
  api.put('/designs/1', { design })
}, 1000)
</script>

<template>
  <EmailEditor storage="none" :on-load="load" @change="autosave" />
</template>
```

`change` already fires debounced (~300ms) on every edit; the extra `debounce`
batches DB writes. Use `onSave` for an explicit **Save** button on top of (or
instead of) this.

## Rendering the email later

Store the `design` JSON as the editable source of truth. When you need the email
HTML (to send, preview, or cache), call `exportHtml()` via the
[imperative API](/reference/api) or listen to the `export` event:

```vue
<EmailEditor @ready="api = $event" @export="(html) => save(html)" />
```
