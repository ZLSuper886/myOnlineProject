import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 通过 loadEnv 从 .env 文件读取 DeepSeek 密钥，避免密钥硬编码进入仓库
  const { VITE_DEEPSEEK_KEY } = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api/deepseek': {
          target: 'https://api.deepseek.com',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/deepseek/, ''),
          configure: (proxy) => {
            // 每次代理请求时由服务端注入 Authorization，浏览器端拿不到密钥
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', 'Bearer ' + VITE_DEEPSEEK_KEY)
            })
          }
        }
      }
    }
  }
})
