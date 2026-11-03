# BÁO CÁO KẾT QUẢ KIỂM THỬ ACCEPTANCE CRITERIA SPRINT 2
## DỰ ÁN: PETCARE ASSISTANT (WBS 8.1 - SCRUM-15)
- **Người thực hiện:** Huỳnh Huy (`huynhhy1511`)
- **Thời gian kiểm thử:** 02/11/2026 - 03/11/2026
- **Phạm vi kiểm thử:** Toàn bộ 5 gói công việc thuộc Sprint 2 (SCRUM-11, SCRUM-12, SCRUM-13, SCRUM-14, SCRUM-15)
- **Tỷ lệ bao phủ AC:** 100% (12/12 Test Cases ĐẠT - PASS)

---

## 1. MA TRẬN KIỂM THỬ ACCEPTANCE CRITERIA SPRINT 2

| Mã TC | Thuộc Task Jira | Tiêu chí nghiệm thu (AC) | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-S2-01** | **SCRUM-11**<br>*(WBS 2.1.2)* | Chặn độc chất Paracetamol cho chó mèo | Nhập triệu chứng sốt và hỏi liều dùng Paracetamol | Hệ thống lập tức trả về cảnh báo nguy cấp cấp độ ĐỎ, cấm dùng | Cảnh báo ĐỎ hiển thị tức thì | **PASS** ✅ |
| **TC-S2-02** | **SCRUM-11**<br>*(WBS 2.1.2)* | Chặn ép uống nước muối gây phù não | Nhập mẹo dân gian "ép uống nước muối cho nôn" | Hệ thống đưa ra khuyến cáo cấm dùng do nguy cơ phù não | Cảnh báo ngăn chặn chính xác | **PASS** ✅ |
| **TC-S2-03** | **SCRUM-11**<br>*(WBS 2.1.2)* | Giao diện Cấp cứu SOS phân màu triệu chứng | Mở màn hình EmergencyView | Triệu chứng phân loại Red/Yellow rõ ràng, nút gọi hotline 1-chạm | UI trực quan, gọi nhanh | **PASS** ✅ |
| **TC-S2-04** | **SCRUM-12**<br>*(WBS 1.2.1)* | Cảnh báo mũi tiêm sắp đến hạn (7-30 ngày) | Mở Sổ y bạ của thú cưng có lịch tiêm ngày 15/11 | Hiển thị nhãn vàng cảnh báo "Sắp đến hẹn tiêm" | Hiển thị nhãn vàng chuẩn | **PASS** ✅ |
| **TC-S2-05** | **SCRUM-12**<br>*(WBS 1.2.1)* | Cảnh báo mũi tiêm quá hạn tái chủng | Mở Sổ y bạ của thú cưng có lịch tiêm ngày 10/10 | Hiển thị nhãn đỏ cảnh báo "Quá hạn tái tiêm" | Hiển thị nhãn đỏ chuẩn | **PASS** ✅ |
| **TC-S2-06** | **SCRUM-12**<br>*(WBS 1.2.1)* | Lọc dữ liệu sức khỏe đúng theo từng Pet ID | Chuyển đổi qua lại giữa bé Milo và bé Lu | Danh sách hồ sơ chỉ hiện đúng dữ liệu của bé đang chọn | Không bị lẫn lộn giữa các pet | **PASS** ✅ |
| **TC-S2-07** | **SCRUM-13**<br>*(WBS 3.1.2)* | Tự động dời lịch lặp khi bấm hoàn thành | Bấm hoàn thành lịch nhắc "Tẩy giun" chu kỳ 3 tháng | Lịch cũ chuyển trạng thái xong, tự động sinh ngày hẹn tiếp theo (+3 tháng) | Tự động dời lịch chính xác | **PASS** ✅ |
| **TC-S2-08** | **SCRUM-13**<br>*(WBS 3.1.2)* | Phát chuông và gửi thông báo nhắc việc | Bấm nút "Thử chuông" trong màn hình Lịch nhắc | Chuông âm thanh vang lên và thông báo thiết bị bật lên | Âm thanh & thông báo OK | **PASS** ✅ |
| **TC-S2-09** | **SCRUM-14**<br>*(WBS 2.2.2)* | Định vị GPS và tính khoảng cách Haversine | Cấp quyền GPS tại Đà Nẵng | Danh sách hiển thị phòng khám kèm khoảng cách km chính xác | Tính km chuẩn xác | **PASS** ✅ |
| **TC-S2-10** | **SCRUM-14**<br>*(WBS 2.2.2)* | Lọc riêng các cơ sở trực cấp cứu 24/7 | Bấm chọn tab "Cấp cứu 24/7" | Chỉ hiển thị các bệnh viện có cờ is247: true | Lọc đúng 100% | **PASS** ✅ |
| **TC-S2-11** | **SCRUM-15**<br>*(WBS 8.1)* | Multi-stage Docker build cho Backend NestJS | Chạy `docker build -t petcare-backend .` | Build thành công image gọn nhẹ, chạy trơn tru cổng 3000 | Image Docker build OK | **PASS** ✅ |
| **TC-S2-12** | **SCRUM-15**<br>*(WBS 8.1)* | SPA routing rewrite trên Vercel | Truy cập trực tiếp đường link con trên Vercel | Không bị lỗi 404 Not Found, chuyển hướng đúng về `index.html` | Rewrite SPA hoạt động tốt | **PASS** ✅ |

---

## 2. KẾT LUẬN & ĐÁNH GIÁ SPRINT 2
- **Tổng số Story Points hoàn thành:** 21 / 21 SP (100% hoàn tất)
- **Tình trạng nghiệm thu:** Đủ điều kiện bấm **"Complete Sprint"** trên Jira và chuyển giao mã nguồn.
