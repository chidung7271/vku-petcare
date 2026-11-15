# BÁO CÁO SPRINT 3 REVIEW & RETROSPECTIVE
## DỰ ÁN: PETCARE ASSISTANT — VKU-PETCARE
- **Sprint:** Sprint 3 – Trợ lý Thông minh AI, Y bạ mở rộng & Tối ưu hóa Toàn diện
- **Thời gian thực hiện:** 09/11/2026 → 15/11/2026 *(Tuần 11 – Tuần 12)*
- **Sprint Goal:** Tích hợp thành công Trợ lý AI Gemini có bộ lọc y tế an toàn, hoàn thiện bảng câu hỏi cấp cứu SOS, quản lý đơn thuốc điều trị, biểu đồ tăng trưởng cân nặng trực quan và trung tâm thông báo đẩy Web Push.
- **Dung lượng cam kết (Commitment):** 19 Story Points
- **Kết quả bàn giao (Outcome):** ✅ Đạt 100% mục tiêu đề ra — Hoàn thành 5/5 User Stories & Tasks (**19 / 19 Story Points**). Toàn bộ 10/10 Acceptance Test Cases đạt trạng thái **PASS**.

---

## 1. KẾT QUẢ BÀN GIAO CHI TIẾT (SPRINT REVIEW - INCREMENT)

### 1.1. [SCRUM-16] [WBS 2.1.1] Bảng câu hỏi sàng lọc mức độ khẩn cấp (5 SP - Trần Quang Thắng)
- **Hạng mục hoàn thành:**
  - Xây dựng giao diện bảng câu hỏi tương tác sàng lọc triệu chứng khẩn cấp tại `EmergencyView.tsx`.
  - Phân loại tức thì theo 3 mã màu cấp cứu chuẩn quốc tế:
    - **Mã ĐỎ (Nguy kịch):** Khó thở, co giật, nuốt dị vật/nghi ngộ độc cấp tính $\rightarrow$ Bật còi báo động khẩn cấp và chuyển hướng ngay sang danh bạ trạm xá 24/7 gần nhất.
    - **Mã VÀNG (Khẩn trương):** Nôn mửa, sốt cao, tiêu chảy kéo dài $\rightarrow$ Hiển thị hướng dẫn theo dõi sát sao trong 2-4 giờ.
    - **Mã XANH (Không khẩn cấp):** Biếng ăn nhẹ, ngứa da, rụng lông $\rightarrow$ Hướng dẫn đặt lịch khám định kỳ.
  - Cung cấp checklist danh sách hành động tức thì (Những việc NÊN LÀM và KHÔNG ĐƯỢC LÀM) để người nuôi không phạm phải các sai lầm nguy hiểm.

### 1.2. [SCRUM-17] [WBS 1.2.2] Quản lý Đơn thuốc & Nhật ký khám chữa bệnh (3 SP - Đoàn Chí Dũng)
- **Hạng mục hoàn thành:**
  - Hoàn thiện module `MedicationsModule` phía Backend NestJS và giao diện quản lý toa thuốc trong `HealthView.tsx`.
  - Hỗ trợ lưu trữ đầy đủ thông tin: Tên thuốc, liều lượng, tần suất uống, ngày bắt đầu, ngày kết thúc và ghi chú của bác sĩ.
  - Tự động phân loại trạng thái điều trị:
    - Nhãn **"Đang điều trị"** (Active): Thuốc còn trong thời gian chỉ định dùng.
    - Nhãn **"Đã kết thúc"** (Completed): Liệu trình điều trị đã hoàn tất, lưu vết lịch sử y bạ.
  - Đảm bảo tính toàn vẹn dữ liệu: Cô lập triệt để theo từng thú cưng (`petId`), ngăn chặn nhầm lẫn đơn thuốc giữa các bé trong cùng tài khoản.

### 1.3. [SCRUM-18] [WBS 6.1] Tích hợp Trợ lý Thông minh AI Health Chatbot (5 SP - Lê Công Tuấn Kiệt)
- **Hạng mục hoàn thành:**
  - Tích hợp Google Gemini API vào backend NestJS (`AiModule`) với độ trễ phản hồi trung bình $< 2.0$ giây.
  - Xây dựng tầng quy chuẩn an toàn thú y (**Deterministic Veterinary Guardrail**):
    - Tự động nhận diện và chặn đứng hoàn toàn các câu hỏi xin liều thuốc độc hại (Paracetamol/Panadol, Aspirin, ép uống nước muối gây phù não).
    - AI tuyệt đối từ chối kê đơn các hoạt chất này và kích hoạt ngay cảnh báo khẩn cấp màu đỏ yêu cầu đưa đến bác sĩ thú y.
  - Tích hợp cơ chế dự phòng ngoại tuyến `MockAIProvider`: Tự động chuyển hướng sang phác đồ chuẩn WSAVA khi gặp sự cố mạng hoặc lỗi Quota `429 Too Many Requests`.

### 1.4. [SCRUM-19] [WBS 1.3.1] Biểu đồ lịch sử theo dõi cân nặng & tăng trưởng trực quan (3 SP - Lê Hữu Thái)
- **Hạng mục hoàn thành:**
  - Xây dựng schema `WeightRecord` và REST API `GrowthModule` phía Backend.
  - Tích hợp biểu đồ đường (Line Chart) mượt mà sử dụng thư viện Chart.js hiển thị biến thiên thể trọng theo từng mốc thời gian.
  - Hỗ trợ ghi nhận nhanh số cân (kg) kèm ngày cân, tự động cảnh báo nếu cân nặng sụt giảm đột ngột $> 10\%$ trong vòng 1 tháng.
  - Bổ sung bộ sưu tập ảnh cột mốc trưởng thành (Milestone Photos) đồng bộ trên giao diện quản lý thú cưng.

### 1.5. [SCRUM-20] [WBS 3.2.1] Hệ thống thông báo đẩy (Web Push) & Kịch bản Test Sprint 3 (3 SP - Huỳnh Ngọc Huy)
- **Hạng mục hoàn thành:**
  - Xây dựng `NotificationsModule` và Trung tâm thông báo (Notification Center) với chuông báo hiệu và bộ đếm số lượng chưa đọc.
  - Tích hợp Web Push API cho phép trình duyệt di động hiển thị thông báo ngay cả khi ứng dụng đang chạy nền.
  - Thực hiện bộ kịch bản kiểm thử nghiệm thu 10/10 Test Cases trong `Sprint3_Acceptance_Test_Report.md` với tỷ lệ đạt **100% PASS**.
  - Kiểm tra toàn bộ 28 bài Unit Tests tự động (`npm test`) trên Backend đạt 100% Green.

---

## 2. PHÂN TÍCH RỦI RO & ĐỘ LỆCH TIẾN ĐỘ (RISKS & SPRINT ANALYSIS)

- **Kiểm soát xung đột mã nguồn (Git Integration):**  
  Khác với các xung đột phát sinh ban đầu ở `app.module.ts`, Sprint 3 áp dụng triệt để chính sách **Sequential Integration Pipeline**. Mỗi nhánh tính năng (`feature/SCRUM-16`, `17`, `18`, `19`, `20`) đều được rebase trực tiếp trên đỉnh `main` và chạy `npm test` thành công trước khi duyệt PR. Kết quả: **0% Merge Conflicts trên `main`**.
- **Kỷ luật thời gian và Vận tốc (Velocity Control):**  
  Nhóm đã rút kinh nghiệm sâu sắc từ độ trễ hành chính của Sprint 2 (delay 7 ngày đóng sprint trên Jira). Ở Sprint 3, PM và QA đã chuẩn bị biên bản nghiệm thu trước 24 giờ và chính thức đóng Sprint 3 trên Jira đúng ngày cam kết **15/11/2026**, giữ vững Velocity lý tưởng **19 Story Points**.

---

## 3. BIÊN BẢN HỌP CẢI TIẾN SPRINT 3 (SPRINT RETROSPECTIVE)

### 👍 Điều làm tốt (What went well):
1. **Chất lượng kỹ thuật vượt trội:** Tích hợp thành công cả AI Gemini thực tế lẫn tầng an toàn y khoa, giải quyết trọn vẹn bài toán then chốt của đề tài.
2. **Quy trình kiểm thử nghiêm ngặt:** Toàn bộ 5 User Stories đều có kịch bản Acceptance Criteria định lượng và bộ Unit Test tự động bao phủ đầy đủ các ca ngoại lệ.
3. **Phối hợp nhóm nhịp nhàng:** Cả 5 thành viên đều hoàn thành đúng định mức Story Points của mình, không còn hiện tượng dồn việc vào những ngày cuối.
4. **Hạ tầng CI/CD phát huy tối đa công năng:** Mã nguồn sau khi merge tự động trigger build và deploy ổn định trên Vercel và Railway mà không cần can thiệp thủ công.

### ⚠️ Điểm cần lưu ý & cải thiện (What could be improved):
1. **Kiểm soát dung lượng lưu trữ ảnh:** Việc tải ảnh cân nặng và avatar thú cưng cần tích hợp giải pháp nén ảnh WebP trên client trước khi upload để tiết kiệm băng thông và dung lượng cloud storage.
2. **Phụ thuộc vào mạng Internet cho AI:** Dù đã có MockAI dự phòng, khi mạng chập chờn trải nghiệm hội thoại thời gian thực vẫn bị ảnh hưởng nhẹ.

### 🎯 Hành động chuẩn bị cho Giai đoạn Đóng dự án & Bảo vệ cuối kỳ (Project Closure & Defense):
1. **Đóng băng mã nguồn (Code Freeze):** Không bổ sung thêm tính năng mới; tập trung 100% nguồn lực vào kiểm thử hồi quy (Regression Testing) và diễn tập kịch bản Live Demo.
2. **Hoàn thiện Gói bằng chứng Quản trị (Evidence Package):** Tổng hợp đầy đủ 8 file chuẩn mực (Final Report, Charter, WBS, Risk Register Excel, Retrospectives, CR-01, UAT Sign-off, Slide Deck) lên thư mục Google Drive.
3. **Chuẩn bị môi trường Demo dự phòng (Backup Plan):** Dựng sẵn bản demo chạy trên local container phòng trường hợp mạng Wi-Fi tại hội đồng bảo vệ bị gián đoạn.
