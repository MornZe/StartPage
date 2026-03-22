<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface SearchEngine {
  name: string
  url: string
  placeholder: string
}

interface Props {
  engines: SearchEngine[]
  currentEngineIndex: number
  showSettings?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSettings: false
})

const emit = defineEmits<{
  'engine-switch': [index: number]
  'history-select': [query: string]
  'suggestion-select': [query: string]
  'settings-click': []
}>()

const searchInput = ref('')
const searchFocus = ref(false)
const searchHistory = ref<string[]>([])
const searchSuggestions = ref<string[]>([])
const showSuggestions = ref(false)
const showHistory = ref(false)
const activeSuggestionIndex = ref(-1)

const HISTORY_KEY = 'mornstart_search_history'
const HISTORY_MAX = 10

const currentEngine = computed(() => props.engines[props.currentEngineIndex])

let debounceTimer: number | null = null
let jsonpScript: HTMLScriptElement | null = null

const loadHistory = () => {
  const saved = localStorage.getItem(HISTORY_KEY)
  if (saved) {
    try {
      searchHistory.value = JSON.parse(saved)
    } catch {
      searchHistory.value = []
    }
  }
}

const saveHistory = (query: string) => {
  if (!query.trim()) return
  searchHistory.value = searchHistory.value.filter(item => item !== query)
  searchHistory.value.unshift(query)
  searchHistory.value = searchHistory.value.slice(0, HISTORY_MAX)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem(HISTORY_KEY)
}

const hideDropdowns = () => {
  setTimeout(() => {
    showHistory.value = false
    showSuggestions.value = false
  }, 200)
}

const fetchSuggestions = (query: string) => {
  if (!query.trim()) {
    searchSuggestions.value = []
    showSuggestions.value = false
    return
  }

  if (jsonpScript) {
    jsonpScript.remove()
  }

  jsonpScript = document.createElement('script')
  jsonpScript.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=suggestionCallback`
  document.body.appendChild(jsonpScript)

  jsonpScript.onload = () => {
    showSuggestions.value = searchSuggestions.value.length > 0
    jsonpScript?.remove()
    jsonpScript = null
  }

  jsonpScript.onerror = () => {
    searchSuggestions.value = []
    showSuggestions.value = false
    jsonpScript?.remove()
    jsonpScript = null
  }
}

const onInput = () => {
  showHistory.value = false
  activeSuggestionIndex.value = -1

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = window.setTimeout(() => {
    fetchSuggestions(searchInput.value)
  }, 200)
}

const selectSuggestion = (suggestion: string) => {
  searchInput.value = suggestion
  showSuggestions.value = false
  showHistory.value = false
  saveHistory(suggestion)
  emit('suggestion-select', suggestion)
}

const selectHistory = (item: string) => {
  searchInput.value = item
  showHistory.value = false
  saveHistory(item)
  emit('history-select', item)
}

const handleSearch = () => {
  const q = searchInput.value.trim()
  if (!q) return
  saveHistory(q)
  searchInput.value = ''
  showSuggestions.value = false
  showHistory.value = false
  emit('suggestion-select', q)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' && showSuggestions.value) {
    e.preventDefault()
    activeSuggestionIndex.value = Math.min(activeSuggestionIndex.value + 1, searchSuggestions.value.length - 1)
  } else if (e.key === 'ArrowUp' && showSuggestions.value) {
    e.preventDefault()
    activeSuggestionIndex.value = Math.max(activeSuggestionIndex.value - 1, 0)
  } else if (e.key === 'Enter' && showSuggestions.value && activeSuggestionIndex.value >= 0) {
    e.preventDefault()
    selectSuggestion(searchSuggestions.value[activeSuggestionIndex.value])
  } else if (e.key === 'Escape') {
    showSuggestions.value = false
    showHistory.value = false
  }
}

defineExpose({
  searchInput,
  searchFocus,
  showSuggestions,
  showHistory,
  searchSuggestions,
  searchHistory,
  activeSuggestionIndex,
  clearHistory,
  hideDropdowns,
  handleSearch,
  handleKeydown,
  onInput,
  selectSuggestion,
  selectHistory,
  loadHistory
})

;(window as any).suggestionCallback = (data: { s: string[] }) => {
  searchSuggestions.value = data.s || []
  showSuggestions.value = searchSuggestions.value.length > 0
}
</script>

<template>
  <div class="search-wrapper">
    <div :class="['search', { focus: searchFocus }]">
      <input
        id="search-input"
        v-model="searchInput"
        :placeholder="currentEngine.placeholder"
        autocomplete="off"
        @focus="() => { searchFocus = true; showHistory = searchHistory.length > 0 && !searchInput.trim() }"
        @blur="() => { searchFocus = false; hideDropdowns() }"
        @keydown.enter="handleSearch"
        @input="onInput"
        @keydown="handleKeydown"
      />
      <div class="search-btn" @click="handleSearch">
        <svg width="18" height="18" viewBox="0 0 512 512">
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/>
        </svg>
      </div>
      <div v-if="showSettings" class="settings-btn" @click="emit('settings-click')">
        <Icon icon="mdi:cog" width="18" height="18" />
      </div>
    </div>

    <div v-if="showHistory" class="dropdown history-dropdown">
      <div class="dropdown-header">
        <span>搜索历史</span>
        <button class="clear-btn" @click="clearHistory">清空</button>
      </div>
      <div
        v-for="(item, index) in searchHistory"
        :key="index"
        class="dropdown-item"
        @click="selectHistory(item)"
      >
        {{ item }}
      </div>
    </div>

    <div v-if="showSuggestions" class="dropdown suggestions-dropdown">
      <div
        v-for="(suggestion, index) in searchSuggestions"
        :key="index"
        :class="['dropdown-item', { active: index === activeSuggestionIndex }]"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
  width: 600px;
}

.search {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 999px;
  padding: 4px 6px;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  height: 44px;
}

.search:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

.search.focus {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
}

.search input {
  background: none;
  border: none;
  outline: none;
  color: white;
  padding: 8px 12px;
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  height: 100%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.search input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search.focus input {
  color: #1a1a2e;
  text-shadow: none;
}

.search.focus input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.search-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.search.focus .search-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.settings-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  color: white;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.search.focus .settings-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.search.focus .settings-btn {
  color: #333;
}

.search svg {
  fill: white;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.search.focus svg {
  fill: #333;
  filter: none;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4px;
}

.clear-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.dropdown-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item:hover,
.dropdown-item.active {
  background: rgba(255, 255, 255, 0.15);
}
</style>
