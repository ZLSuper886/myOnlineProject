import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/index.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Vue app.mount 是同步的，但 router-view 内容在 microtask 中渲染。
// 需等 microtask 队列清空后 .reveal 元素才存在于 DOM。
setTimeout(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  const els = document.querySelectorAll('.reveal')
  if (!els.length) return
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'))
    return
  }
  els.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.84) {
      el.classList.add('in')
    }
  })
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    })
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' })
  els.forEach((el) => {
    if (!el.classList.contains('in')) {
      io.observe(el)
    }
  })
}, 50)
