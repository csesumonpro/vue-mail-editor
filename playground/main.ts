import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { vTooltip } from '@/directives/tooltip'

// NOTE: Pinia + global directive registration here is temporary (P0). In P1 the
// editor becomes self-contained (per-instance state, no host setup required).
const app = createApp(App)
app.use(createPinia())
app.directive('tooltip', vTooltip)
app.mount('#app')
