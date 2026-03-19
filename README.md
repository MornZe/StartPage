# MornStartPage

一个基于 Vite + Vue 3 + TypeScript 构建的现代化浏览器起始页。

## 技术栈

- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架（Composition API）
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后在浏览器访问 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

构建产物输出至 `dist/` 目录

### 预览构建

```bash
npm run preview
```

## 项目结构

```
MornStartPage/
├── index.html          # 入口 HTML
├── package.json        # 项目配置与依赖
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 构建配置
└── src/
    ├── main.ts         # 应用入口
    ├── App.vue         # 根组件
    └── components/     # 可复用组件（可选）
```

## 自定义配置

### 更换搜索引擎

编辑 `src/App.vue`，修改 `searchUrl` 变量：

```typescript
const searchUrl = 'https://www.google.com/search?q='
```

### 更换背景图片

编辑 `src/App.vue`，在 `<style scoped>` 中修改 `#bg-layer` 的 `background-image`：

```css
#bg-layer {
  background-image: url('你的图片 URL');
}
```

### 修改一言分类

编辑 `src/App.vue` 中的 `loadHitokoto` 函数，调整 API 参数：

```typescript
const res = await fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c')
```

一言分类参数：`a`(动画)、`b`(漫画)、`c`(游戏)、`d`(文学)、`e`(原创)、`f`(来自网络)、`g`(其他)

## 许可证

MIT
