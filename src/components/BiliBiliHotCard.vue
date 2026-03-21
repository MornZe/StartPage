<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

interface BiliBiliItem {
  title: string
  bvid: string
  aid: number
  uri?: string
  stat: {
    view: number
    danmaku: number
    reply: number
    like: number
  }
  owner: {
    name: string
  }
}

interface Props {
  title: string
}

defineProps<Props>()

const bilibiliList = ref<BiliBiliItem[]>([])
const bilibiliLoading = ref(false)

const loadBiliBili = async () => {
  if (bilibiliList.value.length > 0) return

  bilibiliLoading.value = true
  try {
    const res = await fetch('/api/bilibili-popular')
    const data = await res.json()
    if (data.code === 0 && data.data?.list) {
      bilibiliList.value = data.data.list.slice(0, 15)
    }
  } catch {
    bilibiliList.value = []
  } finally {
    bilibiliLoading.value = false
  }
}

const selectBiliBili = (item: BiliBiliItem) => {
  window.open(`https://www.bilibili.com/video/${item.bvid}`, '_blank')
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

onMounted(() => {
  loadBiliBili()
})
</script>

<template>
  <div class="hot-list-card">
    <div class="card-header">
      <span class="card-title">
        <Icon icon="simple-icons:bilibili" width="16" height="16" />
        B 站热门
      </span>
      <span class="loading-text" v-if="bilibiliLoading">加载中...</span>
    </div>
    <div class="card-content">
      <div
        v-for="(item, index) in bilibiliList"
        :key="item.aid"
      >
        <div
          class="hot-item bilibili-item"
          @click="selectBiliBili(item)"
        >
          <div class="video-info">
            <span class="video-title">{{ item.title }}</span>
            <div class="video-meta">
              <span class="up-name">UP: {{ item.owner.name }}</span>
              <span class="view-count">
                <Icon icon="mdi:fire" width="12" height="12" />
                {{ formatNumber(item.stat.view) }}
              </span>
            </div>
          </div>
        </div>
        <hr v-if="index < bilibiliList.length - 1" class="divider" />
      </div>
      <div v-if="!bilibiliLoading && bilibiliList.length === 0" class="empty-state">
        暂无数据
      </div>
    </div>
  </div>
</template>

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

.bilibili-item {
  white-space: normal;
}

.divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 8px;
}

.video-info {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.video-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.video-meta {
  display: flex;
  gap: 10px;
  margin-top: 3px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  align-items: center;
}

.up-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.view-count {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 3px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}
</style>
