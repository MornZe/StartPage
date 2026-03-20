<script setup lang="ts">
interface SearchEngine {
  name: string
  url: string
  placeholder: string
}

interface Props {
  engines: SearchEngine[]
  currentEngineIndex: number
}

defineProps<Props>()

const emit = defineEmits<{
  switch: [index: number]
}>()

const switchEngine = (index: number) => {
  emit('switch', index)
}
</script>

<template>
  <div class="engines">
    <div
      v-for="(engine, index) in engines"
      :key="engine.name"
      :class="['engine-item', { active: index === currentEngineIndex }]"
      @click="switchEngine(index)"
    >
      {{ engine.name }}
    </div>
  </div>
</template>

<style scoped>
.engines {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 13px;
  opacity: 0.9;
}

.engine-item {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 6px;
  position: relative;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.engine-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.engine-item.active {
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
}

.engine-item.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 1px;
}
</style>
