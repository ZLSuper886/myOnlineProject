<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { chat } from '../services/deepseek'

// 面板开合与全屏状态
const open = ref(false)
const fullscreen = ref(false)

// 是否展示 AI 思考过程
const showThinking = ref(false)

const input = ref('')
const loading = ref(false)
const bodyRef = ref<HTMLDivElement | null>(null)

// 消息结构：assistant 消息可选 thinking 字段
const messages = ref<
  { role: 'user' | 'assistant'; content: string; thinking?: string }[]
>([
  {
    role: 'assistant',
    content: '你好，我是张林的 AI 替身。关于张林的经历、性格、技能和想法，都可以问我。'
  }
])

function toggle() {
  open.value = !open.value
}

function toggleFullscreen() {
  // 切换全屏状态：全屏时面板占满视口，非全屏时恢复悬浮小窗
  fullscreen.value = !fullscreen.value
}

function toggleThinking() {
  showThinking.value = !showThinking.value
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
    // 当开启思考展示时，传入 showThinking 要求模型返回思考过程
    const reply = await chat(
      messages.value.map((m) => ({ role: m.role, content: m.content })),
      showThinking.value
    )
    messages.value.push({
      role: 'assistant',
      content: reply.content,
      thinking: reply.thinking
    })
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
      <div v-if="open" class="ai-panel" :class="{ fullscreen }">
        <div class="ai-head">
          <div class="ai-title">
            <span class="ai-dot"></span>
            <span>ZL 的 AI 替身</span>
          </div>
          <div class="ai-actions">
            <button
              class="ai-action ai-toggle"
              :class="{ active: showThinking }"
              @click="toggleThinking"
              aria-label="切换思考过程展示"
              title="展示思考过程"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
                <path d="M12 12 2.1 10.5A10 10 0 0 0 12 22V12Z" />
              </svg>
            </button>
            <button class="ai-action" @click="toggleFullscreen" :aria-label="fullscreen ? '退出全屏' : '全屏'">
              <svg v-if="!fullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            </button>
            <button class="ai-action" @click="toggle" aria-label="关闭">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div ref="bodyRef" class="ai-body">
          <div v-for="(m, i) in messages" :key="i" class="ai-row" :class="m.role">
            <div class="ai-bubble">
              <!-- 当开启思考展示且存在 thinking 时，先展示折叠式思考过程 -->
              <details v-if="showThinking && m.thinking" class="ai-thinking">
                <summary>思考过程</summary>
                <p>{{ m.thinking }}</p>
              </details>
              <div class="ai-answer">{{ m.content }}</div>
            </div>
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
  /* 默认状态的最小高度和最大高度都比之前大一倍以上，空状态也能撑开 */
  min-height: min(520px, 50vh);
  max-height: min(800px, 70vh);
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: calc(var(--radius) + 2px);
  box-shadow: 0 28px 80px rgba(28, 26, 22, 0.26);
  overflow: hidden;
}

/* 全屏状态：占满整个视口，高度约为默认状态的两倍空间 */
.ai-panel.fullscreen {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  max-height: 100vh;
  height: 100vh;
  border-radius: 0;
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
.ai-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ai-action {
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
  transition: color 0.3s, border-color 0.3s, background 0.3s;
}
.ai-action svg {
  width: 16px;
  height: 16px;
}
.ai-action:hover {
  color: var(--accent);
  border-color: var(--accent);
}
/* 思考开关激活状态：高亮显示当前已开启思考过程 */
.ai-action.ai-toggle.active {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(154, 91, 52, 0.12);
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

/* 全屏时让气泡稍微宽一点，充分利用屏幕 */
.ai-panel.fullscreen .ai-bubble {
  max-width: 70%;
}

/* 思考过程：小号字、可折叠，默认收起 */
.ai-thinking {
  margin-bottom: 8px;
  padding: 8px 10px;
  border-left: 2px solid var(--accent);
  background: rgba(154, 91, 52, 0.06);
  border-radius: 0 6px 6px 0;
  font-size: 0.82rem;
  color: var(--ink-soft);
  line-height: 1.5;
}
.ai-thinking summary {
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  color: var(--accent);
}
.ai-thinking p {
  margin: 6px 0 0;
  white-space: pre-wrap;
}
.ai-answer {
  white-space: pre-wrap;
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

/* 全屏时输入框更宽、内边距更大气 */
.ai-panel.fullscreen .ai-foot {
  padding: 16px 24px;
}
.ai-panel.fullscreen .ai-foot input {
  padding: 13px 20px;
  font-size: 1rem;
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
