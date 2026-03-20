<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Clock from './components/Clock.vue'
import EngineSwitch from './components/EngineSwitch.vue'
import SearchBox from './components/SearchBox.vue'
import HotSearch from './components/HotSearch.vue'
import Hitokoto from './components/Hitokoto.vue'

interface SearchEngine {
  name: string
  url: string
  placeholder: string
}

const engines: SearchEngine[] = [
  { name: '必应', url: 'https://bing.com/search?q=', placeholder: '在 Bing 中搜索...' },
  { name: '百度', url: 'https://baidu.com/s?wd=', placeholder: '百度一下，你就知道...' },
  { name: '搜狗', url: 'https://sogou.com/web?query=', placeholder: '上网从搜狗开始...' }
]

const currentEngineIndex = ref(0)
const showHotSearch = ref(false)

const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null)

const switchEngine = (index: number) => {
  currentEngineIndex.value = index
}

const toggleHotSearch = () => {
  showHotSearch.value = !showHotSearch.value
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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  searchBoxRef.value?.loadHistory()
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
        @engine-switch="switchEngine"
        @history-select="handleSearch"
        @suggestion-select="handleSearch"
        @toggle-hot-search="toggleHotSearch"
      />

      <HotSearch :visible="showHotSearch" @close="showHotSearch = false" />
    </div>

    <Hitokoto />

    <div class="footer">
      <span>本站由</span>
      <Icon icon="logos:vercel" width="60" height="20" />
      <span>Serverless Function 强力驱动</span>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
  color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#bg {
  position: fixed;
  inset: 0;
  background: url('https://cn.bing.com/th?id=OHR.SunbeamsForest_ZH-CN5358008117_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp') center/cover;
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
