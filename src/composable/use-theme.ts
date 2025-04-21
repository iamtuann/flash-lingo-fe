// composables/useTheme.ts
import { ref, watchEffect } from 'vue'

const theme = ref<'light' | 'dark'>('dark')

export const useTheme = () => {
  const setTheme = (value: 'light' | 'dark') => {
    theme.value = value
    const body = document.getElementsByTagName('body')[0]
    if (value === 'dark') {
      body.classList.add('dark')
    } else {
      body.classList.remove('dark')
    }
    localStorage.setItem('theme', value)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  watchEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    setTheme(saved || 'dark')
  })

  return {
    theme,
    toggleTheme,
    setTheme
  }
}
