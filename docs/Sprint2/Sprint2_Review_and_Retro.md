# BÁO CÁO SPRINT 2 REVIEW & RETROSPECTIVE
## DỰ ÁN: PETCARE ASSISTANT
- **Sprint:** Sprint 2 - SOS Cấp cứu & Y bạ
- **Thời gian kế hoạch:** 26/10/2026 → 01/11/2026 *(Hoàn thành nghiệm thu thực tế: 08/11/2026)*
- **Sprint Goal:** Hoàn thiện bộ lọc an toàn thú y khẩn cấp, sổ tiêm chủng định kỳ, tự động dời lịch nhắc và tích hợp bản đồ cơ sở thú y.
- **Kết quả bàn giao (Outcome):** ✅ Đạt 100% mục tiêu đề ra — Hoàn thành 5/5 User Stories & Tasks (21 Story Points).

---

## 1. KẾT QUẢ BÀN GIAO CHI TIẾT (SPRINT REVIEW - INCREMENT)
- **[SCRUM-11] [WBS 2.1.2] Triển khai Bộ lọc an toàn Thú y & Cấp cứu SOS (5 SP - Trần Thắng):**
  Xây dựng thành công tầng an toàn y khoa thú y, phân loại cảnh báo đỏ khẩn cấp và chặn đứng các mẹo dân gian nguy hại (Paracetamol, ép uống nước muối gây phù não).
- **[SCRUM-12] [WBS 1.2.1] Quản lý Sổ tiêm chủng & Lịch hẹn Vaccine (5 SP - Đoàn Chí Dũng):**
  Hoàn thiện Sổ y bạ số, tính năng đếm ngược ngày tiêm, đổi màu trạng thái cảnh báo đến hạn (7-30 ngày) và lọc chuẩn xác theo từng bé thú cưng (`petId`).
- **[SCRUM-13] [WBS 3.1.2] Tự động hóa lịch nhắc chu kỳ lặp lại (3 SP - Lê Hữu Thái):**
  Xây dựng thuật toán tự động tính ngày chu kỳ tiếp theo (+1 tháng, +3 tháng) khi bấm hoàn thành lịch hẹn và chuông thông báo âm thanh trên thiết bị.
- **[SCRUM-14] [WBS 2.2.2] Tích hợp Google Places hiển thị trạm xá gần nhất (5 SP - Lê Công Tuấn Kiệt):**
  Tích hợp định vị GPS, công thức tính khoảng cách Haversine và bộ lọc danh sách bệnh viện thú y trực cấp cứu 24/7.
- **[SCRUM-15] [WBS 8.1] Thiết lập CI/CD & Triển khai Railway/Vercel (3 SP - Huỳnh Huy):**
  Đóng gói Docker multi-stage build cho Backend NestJS, định tuyến SPA trên Vercel và triển khai chạy live thành công trên nền tảng Cloud (Railway & Vercel).

---

## 2. RỦI RO & ĐỘ LỆCH TIẾN ĐỘ (BLOCKERS & RISKS ANALYSIS)
- **Độ trễ đóng Sprint (Sprint Overrun):**  
  Sprint theo kế hoạch ban đầu kết thúc vào ngày 01/11/2026, nhưng chính thức hoàn tất thủ tục đóng sprint trên Jira vào ngày 08/11/2026 (trễ 7 ngày).  
  *Nguyên nhân:* Toàn bộ mã nguồn và kiểm thử đã hoàn thành trước đó, độ trễ hoàn toàn mang tính hành chính/thủ tục ghi nhận trên Jira (Administrative delay) chứ không phải do lỗi giao hàng kỹ thuật.
- **Quản lý thay đổi phạm vi (Scope Change):**  
  Không có task nào bị bỏ dở hoặc bị kéo dài sang sprint sau. Gói `SCRUM-15` (CI/CD Railway/Vercel) là phần bổ sung ngoài kế hoạch ban đầu (Out-of-scope addition) nhưng đã được hoàn thành xuất sắc, tạo bệ phóng hạ tầng vững chắc cho toàn bộ dự án.

---

## 3. BIÊN BẢN HỌP CẢI TIẾN (SPRINT RETROSPECTIVE)
### 👍 Điều làm tốt (What went well):
- Quy trình phân nhánh và tích hợp nối tiếp (Sequential Pipeline) giúp **0% merge conflict**.
- Bộ lọc an toàn y khoa hoạt động chính xác, đảm bảo đúng quy chuẩn thú y thực tế.
- Hạ tầng Cloud CI/CD (Vercel & Railway) hoạt động ổn định, mượt mà.

### ⚠️ Điểm cần khắc phục (What could be improved):
- Kỷ luật đóng sprint trên Jira cần chặt chẽ hơn: cần bấm đóng sprint ngay sát ngày kết thúc để giữ chỉ số Velocity chuẩn xác, tránh tạo ra độ trễ biểu kiến.
- Ghi nhận sớm các vướng mắc nhỏ phát sinh lên Jira thay vì chỉ trao đổi qua kênh nội bộ.

### 🎯 Hành động cải tiến cho Sprint 3 (Action Items & Recommendations):
- **Tận dụng hạ tầng Cloud sẵn có:** Đẩy mạnh triển khai các tính năng giá trị gia tăng người dùng (Bản tin Lost & Found xuất Poster QR code, Trợ lý ảo AI Gemini có Guardrail an toàn, Biểu đồ tăng trưởng thể chất).
- **Tuân thủ kỷ luật mốc thời gian:** Đóng sprint đúng hạn để chuẩn bị tốt cho các mốc đánh giá M5–M8 của môn học.
