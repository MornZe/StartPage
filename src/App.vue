<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Hitokoto {
  hitokoto: string
  from_who: string
  from: string
}

const time = ref('00:00')
const date = ref('')
const searchInput = ref('')
const hitokotoText = ref('正在加载一言...')
const hitokotoFrom = ref('—— 未知')
const toast = ref('')
const showToast = ref(false)

const searchUrl = 'https://www.bing.com/search?q='

const updateTime = () => {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  time.value = `${h}:${m}`

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  date.value = now.toLocaleDateString('zh-CN', options)
}

const showGreeting = () => {
  const hour = new Date().getHours()
  let greeting = ''

  if (hour >= 5 && hour < 11) {
    greeting = '早上好'
  } else if (hour >= 11 && hour < 14) {
    greeting = '中午好'
  } else if (hour >= 14 && hour < 18) {
    greeting = '下午好'
  } else if (hour >= 18 && hour < 23) {
    greeting = '晚上好'
  } else {
    greeting = '凌晨好'
  }

  toast.value = greeting
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3500)
}

const loadHitokoto = async () => {
  try {
    const res = await fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k&c=l')
    const data: Hitokoto = await res.json()
    hitokotoText.value = data.hitokoto
    hitokotoFrom.value = `—— ${data.from_who || '未知'} · ${data.from}`
  } catch {
    hitokotoText.value = '生活就像海洋，只有意志坚强的人，才能到达彼岸。'
    hitokotoFrom.value = '—— 马克思'
  }
}

const handleSearch = (e: Event) => {
  e.preventDefault()
  const q = searchInput.value.trim()
  if (!q) return
  window.location.href = searchUrl + encodeURIComponent(q)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '/' && !(e.target as HTMLElement).matches('input')) {
    e.preventDefault()
    ;(document.getElementById('search-input') as HTMLInputElement)?.focus()
  }
}

const handleMousemove = (e: MouseEvent) => {
  const x = (window.innerWidth - e.pageX * 2) / 100
  const y = (window.innerHeight - e.pageY * 2) / 100
  const bgLayer = document.getElementById('bg-layer')
  if (bgLayer) {
    bgLayer.style.transform = `scale(1.05) translate(${x}px, ${y}px)`
  }
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  loadHitokoto()
  showGreeting()
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousemove', handleMousemove)
})
</script>

<template>
  <div id="bg-layer"></div>
  <div id="overlay"></div>

  <div :class="['toast', { show: showToast }]">{{ toast }}</div>

  <div class="main-container">
    <div class="time-display">{{ time }}</div>
    <div class="date-display">{{ date }}</div>

    <div class="search-wrapper">
      <form class="search-box" @submit="handleSearch">
        <input
          type="text"
          class="search-input"
          id="search-input"
          placeholder="输入搜索内容..."
          autocomplete="off"
          v-model="searchInput"
        >
        <button type="submit" class="search-btn">
          <svg class="icon" style="width: 18px; height: 18px;" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </form>
    </div>

    <div class="hitokoto">
      <div class="hitokoto-text">{{ hitokotoText }}</div>
      <div class="hitokoto-from">{{ hitokotoFrom }}</div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

#bg-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  background-size: cover;
  background-position: center;
  background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop');
  transform: scale(1.05);
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: rgba(0, 0, 0, 0.4);
}

.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.time-display {
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  margin-bottom: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.date-display {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
}

.search-wrapper {
  width: 100%;
  max-width: 560px;
  position: relative;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(1.2);
  -webkit-backdrop-filter: blur(40px) saturate(1.2);
  border-radius: 9999px;
  height: 48px;
  padding: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 0.95rem;
  padding: 0 16px;
  height: 100%;
  font-family: inherit;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.hitokoto {
  margin-top: 2.5rem;
  text-align: center;
  max-width: 480px;
}

.hitokoto-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  font-weight: 400;
}

.hitokoto-from {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 0.5rem;
}

.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 10px 20px;
  border-radius: 100px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  font-weight: 400;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  display: inline-block;
  vertical-align: middle;
}
</style>
