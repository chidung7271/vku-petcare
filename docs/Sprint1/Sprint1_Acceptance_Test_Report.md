# BÁO CÁO KẾT QUẢ KIỂM THỬ ACCEPTANCE CRITERIA SPRINT 1
## DỰ ÁN: PETCARE ASSISTANT (WBS 4.2.1 - SCRUM-9)
**Người thực hiện:** Đoàn Chí Dũng (Tester / QA Lead)  
**Thời gian kiểm thử:** 18/10/2026  
**Phạm vi kiểm thử:** Toàn bộ 4 gói công việc cốt lõi thuộc Sprint 1 (SCRUM-5, SCRUM-6, SCRUM-7, SCRUM-8)  
**Tỷ lệ bao phủ AC:** 100% (13/13 Test Cases ĐẠT - PASS)  

---

## 1. MA TRẬN KIỂM THỬ ACCEPTANCE CRITERIA (TEST MATRIX)

| Mã TC | Thuộc Task Jira | Tiêu chí nghiệm thu (AC) | Các bước thực hiện (Test Steps) | Kết quả mong đợi (Expected Result) | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | **SCRUM-5**<br>*(WBS 4.1.1)* | API Server khởi tạo & kết nối Database thành công | Gửi request `GET /health` | Trả về HTTP 200 OK, JSON `{ status: "ok" }`, uptime chạy ổn định | HTTP 200 OK | **PASS** ✅ |
| **TC-02** | **SCRUM-5**<br>*(WBS 4.1.1)* | Thiết kế xong Schema cho 3 bảng: Users, Pets, Clinics | Mở MongoDB Compass kiểm tra Collections | Có đủ 3 collections `users`, `pets`, `locations` với đầy đủ indexes | Đủ 3 collections | **PASS** ✅ |
| **TC-03** | **SCRUM-5**<br>*(WBS 4.1.1)* | Chạy script seed nạp dữ liệu mẫu ban đầu | Chạy lệnh `npm run seed` | Terminal báo nạp thành công tài khoản mẫu, pet mẫu và phòng khám | Seed 100% thành công | **PASS** ✅ |
| **TC-04** | **SCRUM-6**<br>*(WBS 4.1.2)* | Đăng ký tài khoản mới mã hóa Bcrypt & cấp Token | Gửi `POST /api/v1/auth/register` với email mới | Trả về HTTP 201 Created kèm Access/Refresh Token, password được băm 10 vòng | HTTP 201 Created | **PASS** ✅ |
| **TC-05** | **SCRUM-6**<br>*(WBS 4.1.2)* | Bắt lỗi trùng email khi đăng ký | Gửi `POST /api/v1/auth/register` với email đã có | Trả về HTTP 409 Conflict: *"Email này đã được đăng ký"* | HTTP 409 Conflict | **PASS** ✅ |
| **TC-06** | **SCRUM-6**<br>*(WBS 4.1.2)* | Đăng nhập thành công trả về JWT Token | Gửi `POST /api/v1/auth/login` đúng email/pass | Trả về HTTP 200 OK kèm `accessToken` và thông tin `user` | HTTP 200 OK | **PASS** ✅ |
| **TC-07** | **SCRUM-6**<br>*(WBS 4.1.2)* | Báo lỗi khi sai mật khẩu hoặc thiếu trường | Gửi `POST /api/v1/auth/login` với mật khẩu sai | Trả về HTTP 401 Unauthorized: *"Email hoặc mật khẩu không chính xác"* | HTTP 401 Unauthorized | **PASS** ✅ |
| **TC-08** | **SCRUM-7**<br>*(WBS 1.1.1)* | Form nhập liệu đủ các trường Tên, Loài, Giống, Ngày sinh, Cân nặng | Mở Modal "+ Thêm thú cưng" | Hiển thị đầy đủ các input, dropdown chọn Chó/Mèo, cân nặng, ngày sinh | Đầy đủ trường nhập liệu | **PASS** ✅ |
| **TC-09** | **SCRUM-7**<br>*(WBS 1.1.1)* | Chặn submit khi để trống tên hoặc cân nặng $\le 0$ | Bỏ trống tên bấm "Lưu hồ sơ" | Form chặn submit, không gửi dữ liệu rác lên server | Chặn submit thành công | **PASS** ✅ |
| **TC-10** | **SCRUM-7**<br>*(WBS 1.1.1)* | Dữ liệu lưu thành công hiển thị ngay lên danh sách | Điền thông tin bé Milo $\rightarrow$ bấm Lưu | Modal đóng lại, thẻ thú cưng Milo xuất hiện ngay trên màn hình | Thẻ Pet hiển thị tức thì | **PASS** ✅ |
| **TC-11** | **SCRUM-8**<br>*(WBS 2.2.1)* | Danh bạ có thực tế ít nhất 10 phòng khám kèm hotline | Mở trang Danh bạ & Phòng khám | Hiển thị danh sách 12 phòng khám thực tế (Hà Nội, Đà Nẵng, TP.HCM) | 12 phòng khám thật | **PASS** ✅ |
| **TC-12** | **SCRUM-8**<br>*(WBS 2.2.1)* | Bộ lọc riêng cơ sở trực cấp cứu 24/7 | Bấm tab "Cấp cứu 24/7" | Danh sách chỉ lọc ra các bệnh viện có cờ `is247: true` | Lọc chính xác 24/7 | **PASS** ✅ |
| **TC-13** | **SCRUM-8**<br>*(WBS 2.2.1)* | Bấm nút Hotline kích hoạt cuộc gọi trên di động | Bấm nút Hotline trên thẻ phòng khám | Trình duyệt kích hoạt giao thức `tel:0988...` để gọi điện thoại | Kích hoạt `tel:` chuẩn | **PASS** ✅ |

---

## 2. GHI NHẬN LỖI (BUG LOG)
* **Số lỗi nghiêm trọng (Critical/Blocker):** 0
* **Số lỗi giao diện nhỏ (Minor UI):** 0
* **Ghi chú:** Toàn bộ các API và Component UI đều vượt qua các kịch bản kiểm thử biên (Edge Cases).

---

## 3. BIÊN BẢN NGHIỆM THU ĐẠT CHUẨN DEFINITION OF DONE (DoD)

Hội đồng kiểm thử nội bộ xác nhận Sprint 1 đạt đầy đủ các tiêu chuẩn hoàn thành (Definition of Done):
- [x] 100% mã nguồn đã được Review và Merge vào nhánh `main` qua Pull Requests.
- [x] Không còn lỗi biên dịch (Compile Error) ở cả Backend (NestJS) và Frontend (Vite React).
- [x] Toàn bộ 13/13 tiêu chí Acceptance Criteria của 4 task đã được kiểm chứng độc lập.
- [x] Hệ thống sẵn sàng để bấm **"Complete Sprint"** trên Jira và chuyển tiếp sang Sprint 2!

**Xác nhận ký duyệt:** Đoàn Chí Dũng (QA Lead / Product Owner)
