<script setup lang="ts">
import { ref, onMounted } from 'vue'

const time = ref('')
const date = ref('')
const weather = ref<{ location: { name: string }; now: { text: string; temperature: string } } | null>(null)
const loading = ref(true)

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
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  loadWeather()
})
</script>

<template>
  <div class="time">{{ time }}</div>
  <div class="date-row">
    <div class="date">{{ date }}</div>
    <div class="weather" v-if="!loading && weather">
      <span class="weather-bg">
        <span class="weather-text">{{ weather.location.name }} {{ weather.now.text }} {{ weather.now.temperature }}°C</span>
      </span>
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
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  margin-bottom: 24px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  backdrop-filter: blur(20px) saturate(1.2);
}

.weather-text {
  position: relative;
  z-index: 1;
}
</style>
