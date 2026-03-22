<script setup lang="ts">
import { ref, onMounted } from 'vue'

const time = ref('')
const date = ref('')
const weather = ref<{ location: { name: string }; now: { text: string; temperature: string } } | null>(null)
const hitokotoText = ref('')

defineProps<{
  hideDate?: boolean
}>()

const updateTime = () => {
  const now = new Date()
  time.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  date.value = now.toLocaleDateString('zh-CN', options)
}

const loadWeather = async () => {
  try {
    const res = await fetch('https://api.seniverse.com/v3/weather/now.json?key=ScbFxdH0MeMbAJWVt&location=ip&language=zh-Hans&unit=c')
    const data = await res.json()
    if (data.results && data.results[0]) {
      weather.value = data.results[0]
    }
  } catch {
    weather.value = null
  }
}

const loadHitokoto = async () => {
  const settingsStr = localStorage.getItem('mornstart_settings')
  
  // 没有设置时，默认显示一言
  if (!settingsStr) {
    try {
      const res = await fetch('https://v1.hitokoto.cn', {
        cache: 'no-cache'
      })
      const data = await res.json()
      hitokotoText.value = data.hitokoto
      return
    } catch {
      hitokotoText.value = '保持热爱，奔赴山海'
      return
    }
  }
  
  try {
    const settings = JSON.parse(settingsStr)
    if (settings.showHitokoto) {
      if (settings.customHitokoto) {
        hitokotoText.value = settings.customHitokoto
        return
      }
      try {
        const res = await fetch('https://v1.hitokoto.cn', {
          cache: 'no-cache'
        })
        const data = await res.json()
        hitokotoText.value = data.hitokoto
      } catch {
        hitokotoText.value = '保持热爱，奔赴山海'
      }
    } else {
      hitokotoText.value = ''
    }
  } catch {
    hitokotoText.value = '保持热爱，奔赴山海'
  }
}

// 监听设置变化
const handleStorageChange = (e?: StorageEvent) => {
  if (!e || e.key === 'mornstart_settings') {
    loadHitokoto()
  }
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  loadWeather()
  loadHitokoto()
  window.addEventListener('storage', handleStorageChange)
  // 同时监听本地设置变化（使用定时器检查）
  let lastSettings = localStorage.getItem('mornstart_settings')
  setInterval(() => {
    const currentSettings = localStorage.getItem('mornstart_settings')
    if (currentSettings !== lastSettings) {
      lastSettings = currentSettings
      handleStorageChange()
    }
  }, 500)
})
</script>

<template>
  <div class="time">{{ time }}</div>
  <div v-if="!hideDate" class="date-row">
    <div class="date-weather">
      <div class="date">{{ date }}</div>
      <div class="weather" v-if="weather">
        <span class="weather-bg">
          <span class="weather-text">{{ weather.location.name }} {{ weather.now.text }} {{ weather.now.temperature }}°C</span>
        </span>
      </div>
    </div>
    <div v-if="hitokotoText" class="hitokoto">
      <div class="hitokoto-text">{{ hitokotoText }}</div>
    </div>
  </div>
</template>

<style scoped>
.time {
  font-size: 5rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-variant-numeric: tabular-nums;
}

.date-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  margin-bottom: 24px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  gap: 4px;
}

.date-weather {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.date {
  display: inline;
}

.weather {
  display: inline;
  margin-left: 8px;
}

.weather-bg {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  padding: 4px 10px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.weather-text {
  position: relative;
  z-index: 1;
}

.hitokoto {
  max-width: 400px;
  text-align: center;
  padding: 0 20px;
}

.hitokoto-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
}
</style>
