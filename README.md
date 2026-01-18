# ProjectM - 餐饮点餐系统

这是一个基于现代 Web 技术栈构建的全栈餐饮点餐应用。包含面向顾客的点餐界面和面向管理员的后台管理系统。

## 🛠 技术栈

### 前端 (Client)
- **核心框架**: React 19 + Vite
- **路由**: React Router v7
- **样式**: Tailwind CSS
- **状态管理**: LocalStorage (购物车)
- **UI 组件**: Headless UI / Heroicons
- **工具**: ESLint, PostCSS

### 后端 (Server)
- **运行时**: Node.js
- **框架**: Express 5
- **数据库**: SQLite
- **ORM**: Prisma IO
- **文件处理**: Multer (图片上传)

## 🚀 快速开始

### 1. 启动后端 (Server)

```bash
cd server
# 安装依赖
npm install
# 数据库迁移 (首次运行或Schema变更时)
npx prisma migrate dev
# 启动开发服务器 (运行在 3000 端口)
npm run dev
```

### 2. 启动前端 (Client)

```bash
cd client
# 安装依赖
npm install
# 启动开发服务器 (运行在 5173 端口)
npm run dev
```

启动后，访问 `http://localhost:5173` 查看应用。

## 📂 项目结构

- `client/`: 前端 React 应用代码
- `server/`: 后端 Node.js API 代码
  - `prisma/`: 数据库 Schema 和迁移文件
  - `routes/`: API 路由定义
  - `uploads/`: 存储上传的产品图片

## 📸 菜品图片规范 (Image Guidelines)
为了保证菜单的视觉美观，上传图片时请遵循以下规范：

- **比例**: 4:3 (横向)
- **尺寸**: 建议 800 x 600 像素
- **格式**: JPG (推荐, 体积小) 或 PNG
- **构图**: 主体居中，四周保留 10-15% 安全边距
- **大小**: 建议控制在 300KB 以内，提升加载速度

## 🧪 测试数据模块 (Test Data Module)

本项目包含一个独立的测试数据生成器，用于快速填充或清理数据库。

### 1. 启用测试数据 (Enable)
运行以下命令插入测试分类和 10+ 道带有仿真图片的菜品：
```bash
node server/scripts/seed.js setup
```
> **注意**: 图片使用 Lorem Flickr 动态生成，无需 API Key。

### 2. 清理测试数据 (Cleanup)
运行以下命令删除所有测试数据（自动清理相关联的订单数据，保障数据库整洁）：
```bash
node server/scripts/seed.js teardown
```

### 3.清空数据库 (Reset/Clear All)
**慎用**: 此命令将删除数据库中的**所有数据**（包括分类、产品、订单等），用于完全重置系统。
```bash
node server/scripts/seed.js clear
```

## 📝 模块开发进度

### ✅ 已完成功能 (Completed) (v1.2)
- **公共端**
  - [x] 浏览菜单 (按分类查看)
  - [x] 购物车系统 (添加、修改数量、删除, 本地持久化)
  - [x] 响应式布局 (适配移动端/桌面端)
  - [x] **国际化支持 (i18n)**: 中英文一键切换 (UI 界面)
  - [x] **夜间模式 (Dark Mode)**: 自动跟随系统 / 手动切换
- **管理端**
  - [x] 管理后台布局框架
  - [x] 分类管理 (创建、删除)
  - [x] 菜品管理 (创建、编辑、删除、上传图片)
  - [x] 菜品管理 (创建、编辑、删除、上传图片)
  - [x] **菜品显示时段设置**: 支持多时段选择 (如: 午餐 & 晚餐)
  - [x] **货币单位**: 人民币 (¥)
- **服务端**
  - [x] RESTful API (CRUD)
  - [x] 数据库设计 (Category, Product, Order)
  - [x] 图片上传处理

### 🚧 待开发/计划中 (Pending/Planned)
- [ ] **用户认证 (Authentication)**
  - 管理员登录保护
  - 顾客登录/注册 (可选)
- [ ] **支付集成**
  - 对接支付网关 (微信/支付宝/Stripe)
- [ ] **订单处理优化**
  - 实时订单通知 (WebSocket)
  - 订单状态流转管理界面
- [ ] **数据分析**
  - 销售报表仪表盘

---
*Created by ProjectM Team*
