<script setup lang="ts">
import { ref, watch } from 'vue'

interface HotSearchItem {
  word: string
  index?: number
  isTop?: boolean
  url: string
  hotTag?: string
  newHotName?: string
  labelTagName?: string
}

interface Props {
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

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

watch(
  () => props.visible,
  (val) => {
    if (val && hotSearchList.value.length === 0) {
      loadHotSearch()
    }
  }
)

const selectHotSearch = (item: HotSearchItem) => {
  emit('close')
  window.open(item.url, '_blank')
}
</script>

<template>
  <div v-if="visible" class="dropdown hot-search-dropdown">
    <div class="dropdown-header">
      <span>🔥 百度热榜</span>
      <span class="loading-text" v-if="hotSearchLoading">加载中...</span>
    </div>
    <div
      v-for="(item, index) in hotSearchList"
      :key="index"
      class="dropdown-item hot-search-item"
      @click="selectHotSearch(item)"
    >
      <span class="hot-index" :class="{ 'is-top': item.isTop, 'is-gold': index >= 1 && index <= 3 }">
        {{ item.isTop ? 'TOP' : (index + 1) }}
      </span>
      <span class="hot-word">{{ item.word }}</span>
      <span v-if="item.newHotName" class="hot-tag new">{{ item.newHotName }}</span>
      <span v-else-if="item.labelTagName" class="hot-tag">{{ item.labelTagName }}</span>
    </div>
  </div>
</template>

<style>
/* 全局样式 - 修复生产环境 backdrop-filter 失效
   注意：必须同时保留 backdrop-filter 和 -webkit-backdrop-filter
   且 backdrop-filter 必须放在 -webkit-backdrop-filter 之后 */
.hot-search-dropdown {
  -webkit-backdrop-filter: blur(30px) saturate(1.2);
  backdrop-filter: blur(30px) saturate(1.2);
}
</style>

<style scoped>
.hot-search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px) saturate(1.2);
  -webkit-backdrop-filter: blur(30px) saturate(1.2);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hot-search-dropdown .dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
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
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.hot-search-item {
  display: flex;
  align-items: center;
  gap: 10px;
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

.hot-index.is-top {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
  font-size: 11px;
}

.hot-index.is-gold {
  background: linear-gradient(135deg, #ffd700, #ffb800);
  color: white;
}

.hot-word {
  flex: 1;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 0, 64, 0.2);
  color: #ff4d80;
  flex-shrink: 0;
}

.hot-tag.new {
  background: rgba(0, 180, 0, 0.2);
  color: #4dff88;
}
</style>
