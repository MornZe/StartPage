<script setup lang="ts">
import { ref, onMounted } from 'vue'

const time = ref('')
const date = ref('')

const updateTime = () => {
  const now = new Date()
  time.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  date.value = now.toLocaleDateString('zh-CN', options)
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="time">{{ time }}</div>
  <div class="date">{{ date }}</div>
</template>

<style scoped>
.time {
  font-size: 5rem;
  font-weight: 200;
  letter-spacing: 0.05em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-variant-numeric: tabular-nums;
}

.date {
  opacity: 0.8;
  margin-bottom: 24px;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
