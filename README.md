# MornStartPage

> 让每一次打开，都是优雅的回归

## 设计理念

市面上不乏功能丰富或设计极简的起始页，但它们大多有一个共同的遗憾：**UI 看似简洁，功能却未必如此**。比如青柠起始页——UI 设计非常棒，但需要热铁盒账号登录，还附带一些看似必备实则刚需不高的功能。

MornStartPage 想提供另一种选择：一个真正内外如一的极简起始页。没有冗余的功能堆砌，没有复杂的配置选项，只有你真正需要的：一个干净的搜索框、实时热榜、一句恰到好处的「一言」，以及一张会说话的 Bing 每日壁纸。

我们相信，好的起始页不应该让你分心，而是帮你快速进入状态，然后安静地退到幕后。

---

![d1b4d83f07c1982f.png](https://fastly.jsdelivr.net/gh/MornZe/Blog-Static-Resource@main/images/d1b4d83f07c1982f.png)
![6215abc0676659e2.png](https://fastly.jsdelivr.net/gh/MornZe/Blog-Static-Resource@main/images/6215abc0676659e2.png)

---

## 快速开始

> 以下步骤面向需要二开或自行部署的开发者。如果你只想使用，直接访问 [在线演示](https://start.zeink.cc)。

**环境要求：** Node.js >= 18.0.0，npm >= 9.0.0

```bash
# 安装依赖
npm install

# 开发模式
npm run dev
# 启动后访问 http://localhost:5173

# 生产构建
npm run build
# 产物输出至 dist/ 目录

# 预览构建
npm run preview
```

## 项目结构

```
StartPage/
├── src/
│   ├── main.ts              # 应用入口
│   ├── App.vue              # 根组件
│   └── components/          # 可复用组件
│       ├── Clock.vue        # 时钟 + 天气
│       ├── EngineSwitch.vue # 搜索引擎切换
│       ├── SearchBox.vue    # 搜索框（带历史/联想）
│       ├── Hitokoto.vue     # 一言
│       ├── BaiduHot.vue     # 百度热榜
│       └── BiliBiliHotCard.vue  # B 站热门
├── api/                     # Vercel Serverless 函数
│   ├── bing-wallpaper.ts
│   ├── hot-search.ts
│   └── bilibili-popular.ts
└── public/                  # 静态资源
```

## 自定义配置

### 更换搜索引擎

编辑 `src/App.vue`，修改 `engines` 数组：

```typescript
const engines: SearchEngine[] = [
  { name: 'Bing', url: 'https://bing.com/search?q=', placeholder: '在 Bing 中搜索...' },
  { name: 'Google', url: 'https://google.com/search?q=', placeholder: 'Google 带你了解世界...' },
  // 添加或修改搜索引擎...
]
```

### 更换背景图片

默认情况下，项目会自动加载 Bing 每日壁纸。如果你想使用自定义图片，编辑 `src/App.vue`，在 `<style>` 中找到 `#bg` 并修改：

```css
#bg {
  background: url('你的图片 URL') center/cover no-repeat;
}
```

同时可以删除 `loadBingBg()` 函数的调用。

### 修改一言分类

编辑 `src/components/Hitokoto.vue` 中的 `loadHitokoto` 函数，调整 API 参数：

```typescript
const res = await fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c')
```

一言分类参数：`a`(动画)、`b`(漫画)、`c`(游戏)、`d`(文学)、`e`(原创)、`f`(来自网络)、`g`(其他)

## 技术栈

- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架（Composition API）
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集

## 部署

项目已配置 Vercel 部署，推送到仓库后会自动构建。

也可使用其他静态托管服务部署 `dist/` 目录。

## 许可证

MIT
