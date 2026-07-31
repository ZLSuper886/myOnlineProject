import { onMounted } from 'vue'

// 注：首屏 reveal 逻辑已统一在 src/main.ts 中处理（app.mount 后延迟执行），
// 本 composable 供需要独立 reveal 的页面或组件使用
export function useReveal() {
  onMounted(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = document.querySelectorAll('.reveal')
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
    }
  })
}
