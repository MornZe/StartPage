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
      },
      '/api/bing-wallpaper': {
        target: 'https://www.bing.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bing-wallpaper/, '/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
          })
        },
      },
      '/api/bilibili-popular': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bilibili-popular/, '/x/web-interface/popular?ps=20&pn=1'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            proxyReq.setHeader('Referer', 'https://www.bilibili.com')
          })
        },
      }
    }
  }
})
