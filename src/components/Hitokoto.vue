<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Hitokoto {
  hitokoto: string
  from_who: string
  from: string
}

const hitokotoText = ref('正在加载一言...')
const hitokotoFrom = ref('')

const loadHitokoto = async () => {
  try {
    const res = await fetch('https://v1.hitokoto.cn')
    const data: Hitokoto = await res.json()
    hitokotoText.value = data.hitokoto
    hitokotoFrom.value = data.from_who
      ? `—— ${data.from_who}《${data.from}》`
      : `—— 《${data.from}》`
  } catch {
    hitokotoText.value = '保持热爱，奔赴山海'
    hitokotoFrom.value = ''
  }
}

onMounted(() => {
  loadHitokoto()
})
</script>

<template>
  <div class="hitokoto">
    <div class="hitokoto-text">{{ hitokotoText }}</div>
    <div class="hitokoto-from">{{ hitokotoFrom }}</div>
  </div>
</template>

<style scoped>
.hitokoto {
  margin-top: 32px;
  max-width: 500px;
  text-align: center;
  padding: 0 20px;
}

.hitokoto-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hitokoto-from {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
  font-style: italic;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
