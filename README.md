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

## 📝 模块开发进度

### ✅ 已完成功能 (Completed)
- **公共端**
  - [x] 浏览菜单 (按分类查看)
  - [x] 购物车系统 (添加、修改数量、删除)
  - [x] 购物车数据本地持久化
  - [x] 响应式布局 (适配移动端/桌面端)
- **管理端**
  - [x] 管理后台布局框架
  - [x] 分类管理 (创建、删除)
  - [x] 菜品管理 (创建、编辑、删除、上传图片)
  - [x] 菜品显示时段设置 (早餐/午餐/晚餐/全天)
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
