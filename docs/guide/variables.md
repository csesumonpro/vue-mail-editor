# Template variables

Template variables are merge tags (e.g. <code v-pre>{{{first_name}}}</code>) that you author
inside text and heading blocks and resolve at send time. Each variable is
defined once at the **design level** and reused across the whole template.

## Authoring

Inside any **Text** or **Heading** block, type <code v-pre>{{</code> to open the variable
autocomplete:

- Existing variables are listed and filtered as you type.
- Choose **Create Variable** to define a new one (name, type, fallback value).

The variable is inserted as a styled inline **chip**. Click a chip to edit its
type / fallback or delete it.

> Typing a literal <code v-pre>{{{...}}}</code> (three braces) does **not** trigger the
> autocomplete — only the two-brace <code v-pre>{{</code> prefix does.

## What a variable is

```ts
interface DesignVariable {
  name: string                 // e.g. 'first_name'
  type: 'string' | 'number'
  fallback: string             // shown when no value is provided
}
```

The chip stores only the **name**; the type and fallback live in the design's
variable registry, so editing one variable updates every place it appears.

## Export

On export, chips become <code v-pre>{{{name}}}</code> tokens by default — your server-side merge
engine replaces them with real values at send time. Prefer double braces
(<code v-pre>{{name}}</code>)? Set [`variableSyntax: 'double'`](/guide/configuration#variablesyntax-merge-token-delimiter).

::: code-group

```ts [TS]
import type { EditorApi } from 'vue-mail-editor'

const api = /* from @ready or a template ref */ ({} as EditorApi)

// Tokens kept — `Hi {{{first_name}}}, …` (default):
const forSending = api.exportHtml()

// Fallbacks baked in — `Hi there, …` — for static HTML with no merge step:
const staticHtml = api.exportHtml('fallback')
```

```js [JS]
// Tokens kept — `Hi {{{first_name}}}, …` (default):
const forSending = api.exportHtml()

// Fallbacks baked in — `Hi there, …` — for static HTML with no merge step:
const staticHtml = api.exportHtml('fallback')
```

:::

In the **Export HTML** dialog, a **Show fallback values** checkbox toggles the
same behaviour (shown only when the design defines variables). The editor's
**Preview** mode also renders fallback values so the design looks realistic.

## Predefining variables

Seed variables into new designs via `config.variables`:

::: code-group

```ts [TS]
import type { EditorConfig } from 'vue-mail-editor'

const config: EditorConfig = {
  variables: [
    { name: 'first_name', type: 'string', fallback: 'there' },
    { name: 'order_total', type: 'number', fallback: '0.00' },
  ],
}
```

```js [JS]
const config = {
  variables: [
    { name: 'first_name', type: 'string', fallback: 'there' },
    { name: 'order_total', type: 'number', fallback: '0.00' },
  ],
}
```

:::

```vue
<EmailEditor :config="config" />
```

Predefined variables seed **new/empty** designs only — a loaded design keeps its
own saved variables.

## Locking the registry

When the merge tags come from your own system, you usually don't want users
inventing new ones — a token your backend can't resolve would ship in the export.
Pair `variables` with `lockVariables: true`:

```ts
const config: EditorConfig = {
  variables: [
    { name: 'first_name', type: 'string', fallback: 'there' },
    { name: 'order_total', type: 'number', fallback: '0.00' },
  ],
  lockVariables: true,
}
```

Locked, users can still:

- **insert** any variable you provided (via the <code v-pre>{{</code> autocomplete
  or the toolbar), and
- edit a variable's **fallback value**, so previews and fallback exports look right.

They cannot **create** or **delete** variables: the **Create Variable** row, the
**Delete** button and the type selector are hidden, and `create()` / `remove()`
no-op even if called. The set of tokens that can reach your backend is exactly the
set you passed in.

The same applies to the standalone `<TextEditor>` via a prop:

```vue
<TextEditor v-model="html" :variables="variables" lock-variables />
```

::: tip Loaded designs
`lockVariables` only locks the **UI**. A design loaded with variables it saved
earlier keeps them (see above), so a user can't delete a stale variable while
locked. If your registry is the source of truth, push it after loading with
`api.setVariables(...)`, which is unaffected by the lock.
:::

## Reading & writing programmatically

The registry round-trips with the design (autosave, JSON import/export,
`v-model`, undo/redo). You can also read or replace it via the imperative API:

```ts
const vars = api.getVariables()
api.setVariables([...vars, { name: 'city', type: 'string', fallback: '' }])
```

| API | Description |
| --- | ----------- |
| `getVariables()` | Returns a snapshot of the variable registry. |
| `setVariables(vars)` | Replaces the registry (recorded in undo history). |
| `exportHtml(mode?)` | `'token'` (default) keeps <code v-pre>{{{name}}}</code>; `'fallback'` substitutes fallback values. |

## Notes & limits

- Variables are authored in **Text** and **Heading** blocks. The <code v-pre>{{{name}}}</code>
  token is plain text, so it also survives export from other fields if typed
  manually.
- Variable **names** allow letters, numbers and underscores only (no dots or
  spaces) — dots would clash with the <code v-pre>{{{a.b}}}</code> token grammar.
- A variable's **name is fixed at creation** (rename is not supported in this
  version) — this keeps existing chips from pointing at a missing name.
- If a variable is deleted while chips remain, those chips render in a muted
  "unknown" state and export as a bare <code v-pre>{{{name}}}</code> token.
