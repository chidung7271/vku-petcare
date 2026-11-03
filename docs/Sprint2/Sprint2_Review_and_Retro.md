# BIÊN BẢN HỌP SPRINT 2 REVIEW & RETROSPECTIVE
## DỰ ÁN: PETCARE ASSISTANT
- **Thời gian:** 03/11/2026 (09:00 - 10:00)
- **Thành viên tham dự:**
  - Đoàn Chí Dũng (Product Owner / Fullstack)
  - Huỳnh Huy (Scrum Master / DevOps - `huynhhy1511`)
  - Trần Thắng (Backend Developer - `Vodza`)
  - Lê Hữu Thái (Fullstack Developer - `HuuThai127`)
  - Lê Công Tuấn Kiệt (Backend Developer - `botaylun`)

---

## 1. SPRINT REVIEW (ĐÁNH GIÁ SẢN PHẨM)
- **Mục tiêu Sprint (Sprint Goal):** Hoàn thiện phân hệ Cấp cứu SOS an toàn y khoa, Sổ tiêm chủng điện tử, Lịch nhắc chu kỳ và đóng gói Container triển khai Cloud.
- **Kết quả nghiệm thu các User Story:**
  1. `SCRUM-11` (WBS 2.1.2): Bộ lọc an toàn Thú y & Cấp cứu SOS (5 SP) - **DONE**
  2. `SCRUM-12` (WBS 1.2.1): Quản lý Sổ tiêm chủng & Lịch hẹn Vaccine (5 SP) - **DONE**
  3. `SCRUM-13` (WBS 3.1.2): Tự động hóa lịch nhắc chu kỳ lặp lại (3 SP) - **DONE**
  4. `SCRUM-14` (WBS 2.2.2): Tích hợp Google Places hiển thị trạm xá gần nhất (5 SP) - **DONE**
  5. `SCRUM-15` (WBS 8.1): Thiết lập CI/CD & Triển khai Railway/Vercel (3 SP) - **DONE**
- **Tổng Story Points cam kết vs hoàn thành:** 21 / 21 SP (Đạt 100% kế hoạch đề ra).

---

## 2. SPRINT RETROSPECTIVE (CẢI TIẾN QUY TRÌNH)
### 👍 Điều làm tốt (What went well):
- Phân chia công việc theo pipeline nối tiếp giúp **không hề bị merge conflict**.
- Dữ liệu tiêm chủng và cấp cứu có độ tin cậy cao, bám sát nghiệp vụ thú y thực tế.
- Đóng gói Docker multi-stage build giảm dung lượng image đáng kể.

### ⚠️ Điểm cần khắc phục (What could be improved):
- Cần chú ý bảng mã encoding trên terminal Windows để tránh lỗi hiển thị tên tiếng Việt có dấu.
- Cần tiếp tục mở rộng tính năng AI hỗ trợ phân tích hình ảnh và sổ y bạ PDF.

### 🎯 Hành động cho Sprint 3 (Action Items):
- Tích hợp thêm trợ lý ảo AI Gemini có Guardrail an toàn.
- Hoàn thiện tính năng Bản tin tìm thú cưng thất lạc Lost & Found và xuất Poster QR code.
