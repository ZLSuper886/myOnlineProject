// 调用 DeepSeek Chat Completions（OpenAI 兼容接口）
// 密钥由 vite.config.ts 的 dev-server 代理在「服务端」注入，
// 不会进入前端打包产物，避免密钥暴露到浏览器。

// 当前接入 deepseek-v4-flash：DeepSeek 官方目前单价最低的对话模型，
// 缓存命中输入 $0.0028/1M、未命中 $0.14/1M、输出 $0.28/1M，性价比最高
const MODEL = 'deepseek-v4-flash'

const API_URL = '/api/deepseek/v1/chat/completions'

export interface ChatMsg {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatReply {
  // 模型返回的正式回答内容
  content: string
  // 思考过程（当 showThinking 为 true 时解析得到）
  thinking?: string
}

/**
 * 张林数字分身的人物画像与回答规范
 * TODO: 后续等 src/persona/zhanglin.md 填完后，可改为通过后端动态读取该文件内容
 */
const PERSONA_PROMPT = `
你是「张林的 AI 替身」，专门模仿张林（ZL）的性格、经历和表达方式，替张林回答来访者的问题。

回答时必须遵守以下规则：
1. 以第一人称回答，语气自然、真诚，就像张林本人在回复。
2. 所有事实都必须基于张林的个人资料，不能编造。
3. 如果资料中没有相关信息，或你不确定，请坦诚说明："这个我暂时没法确定，你可以直接问张林本人。"
4. 表达风格：简洁、理性、有细节，不喜欢冗长客套。
5. 不能透露张林的敏感隐私（家庭住址、身份证号、具体薪资、公司内部机密等）。
6. 你是张林的替身，不是通用 AI 助手。不要回答与张林无关的问题，必要时引导用户回到"关于张林"的话题。

目前可使用的张林资料（后续会补充更多）：
- 姓名：张林
- 职业：前端开发工程师
- 技术栈：Vue 3、TypeScript、Vite、Node.js
- 项目：myOnlineProject 个人作品集网站
- 性格：理性、注重细节、喜欢把复杂事情做简单、长期主义
`.trim()

// 要求模型把思考过程放在 <thinking> 标签内，正式回答放在 <answer> 标签内
const THINKING_PROMPT = `
请在回答前先进行简短思考，然后把思考过程放在 <thinking>...</thinking> 标签内，
把正式回答放在 <answer>...</answer> 标签内。
注意：<thinking> 内的内容只是内部推理，不需要让用户看到完整逻辑，保持简洁即可。
`.trim()

/**
 * 调用 DeepSeek 对话接口
 * @param messages 对话历史
 * @param showThinking 是否让模型返回思考过程
 */
export async function chat(messages: ChatMsg[], showThinking = false): Promise<ChatReply> {
  // 构造消息：开头注入人物画像，末尾追加思考格式要求
  const sentMessages: ChatMsg[] = [
    { role: 'system', content: PERSONA_PROMPT },
    ...messages
  ]
  if (showThinking) {
    sentMessages.push({ role: 'system', content: THINKING_PROMPT })
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages: sentMessages, temperature: 0.7 })
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`DeepSeek ${res.status}: ${detail}`)
  }
  const data = await res.json()
  const raw = (data.choices?.[0]?.message?.content as string) ?? ''

  if (!showThinking) {
    return { content: raw }
  }

  // 解析 <thinking> 与 <answer> 标签
  const thinkingMatch = raw.match(/<thinking>([\s\S]*?)<\/thinking>/)
  const answerMatch = raw.match(/<answer>([\s\S]*?)<\/answer>/)

  if (thinkingMatch || answerMatch) {
    return {
      thinking: thinkingMatch?.[1]?.trim() || '',
      content: answerMatch?.[1]?.trim() || raw.replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim()
    }
  }

  // 模型未按格式返回时，降级为全部当作正式回答
  return { content: raw }
}
