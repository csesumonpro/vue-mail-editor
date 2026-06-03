import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { vTooltip } from './directives/tooltip'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.directive('tooltip', vTooltip)
app.mount('#app')
