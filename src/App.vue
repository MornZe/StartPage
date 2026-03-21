<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Clock from './components/Clock.vue'
import EngineSwitch from './components/EngineSwitch.vue'
import SearchBox from './components/SearchBox.vue'
import BaiduHot from './components/BaiduHot.vue'
import BiliBiliHotCard from './components/BiliBiliHotCard.vue'

interface SearchEngine {
  name: string
  url: string
  placeholder: string
}

const engines: SearchEngine[] = [
  { name: 'Bing', url: 'https://bing.com/search?q=', placeholder: '在 Bing 中搜索...' },
  { name: 'Google', url: 'https://google.com/search?q=', placeholder: 'Google 带你了解世界...' },
  { name: '百度', url: 'https://baidu.com/s?wd=', placeholder: '百度一下，你就知道...' },
  { name: '搜狗', url: 'https://sogou.com/web?query=', placeholder: '上网从搜狗开始...' }
]

const currentEngineIndex = ref(0)

const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null)

const switchEngine = (index: number) => {
  currentEngineIndex.value = index
}

const handleSearch = (query: string) => {
  window.open(engines[currentEngineIndex.value].url + encodeURIComponent(query), '_blank')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '/' && !(e.target as HTMLElement).matches('input')) {
    e.preventDefault()
    ;(document.getElementById('search-input') as HTMLInputElement)?.focus()
  }
}

const loadBingBg = async () => {
  try {
    const res = await fetch('/api/bing-wallpaper')
    const data = await res.json()
    const image = data.images[0]
    const imgUrl = 'https://cn.bing.com' + image.url
    const bg = document.getElementById('bg')
    if (bg) {
      bg.style.background = `url('${imgUrl}') center/cover no-repeat`
    }
  } catch (e) {
    console.error('Bing 壁纸加载失败:', e)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  searchBoxRef.value?.loadHistory()
  loadBingBg()
})
</script>

<template>
  <div id="bg"></div>

  <div class="main-container">
    <div class="center">
      <Clock />

      <EngineSwitch
        :engines="engines"
        :current-engine-index="currentEngineIndex"
        @switch="switchEngine"
      />

      <SearchBox
        ref="searchBoxRef"
        :engines="engines"
        :current-engine-index="currentEngineIndex"
        @engine-switch="switchEngine"
        @history-select="handleSearch"
        @suggestion-select="handleSearch"
      />

      <div class="hot-cards">
        <div class="hot-card-wrapper">
          <BaiduHot title="百度热榜" />
        </div>
        <div class="hot-card-wrapper">
          <BiliBiliHotCard title="B 站热门" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (max-width: 1024px) {
  html, body {
    overflow: auto;
  }
}

#app {
  width: 100%;
  height: 100%;
}

#bg {
  position: fixed;
  inset: 0;
  z-index: -2;
}

.main-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 40px;
  overflow-y: auto;
  overflow-x: hidden;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 60;
  width: 100%;
  max-width: 800px;
  gap: 16px;
  padding: 20px 0;
}

.hot-cards {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  margin: 4px 0;
  max-width: 700px;
}

.hot-cards .hot-card-wrapper {
  flex: 1;
  min-width: 0;
  max-width: 340px;
}

/* 移动端响应式布局 */
@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 30px;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .center {
    transform: none;
    margin-top: 0;
    gap: 12px;
  }

  .hot-cards {
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: none;
  }

  .hot-cards .hot-card-wrapper {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .time {
    font-size: 3.5rem;
  }

  .search-wrapper {
    width: 90%;
    max-width: 400px;
  }

  .search {
    height: 40px;
  }

  .main-container {
    padding: 20px 16px;
    padding-top: 30px;
  }
}
</style>
