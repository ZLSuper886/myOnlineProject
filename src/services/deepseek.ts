// 调用 DeepSeek Chat Completions（OpenAI 兼容接口）
// 密钥由 vite.config.ts 的 dev-server 代理在「服务端」注入，
// 不会进入前端打包产物，避免密钥暴露到浏览器。

// 注：用户所称 "deepseek-v4-flash" 目前并非公开模型名；
// DeepSeek 官方可用的对话模型为 deepseek-chat，本集成使用它以保证真实可用。
const MODEL = 'deepseek-chat'

const API_URL = '/api/deepseek/v1/chat/completions'

export interface ChatMsg {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function chat(messages: ChatMsg[]): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.7 })
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`DeepSeek ${res.status}: ${detail}`)
  }
  const data = await res.json()
  return (data.choices?.[0]?.message?.content as string) ?? ''
}
