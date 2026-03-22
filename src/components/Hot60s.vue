<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

interface Hot60sItem {
  title: string
  url?: string
}

interface Props {
  title: string
}

defineProps<Props>()

const newsList = ref<Hot60sItem[]>([])
const loading = ref(false)

const loadNews = async () => {
  if (newsList.value.length > 0) return

  loading.value = true
  try {
    const res = await fetch('https://60s.viki.moe/v2/60s?encoding=json')
    const data = await res.json()
    if (data.data && data.data.news) {
      newsList.value = data.data.news.map((item: string) => ({
        title: item
      }))
    }
  } catch {
    newsList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNews()
})
</script>

<template>
  <div class="hot-list-card">
    <div class="card-header">
      <span class="card-title">
        <Icon icon="mdi:newspaper" width="16" height="16" />
        {{ title }}
      </span>
      <span class="loading-text" v-if="loading">加载中...</span>
    </div>
    <div class="card-content">
      <div
        v-for="(item, index) in newsList"
        :key="index"
        class="hot-item"
      >
        <span class="hot-index">{{ index + 1 }}</span>
        <span class="hot-word">{{ item.title }}</span>
      </div>
      <div v-if="!loading && newsList.length === 0" class="empty-state">
        暂无数据
      </div>
    </div>
  </div>
</template>

<style scoped>
.hot-list-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.loading-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.card-content::-webkit-scrollbar {
  width: 4px;
}

.card-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.hot-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: default;
  transition: background 0.2s;
}

.hot-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hot-index {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.hot-index.is-first {
  background: rgba(255, 215, 0, 0.4);
  color: #ffd700;
}

.hot-index.is-second {
  background: rgba(192, 192, 192, 0.4);
  color: #c0c0c0;
}

.hot-index.is-third {
  background: rgba(205, 127, 50, 0.4);
  color: #cd7f32;
}

.hot-word {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  word-break: break-all;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}
</style>
