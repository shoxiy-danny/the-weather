# The Weather - 项目规格说明

## 1. Concept & Vision

一个简洁美观的移动端天气网页，展示昨天至未来10天的每日天气概览，以及未来24小时的温度变化曲线。界面以信息密度适中、视觉舒适为导向，让用户一目了然地获取天气信息。

## 2. Design Language

### 2.1 Aesthetic Direction
- **风格**: 玻璃拟态 (Glassmorphism) 风格，柔和的半透明卡片搭配微妙渐变背景
- **参考**: Apple Weather App 的简洁优雅感

### 2.2 Color Palette
```
背景渐变: #1a1a2e → #16213e → #0f3460 (深蓝夜空)
卡片背景: rgba(255, 255, 255, 0.1) (半透明白)
主文字: #ffffff
次文字: rgba(255, 255, 255, 0.7)
强调色: #ffd700 (金色，用于温度高亮)
辅助色: #87ceeb (天蓝色，用于天气图标)
高温色: #ff6b6b (红色)
低温色: #87ceeb (蓝色)
```

### 2.3 Typography
- **主字体**: "Inter", -apple-system, BlinkMacSystemFont, sans-serif
- **温度数字**: "SF Pro Display", "Inter", sans-serif, 700 weight
- **字号**: 温度 48px/72px，标题 18px，正文 14px

### 2.4 Spatial System
- 基础单位: 8px
- 卡片圆角: 16px
- 卡片间距: 16px
- 页面边距: 16px

### 2.5 Motion Philosophy
- 页面加载: 卡片依次淡入上移，stagger 80ms
- 温度曲线: 从左到右绘制动画，600ms ease-out
- 交互反馈: 卡片 hover/press 轻微放大 (scale 1.02)，200ms
- 天气图标: 微妙的上下浮动动画，3s ease-in-out infinite

## 3. Layout & Structure

### 3.1 页面结构 (移动端优先)
```
┌─────────────────────────┐
│      城市选择器          │  ← 上海/北京/广州/深圳
│      (City Selector)    │
├─────────────────────────┤
│      当前天气概览         │  ← 大号温度 + 天气状态 + 位置
│      (Hero Section)      │
├─────────────────────────┤
│      24小时温度曲线       │  ← 折线图，过去2h+未来24h
│      (Hourly Chart)      │
├─────────────────────────┤
│      下周预报列表         │  ← 卡片列表，每项显示：
│      (Daily Forecast)    │    日期、天气图标、天气描述、最高/最低温度
└─────────────────────────┘
```

### 3.2 响应式策略
- 移动端 (< 480px): 单列布局，全宽卡片
- 平板 (480px - 768px): 双列网格
- 桌面 (> 768px): 最大宽度 480px 居中

## 4. Features & Interactions

### 4.1 核心功能

#### 城市选择
- 支持城市: 上海、北京、广州、深圳
- 切换城市后更新所有天气数据
- 选中城市显示天气图标

#### 当前天气显示
- 当前位置名称
- 当前温度 (大字)
- 天气状态文字描述 + 图标

#### 24小时温度曲线
- X轴: 时间 (小时)
- Y轴: 温度 (°C)
- 显示过去2小时 + 未来24小时
- 当前时间用金色虚线标记
- 鼠标悬停显示温度，颜色随温度变化

#### 下周天气预报
- 昨天 + 未来10天 = 共11天
- 每天显示: 星期、日期、天气图标、天气描述、最高温、最低温
- 最低温 < 10°C 蓝色显示
- 最高温 > 20°C 红色显示

### 4.2 温度颜色规则
- 低于 10°C: 蓝色 (#87ceeb)
- 高于 20°C: 红色 (#ff6b6b)
- 其他温度: 默认白色

### 4.3 错误处理
- API 请求失败: 显示友好错误提示 + 重试按钮
- 网络离线: 提示检查网络
- 数据加载中: 加载动画

### 4.4 状态
- `loading`: 数据加载中
- `error`: 错误状态
- `success`: 正常显示数据

## 5. Component Inventory

### 5.1 WeatherCard (通用卡片容器)
- 背景: rgba(255, 255, 255, 0.1)
- 圆角: 16px
- 内边距: 16px
- 状态: default, loading (skeleton)

### 5.2 CurrentWeather
- 大号温度 (72px)
- 天气状态 + 图标
- 位置名称

### 5.3 HourlyChart
- Chart.js 折线图
- 渐变填充
- 触摸交互
- X轴显示时间，Y轴显示温度
- 当前时间线标记

### 5.4 DailyForecastItem
- 左侧: 星期 + 日期
- 中间: 天气图标 + 描述
- 右侧: 最低温 + 最高温

### 5.5 WeatherIcon
- SVG 图标
- 支持: 晴、多云、雨、雪等
- 浮动动画

## 6. Technical Approach

### 6.1 技术栈

**前端**
- 构建工具: Vite
- 框架: React 18
- 图表: Chart.js + react-chartjs-2
- 样式: CSS

**后端**
- 运行时: Node.js
- 框架: Express.js
- 数据库: SQLite (better-sqlite3)
- 架构: RESTful API

### 6.2 项目结构
```
The-Weather/
├── frontend/                    (前端)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── components/
│       │   ├── CurrentWeather.jsx
│       │   ├── HourlyChart.jsx
│       │   ├── DailyForecast.jsx
│       │   └── WeatherIcon.jsx
│       ├── hooks/
│       │   └── useWeather.js
│       ├── services/
│       │   └── weatherApi.js
│       └── utils/
│           └── constants.js
├── backend/                     (后端)
│   ├── package.json
│   ├── server.js              (入口)
│   ├── .env                   (环境变量)
│   ├── database.js             (SQLite)
│   ├── routes/
│   │   └── weather.js         (天气路由)
│   ├── services/
│   │   └── qweather.js        (和风API调用)
│   └── data/
│       └── weather.db         (SQLite数据库)
└── SPEC.md
```

### 6.3 API 设计

**基础URL**: `http://localhost:3000/api`

**接口列表**:

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/weather/:locationId` | 获取指定城市天气数据 |
| GET | `/weather/cities/list` | 获取支持的城市列表 |
| GET | `/health` | 健康检查 |

**数据缓存**:
- SQLite 缓存天气数据 30 分钟
- 减少和风 API 调用次数

### 6.4 环境变量

**后端 (.env)**:
```
PORT=3000
QWEATHER_API_KEY=你的API密钥
QWEATHER_API_HOST=https://你的API Host/v7
```

### 6.5 启动方式

**前端**:
```bash
cd frontend
npm install
npm run dev
```

**后端**:
```bash
cd backend
npm install
npm start
```
