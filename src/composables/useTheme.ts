import { ref } from 'vue'

const STORAGE_KEY = 'vue-email-editor:theme'
const isDark = ref(false)

function apply() {
  document.documentElement.classList.toggle('dark', isDark.value)
}

/** App color theme (light/dark) backed by a `.dark` class + localStorage. */
export function useTheme() {
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value =
        window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
    }
    apply()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    apply()
  }

  return { isDark, init, toggle }
}
