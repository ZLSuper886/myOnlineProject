# agent.md — 项目级执行规范（myOnlineProject）

> 本文件定义本项目（个人在线作品集站点）的**设计语言、技术栈与代码约定**。
> 后续任何 AI 在本工作区执行需求时，都必须以本文件为最高遵循准则，
> 保持「暖调编辑风 / 高级简约」的整体调性，不得擅自引入冲突的视觉或技术风格。

---

## 1. 项目身份

- **名称**：代码实验室 / myOnlineProject（个人前端作品集）
- **定位**：一个「用代码解决实际问题、用镜头记录生活」的前端开发者主页
- **品牌强调色**：`--accent: #9a5b34`（陶土 / burnt sienna），所有重点、链接 hover、装饰点均使用此色
- **语言**：界面与文案以简体中文为主，第一人称「张林」口吻

---

## 2. 技术栈（固定）

| 维度 | 采用 |
|------|------|
| 框架 | Vue 3（`<script setup>` Composition API 优先） |
| 构建 | Vite |
| 语言 | TypeScript（strict 模式） |
| 状态 | Pinia（`stores/*.ts`） |
| 路由 | Vue Router（`router/index.ts`） |
| 入口 | `src/main.ts` → `src/App.vue` → `src/layouts/DefaultLayout.vue` |

**运行命令**（任何时候都有效）：
```bash
npm install        # 安装依赖
npm run dev        # 本地开发（默认 http://localhost:5173）
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

---

## 3. 设计系统（视觉基线 — 不可偏离）

### 3.1 色彩 Token（CSS 变量，定义在 `src/styles/index.css` `:root`）

```css
--bg:        #f3efe6;   /* 主背景：暖米色 */
--bg-2:       #ece6d8;  /* 次背景：略深米色（marquee / 卡片） */
--ink:        #1c1a16;  /* 主文字：近黑暖墨 */
--ink-soft:   #6b655a;  /* 次要文字：灰褐 */
--line:       rgba(28,26,22,.16); /* 分割线 / 边框 */
--accent:     #9a5b34;  /* 强调：陶土色（链接、hover、装饰点） */
--radius:     12px;      /* 圆角基准 */
--maxw:       1140px;    /* 内容最大宽度 */
--ease:       cubic-bezier(.22,1,.36,1); /* 统一缓动 */
```

> 任何新增组件、页面、区块，**必须复用以上变量**，禁止硬编码其他色值（除非是图片/插画本身的素材色）。

### 3.2 字体

- **标题 / 品牌**：`'Cormorant Garamond', serif`（衬线，大字号，斜体强调）
- **正文 / 标签**：`'Space Grotesk', sans-serif`
- 通过 Google Fonts 引入（`index.html` 中已 preconnect + stylesheet）

### 3.3 排版与间距

- 区块纵向留白：`section { padding: 118px 0; }`（移动端降至 `80px 0`）
- 内容容器：`.wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 28px; }`
- 大标题：`h2` 用 Cormorant Garamond，`clamp(2.2rem, 5.5vw, 3.8rem)`，斜体 `em` 用 `--accent`
- Hero 主标题：`clamp(3.4rem, 13vw, 9rem)`，斜体强调 `.it`
- 小标签（eyebrow / mono）：`letter-spacing: .22em; text-transform: uppercase; font-size: .72rem`

### 3.4 质感与动效

- 背景层：`body::before` 径向/线性渐变光晕 + `body::after` 细微噪点（fractalNoise SVG，`opacity:.045`）
- 滚动渐显：`.reveal { opacity:0; transform:translateY(36px); transition: ... }` → `.in` 显示
- 统一缓动：所有 transition 使用 `var(--ease)`
- 尊重 `prefers-reduced-motion`：关闭动画
- 禁止：霓虹色、高饱和撞色、花哨渐变、过度阴影、emoji 堆砌

---

## 4. 目录结构与命名

```
src/
├── assets/logo.svg          # 品牌 SVG
├── components/
│   ├── TheHeader.vue        # 固定顶栏（blur 毛玻璃）
│   ├── AppFooter.vue
│   ├── MarqueeBar.vue        # 滚动跑马灯
│   ├── ProgressBar.vue       # 顶部阅读进度
│   └── sections/             # 各内容区块（Hero/About/Works/Resume/Contact）
├── composables/useReveal.ts  # 滚动渐显逻辑
├── config/index.ts
├── stores/                  # Pinia（ui / portfolio）
├── types/index.ts
├── utils/                   # format / scroll
├── services/api.ts
├── styles/index.css          # 全局设计 token + 基础样式
├── router/index.ts
├── layouts/DefaultLayout.vue
├── views/                   # AboutView / HomeView
├── App.vue
└── main.ts
```

**命名约定**
- 组件：`PascalCase.vue`（如 `HeroSection.vue`）
- 组合式函数：`useXxx.ts`
- Store：`stores/ui.ts`、`stores/portfolio.ts`
- 区块组件统一放 `components/sections/`
- 新增文件一律沿用以上目录分工，不随意新建顶层目录

---

## 5. 代码风格

- 仅用 `<script setup lang="ts">` 编写组件
- 样式：全局基建在 `src/styles/index.css`；组件内样式可 scoped，但**必须引用第 3 节的 CSS 变量**
- 组件保持单一职责、可复用；区块类组件接收最少 props
- 中文文案保持编辑感：克制、有呼吸感，不用口语化闲聊
- 不引入与现有调性冲突的 UI 库默认主题（如 Bootstrap / Material 的强对比色）

---

## 6. AI 任务执行准则（本项目级）

> 当收到本工作区的新需求时，AI 必须：

1. **先对齐设计语言** —— 任何新增 UI 先用既有 CSS 变量与字体，不另起炉灶。
2. **保持简约高级** —— 留白充足、字号克制、色彩不超过「米色底 + 墨色字 + 陶土强调」三主调。
3. **复用既有组件** —— 优先改 `components/sections/*`，而非从零新建；新区块遵循 `.reveal` 渐显与 `.wrap` 容器。
4. **遵循技术栈** —— Vue 3 + Vite + TS + Pinia + Router，不降级为 JS 或混用 Options API（除非用户明确要求）。
5. **不破坏结构** —— 新增文件遵守第 4 节目录与命名。
6. **文案口吻统一** —— 中文、第一人称「张林」、编辑式表达。
7. **动效从简** —— 仅用 `var(--ease)` 缓动与既有渐显类，不堆特技。
8. **构建可跑** —— 改完确保 `npm run build` 通过；不留下未定义变量 / 破损引入。

**明确禁止**
- 引入与本调性冲突的配色、字体或组件库
- 随意删除/重命名既有核心文件（除非用户要求重构）
- 提交无法运行或破坏视觉一致性的代码

---

## 7. 快速校验清单（交付前自查）

- [ ] 颜色全部来自 `:root` 变量，无硬编码新色值
- [ ] 字体仅为 Cormorant Garamond + Space Grotesk
- [ ] 区块间距 / 圆角 / 缓动与现有风格一致
- [ ] 新增组件放在正确目录并遵循命名
- [ ] TypeScript 无类型错误，`npm run build` 通过
- [ ] 文案为中文、口吻统一、无多余 emoji
- [ ] 未引入冲突的第三方 UI 主题

---

_本文件即本项目的事实源（source of truth）。任何后续 AI 任务都以此为准。_
