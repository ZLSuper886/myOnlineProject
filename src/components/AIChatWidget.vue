<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { chat } from '../services/deepseek'

const open = ref(false)
const input = ref('')
const loading = ref(false)
const bodyRef = ref<HTMLDivElement | null>(null)
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([
  { role: 'assistant', content: '你好，我是你的 AI 助手。想聊聊什么？' }
])

function toggle() {
  open.value = !open.value
}

async function scrollToBottom() {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  messages.value.push({ role: 'user', content: text })
  await scrollToBottom()
  loading.value = true
  try {
    const reply = await chat(messages.value.map((m) => ({ role: m.role, content: m.content })))
    messages.value.push({ role: 'assistant', content: reply })
  } catch (e: any) {
    messages.value.push({
      role: 'assistant',
      content: '调用失败：' + (e?.message ?? String(e))
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}
</script>

<template>
  <div class="ai-chat">
    <button class="ai-fab" :class="{ open }" @click="toggle" aria-label="打开 AI 对话">
      <svg class="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5Z" />
      </svg>
      <span class="ai-ring"></span>
    </button>

    <transition name="ai-pop">
      <div v-if="open" class="ai-panel">
        <div class="ai-head">
          <div class="ai-title">
            <span class="ai-dot"></span>
            <span>AI 助手</span>
          </div>
          <button class="ai-close" @click="toggle" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref="bodyRef" class="ai-body">
          <div v-for="(m, i) in messages" :key="i" class="ai-row" :class="m.role">
            <div class="ai-bubble">{{ m.content }}</div>
          </div>
          <div v-if="loading" class="ai-row assistant">
            <div class="ai-bubble ai-typing">
              <i></i><i></i><i></i>
            </div>
          </div>
        </div>

        <form class="ai-foot" @submit.prevent="send">
          <input v-model="input" type="text" placeholder="输入消息…" :disabled="loading" />
          <button type="submit" :disabled="loading" aria-label="发送">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.ai-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 60;
  font-family: 'Space Grotesk', sans-serif;
}

.ai-fab {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 40px rgba(28, 26, 22, 0.18);
  transition: transform 0.4s var(--ease), color 0.3s, box-shadow 0.3s;
  position: relative;
}
.ai-fab:hover {
  transform: translateY(-3px);
  color: var(--ink);
  box-shadow: 0 18px 50px rgba(28, 26, 22, 0.24);
}
.ai-icon {
  width: 26px;
  height: 26px;
}
.ai-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--accent);
  opacity: 0.45;
  animation: ai-pulse 2.4s var(--ease) infinite;
}
@keyframes ai-pulse {
  0% { transform: scale(1); opacity: 0.45; }
  70% { transform: scale(1.55); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

.ai-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 61;
  width: min(360px, 92vw);
  max-height: min(560px, 72vh);
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: calc(var(--radius) + 2px);
  box-shadow: 0 28px 80px rgba(28, 26, 22, 0.26);
  overflow: hidden;
}

.ai-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(236, 230, 216, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.ai-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  color: var(--ink);
  letter-spacing: 0.01em;
}
.ai-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}
.ai-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--ink-soft);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s, border-color 0.3s;
}
.ai-close svg {
  width: 16px;
  height: 16px;
}
.ai-close:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.ai-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ai-row {
  display: flex;
}
.ai-row.user {
  justify-content: flex-end;
}
.ai-row.assistant {
  justify-content: flex-start;
}
.ai-bubble {
  max-width: 84%;
  padding: 12px 16px;
  line-height: 1.55;
  font-size: 0.95rem;
  color: var(--ink);
}
.ai-row.assistant .ai-bubble {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 16px;
  border-top-left-radius: 4px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.02rem;
}
.ai-row.user .ai-bubble {
  background: rgba(154, 91, 52, 0.13);
  border: 1px solid rgba(154, 91, 52, 0.28);
  border-radius: 16px;
  border-top-right-radius: 4px;
}

.ai-typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 16px !important;
}
.ai-typing i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.5;
  animation: ai-blink 1.2s infinite both;
}
.ai-typing i:nth-child(2) { animation-delay: 0.2s; }
.ai-typing i:nth-child(3) { animation-delay: 0.4s; }
@keyframes ai-blink {
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
}

.ai-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-2);
  border-top: 1px solid var(--line);
}
.ai-foot input {
  flex: 1;
  padding: 11px 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.3s;
}
.ai-foot input::placeholder {
  color: var(--ink-soft);
}
.ai-foot input:focus {
  border-color: var(--accent);
}
.ai-foot button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  flex-shrink: 0;
  background: var(--accent);
  color: #f3efe6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s, transform 0.3s var(--ease);
}
.ai-foot button svg {
  width: 18px;
  height: 18px;
}
.ai-foot button:hover {
  transform: scale(1.05);
}
.ai-foot button:disabled {
  opacity: 0.45;
  cursor: default;
  transform: none;
}

.ai-pop-enter-active,
.ai-pop-leave-active {
  transition: opacity 0.32s var(--ease), transform 0.32s var(--ease);
}
.ai-pop-enter-from,
.ai-pop-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
}
</style>
