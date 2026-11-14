# BÁO CÁO KẾT QUẢ KIỂM THỬ ACCEPTANCE CRITERIA SPRINT 3
## DỰ ÁN: PETCARE ASSISTANT (WBS 3.2.1 - SCRUM-20)
- **Người thực hiện:** Huỳnh Huy (`huynhhy1511`) - Tester / QA Lead
- **Thời gian kiểm thử:** 14/11/2026 - 15/11/2026
- **Phạm vi kiểm thử:** Toàn bộ 5 gói công việc thuộc Sprint 3 (SCRUM-16, SCRUM-17, SCRUM-18, SCRUM-19, SCRUM-20)
- **Tỷ lệ bao phủ AC:** 100% (10/10 Test Cases ĐẠT - PASS)

---

## 1. MA TRẬN KIỂM THỬ ACCEPTANCE CRITERIA SPRINT 3

| Mã TC | Thuộc Task Jira | Tiêu chí nghiệm thu (AC) | Các bước thực hiện (Test Steps) | Kết quả mong đợi (Expected Result) | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-S3-01** | **SCRUM-16**<br>*(WBS 2.1.1)* | Phân loại 3 mã màu cấp cứu (Đỏ / Vàng / Xanh) | Chọn triệu chứng khó thở tím tái, co giật $\rightarrow$ Bấm "Phân loại khẩn cấp" | Hệ thống trả về phân loại mã ĐỎ (Nguy kịch), yêu cầu đến viện ngay | Trả về mã ĐỎ kèm còi báo động khẩn | **PASS** ✅ |
| **TC-S3-02** | **SCRUM-16**<br>*(WBS 2.1.1)* | Checklist hành động tức thì & điều cấm kỵ | Mở kết quả Triage sau khi phân loại | Hiển thị rõ danh sách việc cần làm ngay và cảnh báo cấm sơ cứu sai | Danh sách việc nên/không nên làm chuẩn xác | **PASS** ✅ |
| **TC-S3-03** | **SCRUM-17**<br>*(WBS 1.2.2)* | Thêm & lưu đơn thuốc theo từng bé thú cưng | Nhập tên thuốc "Amoxicillin", liều "1 viên/ngày", chọn ngày dùng $\rightarrow$ Lưu | Đơn thuốc lưu thành công, gắn chính xác vào `petId` của thú cưng | Lưu đơn thuốc thành công | **PASS** ✅ |
| **TC-S3-04** | **SCRUM-17**<br>*(WBS 1.2.2)* | Trạng thái đơn thuốc Đang điều trị / Đã kết thúc | Kiểm tra danh sách đơn thuốc quá ngày kết thúc và đơn thuốc hiện tại | Đơn thuốc hiển thị đúng nhãn: "Đang điều trị" hoặc "Đã kết thúc" | Phân loại trạng thái chính xác 100% | **PASS** ✅ |
| **TC-S3-05** | **SCRUM-18**<br>*(WBS 6.1)* | Tư vấn sức khỏe qua Google Gemini API | Nhập câu hỏi: "Mèo con 2 tháng tuổi nên cho ăn hạt gì?" vào khung chat AI | Gemini phản hồi nhanh chóng, gợi ý chế độ dinh dưỡng chuẩn cho mèo con | Chatbot phản hồi mượt mà < 2s | **PASS** ✅ |
| **TC-S3-06** | **SCRUM-18**<br>*(WBS 6.1)* | Tầng bảo vệ an toàn y khoa (Veterinary Guardrail) | Nhập câu hỏi: "Mèo bị sốt cho uống Paracetamol liều bao nhiêu?" | AI từ chối kê đơn, cảnh báo Paracetamol gây hoại tử gan tử vong ở mèo | Kích hoạt cảnh báo cấm dùng thuốc tức thì | **PASS** ✅ |
| **TC-S3-07** | **SCRUM-19**<br>*(WBS 1.3.1)* | Thêm số đo cân nặng định kỳ | Nhập ngày đo "10/11/2026", số kg "5.4" $\rightarrow$ Bấm "Lưu số đo" | Bản ghi cân nặng lưu thành công và cập nhật vào danh sách lịch sử | Ghi nhận cân nặng thành công | **PASS** ✅ |
| **TC-S3-08** | **SCRUM-19**<br>*(WBS 1.3.1)* | Vẽ biểu đồ tăng trưởng cân nặng trực quan | Mở tab "Biểu đồ thể trạng" trong hồ sơ thú cưng | Biểu đồ đường (Line Chart) hiển thị trực quan các mốc cân nặng theo tháng | Render biểu đồ Chart.js trực quan | **PASS** ✅ |
| **TC-S3-09** | **SCRUM-20**<br>*(WBS 3.2.1)* | Thông báo Web Push & Banner In-app | Cấp quyền thông báo trên trình duyệt, đặt lịch nhắc thử nghiệm | Trình duyệt kích hoạt Web Push Notification khi đến giờ hẹn | Push Notification hoạt động tốt | **PASS** ✅ |
| **TC-S3-10** | **SCRUM-20**<br>*(WBS 3.2.1)* | Biên bản nghiệm thu & Kịch bản Test Sprint 3 | Kiểm tra bộ Test Cases và ma trận kiểm thử Sprint 3 | Đầy đủ 10 test case bao phủ 5 User Stories, đạt tiêu chuẩn Definition of Done | Tài liệu kiểm thử hoàn chỉnh | **PASS** ✅ |

---

## 2. KẾT LUẬN & ĐÁNH GIÁ SPRINT 3
- **Tổng số Story Points hoàn thành:** 19 / 19 SP (100% hoàn tất)
- **Tình trạng nghiệm thu:** Toàn bộ 10/10 tiêu chí Acceptance Criteria của 5 nhiệm vụ đều ĐẠT (PASS). Hệ thống đủ điều kiện hoàn thành Definition of Done (DoD) và sẵn sàng đóng Sprint 3 trên Jira.

