export function truncate(text: string, len = 40): string {
  return text.length > len ? text.slice(0, len) + '…' : text
}
