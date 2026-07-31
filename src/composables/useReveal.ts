import { onMounted } from 'vue'

export function useReveal() {
  onMounted(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = document.querySelectorAll('.reveal')
    if (!reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' })
      els.forEach((el) => io.observe(el))
    } else {
      els.forEach((el) => el.classList.add('in'))
    }
  })
}
