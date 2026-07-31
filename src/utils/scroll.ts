export function getScrollProgress(): number {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  return max > 0 ? (h.scrollTop / max) * 100 : 0
}
