<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface Settings {
  showHitokoto: boolean
  customHitokoto: string
  showWeather: boolean
  weatherCounty: string
  showCustomBg: boolean
  bgType: 'url' | 'file'
  bgUrl: string
  zenMode: boolean
  showBaiduHot: boolean
  showBiliHot: boolean
  showHot60s: boolean
}

const props = defineProps<{
  settings: Settings
  visible: boolean
}>()

const emit = defineEmits<{
  'update:settings': [settings: Settings]
  'update:visible': [visible: boolean]
}>()

// 直接引用 props，不使用 local copy
const settings = ref<Settings>({ ...props.settings })
let isInternalUpdate = false

// 保存设置
const saveSettings = () => {
  if (isInternalUpdate) return
  isInternalUpdate = true
  localStorage.setItem('mornstart_settings', JSON.stringify(settings.value))
  emit('update:settings', { ...settings.value })
  setTimeout(() => { isInternalUpdate = false }, 0)
}

// 监听设置变化并自动保存
watch(settings, () => {
  saveSettings()
}, { deep: true })

// 监听父组件 props 变化并同步
watch(() => props.settings, (newVal) => {
  if (!isInternalUpdate) {
    settings.value = { ...newVal }
  }
}, { deep: true })

// 文件上传处理
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      settings.value.bgUrl = e.target?.result as string
      settings.value.bgType = 'file'
    }
    reader.readAsDataURL(file)
  }
}

// 重置背景
const resetBg = () => {
  settings.value.bgUrl = ''
  settings.value.showCustomBg = false
}

// 关闭面板
const closePanel = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="settings-overlay" @click="closePanel">
        <div class="settings-panel" @click.stop>
          <div class="settings-header">
            <h3>设置</h3>
            <button class="close-btn" @click="closePanel">
              <Icon icon="mdi:close" width="20" height="20" />
            </button>
          </div>

          <div class="settings-content">
            <!-- 60s 热榜开关 -->
            <div class="setting-item">
              <div class="setting-label">
                <Icon icon="mdi:newspaper" width="18" height="18" />
                <span>60s 读懂世界</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.showHot60s" />
                <span class="slider"></span>
              </label>
            </div>

            <!-- 百度热榜开关 -->
            <div class="setting-item">
              <div class="setting-label">
                <Icon icon="simple-icons:baidu" width="18" height="18" />
                <span>百度热榜</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.showBaiduHot" />
                <span class="slider"></span>
              </label>
            </div>

            <!-- B 站热榜开关 -->
            <div class="setting-item">
              <div class="setting-label">
                <Icon icon="simple-icons:bilibili" width="18" height="18" />
                <span>B 站热门</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.showBiliHot" />
                <span class="slider"></span>
              </label>
            </div>

            <!-- 一言开关 -->
            <div class="setting-item">
              <div class="setting-label">
                <Icon icon="mdi:message-text" width="18" height="18" />
                <span>显示一言</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.showHitokoto" />
                <span class="slider"></span>
              </label>
            </div>

            <!-- 自定义一言 -->
            <div class="setting-item setting-item-input">
              <div class="setting-label">
                <Icon icon="mdi:edit" width="18" height="18" />
                <span>自定义一言</span>
              </div>
              <input
                type="text"
                v-model="settings.customHitokoto"
                placeholder="留空则使用默认一言"
                class="setting-input"
              />
            </div>

            <!-- 自定义背景开关 -->
            <div class="setting-item">
              <div class="setting-label">
                <Icon icon="mdi:image" width="18" height="18" />
                <span>自定义背景</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.showCustomBg" />
                <span class="slider"></span>
              </label>
            </div>

            <!-- 背景类型选择 -->
            <div v-if="settings.showCustomBg" class="setting-item setting-item-input">
              <div class="setting-label">
                <Icon icon="mdi:link" width="18" height="18" />
                <span>背景来源</span>
              </div>
              <div class="bg-type-selector">
                <button
                  :class="['type-btn', { active: settings.bgType === 'url' }]"
                  @click="settings.bgType = 'url'"
                >
                  URL
                </button>
                <button
                  :class="['type-btn', { active: settings.bgType === 'file' }]"
                  @click="settings.bgType = 'file'"
                >
                  本地文件
                </button>
              </div>
            </div>

            <!-- 背景 URL 输入 -->
            <div v-if="settings.showCustomBg && settings.bgType === 'url'" class="setting-item setting-item-input">
              <input
                type="url"
                v-model="settings.bgUrl"
                placeholder="输入图片 URL"
                class="setting-input"
              />
            </div>

            <!-- 背景文件上传 -->
            <div v-if="settings.showCustomBg && settings.bgType === 'file'" class="setting-item setting-item-input">
              <div class="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="file-input"
                />
                <button v-if="settings.bgUrl" class="reset-btn" @click="resetBg">
                  <Icon icon="mdi:delete" width="16" height="16" />
                  删除背景
                </button>
              </div>
            </div>

            <!-- Zen 模式 -->
            <div class="setting-item zen-mode">
              <div class="setting-label">
                <Icon icon="mdi:fullscreen" width="18" height="18" />
                <span>Zen 模式</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.zenMode" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="zen-mode-tip">
              <Icon icon="mdi:information" width="14" height="14" />
              <span>开启后只显示搜索框和时间（不含日期）</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.settings-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a2e;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
  color: #666;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.settings-content {
  padding: 16px 20px;
  overflow-y: auto;
  max-height: calc(80vh - 60px);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.setting-item-input {
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.setting-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.2s;
}

.setting-input:focus {
  outline: none;
  border-color: #4a9eff;
  box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background-color: #4a9eff;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* 背景类型选择器 */
.bg-type-selector {
  display: flex;
  gap: 8px;
}

.type-btn {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.type-btn:hover {
  background: rgba(74, 158, 255, 0.1);
  border-color: #4a9eff;
}

.type-btn.active {
  background: #4a9eff;
  color: white;
  border-color: #4a9eff;
}

/* 文件上传 */
.file-upload {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-input {
  flex: 1;
  font-size: 13px;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255, 100, 100, 0.1);
  color: #ff6464;
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(255, 100, 100, 0.2);
}

/* Zen 模式提示 */
.zen-mode {
  margin-bottom: 4px;
}

.zen-mode-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
  padding: 8px 0 0 0;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .settings-panel,
.fade-leave-active .settings-panel {
  transition: transform 0.2s ease;
}

.fade-enter-from .settings-panel,
.fade-leave-to .settings-panel {
  transform: scale(0.95) translateY(-10px);
}
</style>
