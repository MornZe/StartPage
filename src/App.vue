<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Clock from './components/Clock.vue'
import EngineSwitch from './components/EngineSwitch.vue'
import SearchBox from './components/SearchBox.vue'
import HotSearch from './components/HotSearch.vue'
import BiliBiliHot from './components/BiliBiliHot.vue'
import Hitokoto from './components/Hitokoto.vue'

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
const showHotSearch = ref(false)
const showBiliBili = ref(false)

const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null)

const switchEngine = (index: number) => {
  currentEngineIndex.value = index
}

const toggleHotSearch = () => {
  showHotSearch.value = !showHotSearch.value
}

const toggleBiliBili = () => {
  showBiliBili.value = !showBiliBili.value
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

  <div class="center">
    <Clock />

    <EngineSwitch
      :engines="engines"
      :current-engine-index="currentEngineIndex"
      @switch="switchEngine"
    />

    <div class="search-container">
      <SearchBox
        ref="searchBoxRef"
        :engines="engines"
        :current-engine-index="currentEngineIndex"
        :show-hot-search="showHotSearch"
        :show-bili-bili="showBiliBili"
        @engine-switch="switchEngine"
        @history-select="handleSearch"
        @suggestion-select="handleSearch"
        @toggle-hot-search="toggleHotSearch"
        @toggle-bili-bili="toggleBiliBili"
      />

      <HotSearch :visible="showHotSearch" @close="showHotSearch = false" />
      <BiliBiliHot :visible="showBiliBili" @close="showBiliBili = false" />
    </div>

    <Hitokoto />

    <div class="footer"></div>
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

#app {
  width: 100%;
  height: 100%;
}

#bg {
  position: fixed;
  inset: 0;
  z-index: -2;
}

.center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-40px);
  position: relative;
  z-index: 60;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.footer {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
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
}
</style>
