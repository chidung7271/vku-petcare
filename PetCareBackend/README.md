# 🐾 PetCare Assistant Backend (NestJS + MongoDB + Mongoose)

Backend RESTful API hoàn chỉnh, chuẩn production phục vụ ứng dụng PWA **PetCare - Trợ Lý Chăm Sóc Thú Cưng**. Hệ thống được thiết kế theo kiến trúc module hóa cao cấp của NestJS, tích hợp bảo mật JWT hai lớp (Access/Refresh), Swagger UI tự động, phân quyền RBAC, kiểm tra an toàn thú y nghiêm ngặt, và trừu tượng hóa đa nhà cung cấp (AI, Vị trí, Lưu trữ).

---

## 🚀 Công nghệ sử dụng

- **Framework:** NestJS 11.x & TypeScript 5.7+
- **Cơ sở dữ liệu:** MongoDB 7.x kết hợp Mongoose 8.x
- **Xác thực & Bảo mật:**
  - JWT (JSON Web Tokens) với Access Token (1 ngày) & Refresh Token (7 ngày)
  - Mật khẩu mã hóa Bcrypt muối 10 vòng
  - `helmet` bảo vệ HTTP headers
  - `@nestjs/throttler` chống brute-force và DDoS (100 req/phút)
- **Chuẩn hóa & Kiểm thử:**
  - `class-validator` & `class-transformer` xác thực DTO
  - Jest Unit Tests (13/13 tests passed: Auth, Pets, Reminders, Emergency Safety)
- **Tài liệu API:** Swagger / OpenAPI 3.0 tại `/api/docs`
- **Docker Ready:** Multi-stage `Dockerfile` và `docker-compose.yml`

---

## 📂 Cấu trúc thư mục

```text
backend/
├── src/
│   ├── ai/                 # Trợ lý AI sức khỏe & an toàn thú y (Mock, Gemini, OpenAI)
│   ├── auth/               # Xác thực JWT, đăng ký, đăng nhập, refresh token, guards
│   ├── common/             # Interceptors chuẩn hóa response, AllExceptionsFilter, decorators
│   ├── community/          # Mạng xã hội thú cưng (bài viết, tương tác like, bình luận)
│   ├── database/           # Script seed dữ liệu mẫu phong phú bằng tiếng Việt
│   ├── emergency/          # Cấp cứu khẩn cấp, phân loại Triage, EmergencySafetyService
│   ├── growth/             # Theo dõi tăng trưởng (cân nặng, album ảnh dòng thời gian)
│   ├── health-records/     # Sổ y bạ điện tử (tiêm chủng, khám bệnh, xét nghiệm, phẫu thuật)
│   ├── knowledge/          # Kho cẩm nang & mẹo chăm sóc thú cưng chuẩn y khoa
│   ├── locations/          # Phòng khám thú y 24/7 & siêu thị phụ kiện thú cưng (Haversine)
│   ├── lost-pets/          # Tìm thú cưng thất lạc, tạo poster khẩn cấp & mã QR
│   ├── medications/        # Quản lý đơn thuốc, liều dùng và lịch uống
│   ├── notifications/      # Hệ thống thông báo đẩy và nhắc việc trong app
│   ├── pets/               # Hồ sơ thú cưng, xác thực quyền chủ sở hữu & xuất sổ y bạ
│   ├── reminders/          # Lịch nhắc hẹn tự động, hỗ trợ lặp lại định kỳ (daily/weekly/monthly)
│   ├── uploads/            # Upload file ảnh (LocalStorageProvider, hỗ trợ mở rộng S3/Cloudinary)
│   ├── users/              # Tài khoản người dùng & phân quyền RBAC (User, Admin)
│   ├── videos/             # Video hướng dẫn chăm sóc, sơ cứu thực tế
│   ├── app.controller.ts   # Endpoint /health kiểm tra trạng thái dịch vụ
│   ├── app.module.ts       # Module gốc kết nối toàn bộ 14 feature modules
│   └── main.ts             # Bootstrap ứng dụng, Swagger, Helmet, CORS, tiền tố /api/v1
├── Dockerfile              # Container hóa production với Node.js 20 Alpine
├── docker-compose.yml      # Orchestration bao gồm NestJS backend và MongoDB 7
├── package.json
└── tsconfig.json
```

---

## 🔑 Tài khoản mẫu (Seed Data)

Sau khi chạy lệnh seed, hệ thống sẽ tạo sẵn 2 tài khoản:

| Quyền hạn | Email | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Chủ thú cưng (User)** | `user@petcare.vn` | `Password123!` | Sở hữu 2 bé: Milo (Golden) & Luna (Mèo Anh) |
| **Quản trị viên (Admin)** | `admin@petcare.vn` | `AdminPass123!` | Quản lý kho bài viết, video, địa điểm |

---

## ⚙️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Khởi chạy bằng Docker Compose (Khuyên dùng)

Chỉ với 1 câu lệnh, toàn bộ Backend và MongoDB sẽ được khởi tạo:

```bash
cd backend
docker-compose up -d --build
```

- API Base: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/health`

### 2. Chạy trực tiếp trên máy chủ / Localhost

**Bước 1: Cài đặt dependencies**
```bash
cd backend
npm install
```

**Bước 2: Cấu hình biến môi trường (`.env`)**
File `.env` đã được cấu hình mặc định:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/petcare
JWT_ACCESS_SECRET=petcare-super-secret-access-token-key-2025
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=petcare-super-secret-refresh-token-key-2025
JWT_REFRESH_EXPIRES_IN=7d
AI_PROVIDER=mock
LOCATION_PROVIDER=mock
STORAGE_PROVIDER=local
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
BASE_URL=http://localhost:3000
```

**Bước 3: Nạp dữ liệu mẫu (Seed)**
```bash
npm run seed
```

**Bước 4: Chạy ở chế độ phát triển (Watch mode)**
```bash
npm run start:dev
```

**Bước 5: Chạy kiểm thử Unit Test**
```bash
npm test
```

---

## 🛡️ Tầng an toàn thú y nghiêm ngặt (Veterinary Safety Layer)

Hệ thống tích hợp lớp phòng hộ `EmergencySafetyService` chặn đứng các nguy cơ y tế sai lệch:
1. **Chặn mẹo dân gian độc hại:**
   - Cấm ép nôn bằng nước muối (nguy cơ phù não do tăng natri).
   - Cấm nuốt trứng sống giải độc (không giải được độc, nguy cơ sặc phổi).
   - Cấm dùng Paracetamol/Panadol cho chó mèo (gây suy gan cấp và tử vong nhanh).
   - Cấm bôi nhớt/dầu hỏa trị xà mâu.
2. **Ưu tiên thời gian vàng:** Phát hiện lập tức các triệu chứng đỏ (*Red Flags*) như nghẹt thở, co giật, nuốt phải bả và hướng dẫn thủ thuật Heimlich thú y hoặc di chuyển đến bệnh viện 24/7 gần nhất.
3. **Miễn trừ y tế tự động:** Mọi kết quả phân loại đều đính kèm cảnh báo pháp lý và y khoa.

---

## 🌐 Danh sách Endpoint API chính (`/api/v1`)

| Module | Phương thức & Đường dẫn | Chức năng |
| :--- | :--- | :--- |
| **Auth** | `POST /auth/register` | Đăng ký tài khoản người dùng |
| **Auth** | `POST /auth/login` | Đăng nhập & cấp cặp JWT token |
| **Auth** | `POST /auth/refresh` | Làm mới Access Token bằng Refresh Token |
| **Auth** | `POST /auth/logout` | Thu hồi refresh token & đăng xuất |
| **Auth** | `GET /auth/me` | Lấy thông tin tài khoản hiện tại |
| **Pets** | `GET /pets` | Danh sách thú cưng của người dùng |
| **Pets** | `POST /pets` | Thêm hồ sơ thú cưng mới |
| **Pets** | `GET /pets/:id/export` | **Xuất toàn bộ sổ y bạ & thông tin sức khỏe** |
| **Growth** | `GET /growth/weights` | Lịch sử cân nặng & biểu đồ tăng trưởng |
| **Growth** | `POST /growth/photos` | Thêm ảnh vào album hành trình lớn lên |
| **Health** | `GET /health-records` | Sổ y bạ (vaccine, khám bệnh, phẫu thuật) |
| **Vaccine**| `GET /vaccinations/upcoming` | Lọc các mũi tiêm sắp đến hẹn (7-30 ngày) |
| **Med** | `GET /medications` | Danh sách đơn thuốc đang điều trị |
| **Reminder**| `POST /reminders/:id/complete`| Hoàn thành & **tự tính ngày nhắc kỳ tiếp theo** |
| **Emergency**| `POST /emergency/triage` | Phân loại cấp cứu khẩn cấp & quy trình sơ cứu |
| **AI** | `POST /ai/chat` | Hỏi đáp trợ lý sức khỏe thú cưng thông minh |
| **Locations**| `GET /locations/nearby` | Tìm phòng khám thú y 24/7 & shop gần nhất (Km) |
| **Lost Pets**| `GET /lost-pets/:id/poster` | Sinh dữ liệu poster thất lạc & mã QR |
| **Community**| `GET /community/posts` | Danh sách bài viết cộng đồng chia sẻ kinh nghiệm |
| **Uploads** | `POST /uploads/image` | Tải ảnh đại diện/y bạ lên máy chủ |
| **System** | `GET /health` | Kiểm tra tình trạng máy chủ |
