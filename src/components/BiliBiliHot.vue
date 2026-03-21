<script setup lang="ts">
import { ref, watch } from 'vue'
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
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

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

watch(
  () => props.visible,
  (val) => {
    if (val && bilibiliList.value.length === 0) {
      loadBiliBili()
    }
  }
)

const selectBiliBili = (item: BiliBiliItem) => {
  emit('close')
  window.open(`https://www.bilibili.com/video/${item.bvid}`, '_blank')
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}
</script>

<template>
  <div v-if="visible" class="dropdown bilibili-dropdown">
    <div class="dropdown-header">
      <span>📺 B 站综合热门</span>
      <span class="loading-text" v-if="bilibiliLoading">加载中...</span>
    </div>
    <div
      v-for="(item, index) in bilibiliList"
      :key="item.aid"
    >
      <div
        class="dropdown-item bilibili-item"
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
  </div>
</template>

<style>
/* 全局样式 - 修复生产环境 backdrop-filter 失效
   注意：必须同时保留 backdrop-filter 和 -webkit-backdrop-filter
   且 backdrop-filter 必须放在 -webkit-backdrop-filter 之后 */
.bilibili-dropdown {
  -webkit-backdrop-filter: blur(30px) saturate(1.2);
  backdrop-filter: blur(30px) saturate(1.2);
}
</style>

<style scoped>
.bilibili-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px) saturate(1.2);
  -webkit-backdrop-filter: blur(30px) saturate(1.2);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bilibili-dropdown .dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4px;
}

.loading-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.dropdown-item {
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bilibili-item {
  display: flex;
  align-items: center;
  gap: 8px;
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
</style>
