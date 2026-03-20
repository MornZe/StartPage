import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    devSourcemap: true
  },
  server: {
    proxy: {
      '/api/hot-search': {
        target: 'https://top.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hot-search/, '/api/board'),
      }
    }
  }
})
