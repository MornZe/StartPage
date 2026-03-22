<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

interface SearchEngine {
  name: string
  url: string
  placeholder: string
}

interface Props {
  engines: SearchEngine[]
  currentEngineIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  switch: [index: number]
}>()

const engineRefs = ref<(HTMLElement | null)[]>([])
const bgStyle = ref({ width: '0px', transform: 'translateX(0)' })

const updateBgPosition = () => {
  const activeEl = engineRefs.value[props.currentEngineIndex]
  if (!activeEl) return

  bgStyle.value = {
    width: `${activeEl.offsetWidth}px`,
    transform: `translateX(${activeEl.offsetLeft}px)`
  }
}

onMounted(() => {
  updateBgPosition()
})

watch(() => props.currentEngineIndex, () => {
  nextTick(() => {
    updateBgPosition()
  })
})

const switchEngine = (index: number) => {
  emit('switch', index)
}

const setEngineRef = (el: HTMLElement | null, index: number) => {
  engineRefs.value[index] = el
}
</script>

<template>
  <div class="engines">
    <div
      v-for="(engine, index) in engines"
      :key="engine.name"
      :class="['engine-item', { active: index === currentEngineIndex }]"
      @click="switchEngine(index)"
      :ref="(el) => setEngineRef(el, index)"
    >
      <span class="engine-name">{{ engine.name }}</span>
    </div>
    <div
      class="engine-active-bg"
      :style="bgStyle"
    ></div>
  </div>
</template>

<style scoped>
.engines {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  font-size: 13px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.engine-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.engine-item:hover {
  color: rgba(255, 255, 255, 0.9);
}

.engine-item.active {
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.engine-active-bg {
  position: absolute;
  top: 4px;
  left: 0;
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
