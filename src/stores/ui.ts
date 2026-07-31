import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const menuOpen = ref(false)
  const toggleMenu = () => { menuOpen.value = !menuOpen.value }
  const closeMenu = () => { menuOpen.value = false }
  const scrollProgress = ref(0)
  const setProgress = (v: number) => { scrollProgress.value = v }
  return { menuOpen, toggleMenu, closeMenu, scrollProgress, setProgress }
})
