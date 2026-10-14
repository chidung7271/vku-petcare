# 🐾 VKU PetCare - Nền Tảng Chăm Sóc Thú Cưng Thông Minh

Dự án ứng dụng hỗ trợ chăm sóc thú cưng toàn diện dành cho người nuôi thú cưng, tích hợp hồ sơ sức khỏe, lịch hẹn tiêm phòng, cấp cứu khẩn cấp và trợ lý AI thông minh.

---

## 🏗️ Cấu Trúc Dự Án (Project Structure)

Dự án được tổ chức theo mô hình tách biệt rõ ràng giữa Backend và Frontend:

```text
vku-petcare/
├── PetCareBackend/          # Dịch vụ Backend RESTful API (NestJS + MongoDB)
│   ├── src/
│   │   ├── common/          # Bộ lọc lỗi, interceptor, middleware, guard dùng chung
│   │   ├── app.controller.ts# Endpoint health check
│   │   ├── app.module.ts    # Module khởi tạo gốc của NestJS
│   │   └── main.ts          # Bootstrap ứng dụng, Swagger & cấu hình bảo mật
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── PetCareFrontend/         # Giao diện người dùng Web & Mobile PWA (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/      # UI components (Header, BottomNav, Toast, Modals)
│   │   ├── services/        # Tương tác API client và Local Storage
│   │   ├── styles/          # Hệ thống CSS Design System & Theme
│   │   ├── types/           # Định nghĩa TypeScript data models
│   │   ├── App.tsx          # Ứng dụng React gốc
│   │   └── main.tsx         # Điểm khởi chạy React DOM
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 🚀 Hướng Dẫn Khởi Chạy (Getting Started)

### 1. Yêu cầu hệ thống
- **Node.js**: >= 20.x
- **Package Manager**: npm hoặc pnpm
- **MongoDB**: >= 7.x (hoặc MongoDB Atlas Cloud)

### 2. Cài đặt Backend
```bash
cd PetCareBackend
npm install
cp .env.example .env
npm run start:dev
```
Backend sẽ khởi chạy tại: `http://localhost:3000`  
Swagger API Docs: `http://localhost:3000/api/docs`

### 3. Cài đặt Frontend
```bash
cd PetCareFrontend
npm install
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🛠️ Công Nghệ Sử Dụng
- **Backend:** NestJS 11, TypeScript, MongoDB, Mongoose 8, JWT, Helmet, Throttler, Swagger.
- **Frontend:** React 19, TypeScript, Vite, Vanilla CSS Design System, Lucide React Icons.
