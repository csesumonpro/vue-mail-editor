/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vuedraggable' {
  import type { DefineComponent } from 'vue'
  const draggable: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default draggable
}
