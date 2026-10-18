# BÁO CÁO SPRINT 1 REVIEW & RETROSPECTIVE
- Thời gian: 05/10/2026 – 19/10/2026 | Dung lượng cam kết: 19 Story Points (Đạt 100%)
- Sprint Goal: Hoàn thành Database, Auth, hồ sơ thú cưng cơ bản và danh bạ trạm xá 24/7.

## 1. Kết quả Bàn giao (Sprint Review - Increment)
- SCRUM-5 (DB & API): Hoàn thành Schemas MongoDB (User, Pet, Clinic), chạy seed data 20 phòng khám thành công.
- SCRUM-6 (Auth): Hoàn tất đăng ký, đăng nhập JWT 2 lớp, mã hóa Bcrypt.
- SCRUM-7 (Pet Profile): Form tạo thú cưng có validation chặn lỗi rỗng và lưu ảnh Pet.
- SCRUM-8 (Danh bạ 24/7): Giao diện danh mục phòng khám có nút gọi điện hotline trực tiếp.
- SCRUM-9 (Testing): 100% kịch bản kiểm thử Acceptance Criteria đạt trạng thái PASS.

## 2. Biên bản Họp Cải tiến (Sprint Retrospective)
- Điều làm tốt (What went well):
  + Cả 5 thành viên đều nhận task và hoàn thành trước hạn chót.
  + Cấu hình liên kết tự động giữa GitHub và Jira hoạt động trơn tru.
- Điều chưa tốt / Khó khăn (What went poorly):
  + Frontend ghép nối API còn chậm do chưa thống nhất sớm định dạng trả về của DTO.
  + Dữ liệu phòng khám ban đầu phải cào thủ công tốn thời gian.
- Hành động cải tiến cho Sprint 2 (Action Items):
  + Viết Swagger API Docs trước khi Frontend bắt tay vào code.
  + Tận dụng Google Places API tự động để giảm tải việc nhập liệu tay.