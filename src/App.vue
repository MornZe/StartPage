<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import Clock from './components/Clock.vue'
import EngineSwitch from './components/EngineSwitch.vue'
import SearchBox from './components/SearchBox.vue'
import BaiduHot from './components/BaiduHot.vue'
import BiliBiliHotCard from './components/BiliBiliHotCard.vue'
import Hot60s from './components/Hot60s.vue'
import SettingsPanel from './components/SettingsPanel.vue'

interface SearchEngine {
  name: string
  url: string
  placeholder: string
}

interface Settings {
  showHitokoto: boolean
  customHitokoto: string
  showWeather: boolean
  weatherCounty: string
  showCustomBg: boolean
  bgType: 'url' | 'file'
  bgUrl: string
  zenMode: boolean
  showBaiduHot: boolean
  showBiliHot: boolean
  showHot60s: boolean
}

const engines: SearchEngine[] = [
  { name: 'Bing', url: 'https://bing.com/search?q=', placeholder: '在 Bing 中搜索...' },
  { name: 'Google', url: 'https://google.com/search?q=', placeholder: 'Google 带你了解世界...' },
  { name: '百度', url: 'https://baidu.com/s?wd=', placeholder: '百度一下，你就知道...' },
  { name: '搜狗', url: 'https://sogou.com/web?query=', placeholder: '上网从搜狗开始...' }
]

const currentEngineIndex = ref(0)
const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null)

// 设置相关
const defaultSettings: Settings = {
  showHitokoto: true,
  customHitokoto: '',
  showWeather: true,
  weatherCounty: '',
  showCustomBg: false,
  bgType: 'url',
  bgUrl: '',
  zenMode: false,
  showBaiduHot: false,
  showBiliHot: false,
  showHot60s: false
}

const settings = ref<Settings>({ ...defaultSettings })
const settingsVisible = ref(false)

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('mornstart_settings')
  if (saved) {
    try {
      settings.value = { ...defaultSettings, ...JSON.parse(saved) }
    } catch {
      settings.value = { ...defaultSettings }
    }
  }
}

// 背景处理
const applyBackground = () => {
  const bg = document.getElementById('bg')
  if (!bg) return

  if (settings.value.showCustomBg && settings.value.bgUrl) {
    bg.style.background = `url('${settings.value.bgUrl}') center/cover no-repeat`
  } else {
    // 恢复默认 Bing 壁纸
    loadBingBg()
  }
}

const loadBingBg = async () => {
  if (settings.value.showCustomBg && settings.value.bgUrl) return

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

// Zen 模式相关
const isZenMode = computed(() => settings.value.zenMode)

// 监听设置变化
watch(() => settings.value.showCustomBg, applyBackground)
watch(() => settings.value.bgUrl, applyBackground)

// 事件处理
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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  searchBoxRef.value?.loadHistory()
  loadSettings()
  applyBackground()
})
</script>

<template>
  <div id="bg"></div>

  <div :class="['main-container', { 'zen-mode': isZenMode }]">
    <div class="content-wrapper">
      <div class="center">
        <Clock :hide-date="isZenMode" />

        <EngineSwitch
          v-if="!isZenMode"
          :engines="engines"
          :current-engine-index="currentEngineIndex"
          @switch="switchEngine"
        />

        <SearchBox
          ref="searchBoxRef"
          :engines="engines"
          :current-engine-index="currentEngineIndex"
          :show-settings="true"
          @engine-switch="switchEngine"
          @history-select="handleSearch"
          @suggestion-select="handleSearch"
          @settings-click="settingsVisible = true"
        />
      </div>

      <div v-if="!isZenMode" class="hot-cards">
        <div class="hot-card-wrapper" v-if="settings.showHot60s">
          <Hot60s title="60s 读懂世界" />
        </div>
        <div class="hot-card-wrapper" v-if="settings.showBaiduHot">
          <BaiduHot title="百度热榜" />
        </div>
        <div class="hot-card-wrapper" v-if="settings.showBiliHot">
          <BiliBiliHotCard title="B 站热门" />
        </div>
      </div>
    </div>
  </div>

  <SettingsPanel
    :settings="settings"
    :visible="settingsVisible"
    @update:settings="settings = $event"
    @update:visible="settingsVisible = $event"
  />
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

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  margin-top: 24px;
  max-width: 900px;
  flex-shrink: 0;
  align-items: stretch;
}

.hot-cards .hot-card-wrapper {
  flex: 1;
  min-width: 0;
  max-width: 280px;
  display: flex;
  height: 320px;
}

/* Zen 模式样式 */
.main-container.zen-mode {
  padding: 0;
}

.main-container.zen-mode .center {
  gap: 24px;
}

.main-container.zen-mode .hot-cards {
  display: none;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
    justify-content: center;
    padding: 40px 20px;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .center {
    transform: none;
    margin-top: 0;
    gap: 12px;
  }

  .hot-cards {
    flex-direction: row;
    gap: 12px;
    width: 100%;
    max-width: none;
    margin-top: 48px;
    margin-bottom: 20px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 4px;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .hot-cards::-webkit-scrollbar {
    display: none;
  }

  .hot-cards .hot-card-wrapper {
    flex: 0 0 auto;
    width: 260px;
    max-width: 260px;
    scroll-snap-align: center;
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
