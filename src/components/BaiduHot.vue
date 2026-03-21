<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

interface HotSearchItem {
  word: string
  index?: number
  url: string
  hotTag?: string
  newHotName?: string
  labelTagName?: string
}

interface Props {
  title: string
}

defineProps<Props>()

const hotSearchList = ref<HotSearchItem[]>([])
const hotSearchLoading = ref(false)

const loadHotSearch = async () => {
  if (hotSearchList.value.length > 0) return

  hotSearchLoading.value = true
  try {
    const res = await fetch('/api/hot-search?platform=wise&tab=realtime')
    const data = await res.json()
    const items = data.data?.cards?.[0]?.content?.[0]?.content || []
    hotSearchList.value = items.slice(0, 15)
  } catch {
    hotSearchList.value = []
  } finally {
    hotSearchLoading.value = false
  }
}

const selectHotSearch = (item: HotSearchItem) => {
  window.open(item.url, '_blank')
}

onMounted(() => {
  loadHotSearch()
})
</script>

<template>
  <div class="hot-list-card">
    <div class="card-header">
      <span class="card-title">
        <Icon icon="simple-icons:baidu" width="16" height="16" />
        百度热榜
      </span>
      <span class="loading-text" v-if="hotSearchLoading">加载中...</span>
    </div>
    <div class="card-content">
      <div
        v-for="(item, index) in hotSearchList"
        :key="index"
        class="hot-item"
        @click="selectHotSearch(item)"
      >
        <span class="hot-index" :class="{
          'is-first': index === 0,
          'is-second': index === 1,
          'is-third': index === 2
        }">
          {{ index + 1 }}
        </span>
        <span class="hot-word">{{ item.word }}</span>
        <span v-if="item.newHotName" class="hot-tag new">{{ item.newHotName }}</span>
        <span v-else-if="item.labelTagName" class="hot-tag">{{ item.labelTagName }}</span>
      </div>
      <div v-if="!hotSearchLoading && hotSearchList.length === 0" class="empty-state">
        暂无数据
      </div>
    </div>
  </div>
</template>

<style>
.hot-list-card {
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
}
</style>

<style scoped>
.hot-list-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.15);
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
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.card-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  max-height: 360px;
}

.card-content::-webkit-scrollbar {
  width: 4px;
}

.card-content::-webkit-scrollbar-track {
  background: transparent;
}

.card-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.card-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.hot-item:hover {
  background: rgba(255, 255, 255, 0.12);
}

.hot-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.hot-index.is-first {
  background: #ff4d4d;
  color: white;
}

.hot-index.is-second {
  background: #ff9f43;
  color: white;
}

.hot-index.is-third {
  background: #feca57;
  color: white;
}

.hot-word {
  flex: 1;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-tag {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(255, 0, 64, 0.25);
  color: #ff6b95;
  flex-shrink: 0;
  font-weight: 500;
}

.hot-tag.new {
  background: rgba(0, 180, 0, 0.25);
  color: #4dff88;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}
</style>
