import { createApp } from 'vue'
import App from './App.vue'

// The editor is fully self-contained: per-instance state, internal block
// registry, scoped theming, and locally-registered directives. No host setup.
createApp(App).mount('#app')
