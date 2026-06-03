import { createApp } from 'vue'
import App from './App.vue'
import { vTooltip } from '@/directives/tooltip'

// The editor is self-contained (per-instance state). The host only registers the
// v-tooltip directive for now — made internal to the library in P3.
const app = createApp(App)
app.directive('tooltip', vTooltip)
app.mount('#app')
