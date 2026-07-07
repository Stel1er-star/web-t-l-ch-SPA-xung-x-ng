# BÁO CÁO DỰ ÁN: HỆ THỐNG ĐẶT LỊCH VÀ QUẢN LÝ SPA/PHÒNG KHÁM (SpaProMax)

---

## PHẦN 1: XÂY DỰNG DỰ ÁN

---

### 1. KHẢO SÁT

#### 1.1. Giới thiệu dự án

**SpaProMax** là một hệ thống quản lý Spa & Phòng khám tích hợp đầy đủ chức năng, được xây dựng dưới dạng ứng dụng Web SPA (Single Page Application). Hệ thống phục vụ 3 nhóm đối tượng người dùng:

- **Khách hàng**: Đặt lịch dịch vụ trực tuyến, theo dõi lịch sử và đánh giá dịch vụ.
- **Bác sĩ / Kỹ thuật viên (Doctor/Staff)**: Quản lý lịch làm việc, xử lý lịch hẹn, ghi chú y tế.
- **Quản trị viên (Admin)**: Quản lý toàn bộ hệ thống: nhân sự, dịch vụ, ca làm việc, doanh thu.

**Công nghệ sử dụng:**
| Thành phần | Công nghệ |
|---|---|
| Frontend | HTML5, CSS3, JavaScript thuần (Vanilla JS) |
| Backend | Node.js (Express.js) |
| Cơ sở dữ liệu | MySQL (XAMPP) |
| Xác thực | JWT (JSON Web Token) |
| Bảo mật mật khẩu | bcryptjs |
| Port | 3002 |

---

#### 1.2. Khảo sát hiện trạng

Trước khi có hệ thống, việc quản lý lịch hẹn tại spa/phòng khám thường được thực hiện thủ công (sổ sách, điện thoại), gây ra các vấn đề:

- Khó theo dõi lịch hẹn cho nhiều bác sĩ/KTV cùng lúc.
- Dễ xảy ra trùng lịch, gây mất uy tín.
- Khó thống kê doanh thu và đánh giá hiệu suất nhân sự.
- Khách hàng không chủ động trong việc đặt và theo dõi lịch hẹn.

**Hệ thống SpaProMax** ra đời nhằm giải quyết toàn bộ các vấn đề trên thông qua một nền tảng số tập trung.

---

#### 1.3. Đặc tả yêu cầu chức năng (FR)

##### 1.3.1. Bảng yêu cầu chức năng

| Mã FR | Tên chức năng | Mô tả chi tiết | Actor |
|---|---|---|---|
| FR_01 | Đăng ký tài khoản | Khách hàng tạo tài khoản mới. Các trường: `username` (bắt buộc, duy nhất), `password` (bắt buộc, ≥ 6 ký tự), `name` (bắt buộc), `email` (tùy chọn, duy nhất, định dạng email chuẩn), `phone` (tùy chọn). Hệ thống kiểm tra trùng lặp username và email. Trả về JWT token sau khi thành công. | Customer |
| FR_02 | Đăng nhập | Người dùng đăng nhập bằng `username` + `password`. Cả hai trường đều bắt buộc. Hệ thống xác thực bằng bcrypt. Nếu sai thông tin → lỗi 401. Nếu tài khoản bị vô hiệu hóa → lỗi 403. Thành công → trả về JWT token và thông tin người dùng. | Tất cả |
| FR_03 | Xem danh sách dịch vụ | Hiển thị danh sách tất cả dịch vụ đang hoạt động (`is_active = 1`). Mỗi dịch vụ gồm: tên, danh mục (medical/spa), thời lượng (phút), giá (VNĐ), mô tả, hình ảnh. Hỗ trợ lọc theo `category`. | Customer, Tất cả |
| FR_04 | Đặt lịch hẹn (Wizard 4 bước) | Khách hàng đặt lịch theo trình tự có hướng dẫn: **Bước 1** Chọn dịch vụ (kèm tìm kiếm và lọc tab) → **Bước 2** Chọn bác sĩ/KTV được phân công cho dịch vụ đó (kèm tìm kiếm) → **Bước 3** Chọn ngày trên lịch (tô màu ngày có ca) & chọn khung giờ trống → **Bước 4** Xác nhận đầy đủ thông tin & ghi chú tuỳ chọn & chọn đặt có/không đặt cọ. Nếu đặt cọ: hiển thị modal thanh toán với mã chuyển khoản. Hệ thống kiểm tra xung đột lịch (`checkConflict`). Nếu trùng giờ → lỗi 409. Gửi thông báo tự động cho bác sĩ và admin. Sau khi đặt thành công: hiển thị màn hình thành công (Bước 5). | Customer |
| FR_05 | Xem lịch hẹn của tôi | Khách hàng xem danh sách lịch hẹn cá nhân. Hệ thống chỉ trả về lịch của đúng khách hàng đang đăng nhập (phân quyền qua JWT). Hỗ trợ lọc theo `status`, `date`. | Customer |
| FR_06 | Hủy lịch hẹn | Khách hàng hủy lịch hẹn của mình. Logic hoàn tiền: nếu hủy trước 24 giờ → hoàn cọc (`depositRefunded = 1`). Khách hàng chỉ được hủy lịch của chính mình. Bắt buộc nhập `cancel_reason`. | Customer |
| FR_07 | Đánh giá dịch vụ | Sau khi lịch hẹn hoàn thành (`completed`), khách hàng đánh giá. Trường bắt buộc: `rating` (1–5 sao, kiểm tra `CHECK (rating BETWEEN 1 AND 5)`). Trường tùy chọn: `comment`, `tags`. Mỗi lịch hẹn chỉ được đánh giá 1 lần (`appointmentId UNIQUE`). Khách hàng phải là chủ lịch hẹn mới được đánh giá (`customerId` phải khớp). | Customer |
| FR_08 | Like đánh giá | Người dùng đã đăng nhập có thể bấm "like" một đánh giá. Số lượt like tăng lên 1 sau mỗi lần bấm. | Tất cả |
| FR_09 | Xem lịch làm việc (Doctor) | Bác sĩ/KTV xem ca làm việc của mình theo ngày trong tuần. Hệ thống hiển thị các ca (`Shifts`) và các lịch hẹn trong ngày tương ứng. Chỉ xem được lịch của chính mình (phân quyền). | Doctor |
| FR_10 | Cập nhật trạng thái lịch hẹn (Doctor) | Bác sĩ cập nhật trạng thái: `confirmed` → `in-progress` → `completed`. Không được phép đổi sang `cancelled` hay `pending`. Có thể thêm `medicalNote` (ghi chú y tế) khi hoàn thành. | Doctor |
| FR_11 | Phản hồi đánh giá (Doctor) | Bác sĩ/KTV phản hồi đánh giá của khách hàng (`staffReply`). Chỉ phản hồi đánh giá liên quan đến mình (`staffId` khớp). | Doctor |
| FR_12 | Yêu cầu đổi ca (3 bước) | **Bước 1**: Bác sĩ A gửi yêu cầu trực hộ/đổi ca cho Bác sĩ B, kèm ngày bận (`date`), ca bận (`shiftId`), lý do (`reason`). Hệ thống gửi thông báo cho B. **Bước 2**: Bác sĩ B chấp nhận (`accepted`) hoặc từ chối (`rejected`). Nếu accepted → hệ thống gửi thông báo cho A và Admin. **Bước 3**: Admin phê duyệt (`approved`) hoặc từ chối (`declined`). Nếu approved → hệ thống **tự động chuyển toàn bộ lịch hẹn** của ngày đó sang bác sĩ B và gửi thông báo cho cả khách hàng. Hỗ trợ cả trường hợp đổi ca chéo (mutual swap) với `targetDate`/`targetShiftId`. | Doctor, Admin |
| FR_13 | Quản lý ca làm việc (Admin) | Admin tạo, sửa, xóa ca làm việc cho từng bác sĩ/KTV. Ca làm việc gồm: `staffId`, `day` (Mon/Tue/Wed/Thu/Fri/Sat/Sun), `startTime`, `endTime`. Admin xem toàn bộ danh sách yêu cầu đổi ca và duyệt/từ chối. | Admin |
| FR_14 | Quản lý dịch vụ (Admin) | Admin thêm, sửa, xóa dịch vụ. Các trường bắt buộc khi tạo: `name`, `category`, `duration`, `price`. Trường tùy chọn: `description`, `image_url`, `icon`. Admin phân công bác sĩ/KTV cho từng dịch vụ qua `ServiceStaff` (quan hệ nhiều-nhiều). Cập nhật danh sách phân công bằng cách ghi đè toàn bộ (`DELETE` cũ + `INSERT` mới). | Admin |
| FR_15 | Quản lý nhân sự (Admin) | Admin tạo, cập nhật, vô hiệu hóa (`is_active = 0`) tài khoản bác sĩ/KTV. Quản lý thông tin: tên, email, chuyên môn (`specialty`), tiểu sử (`bio`). Xem và cập nhật danh sách dịch vụ của từng bác sĩ. | Admin |
| FR_16 | Dashboard & Thống kê (Admin) | Admin xem dashboard tổng quan gồm: tổng lịch hẹn, lịch hẹn hôm nay, tổng doanh thu (`status=completed`), số khách hàng, số nhân viên, điểm đánh giá TB, số lịch chờ xử lý, biểu đồ doanh thu 6 tháng, phân phối theo dịch vụ, theo trạng thái, 10 lịch hẹn gần đây nhất. | Admin |
| FR_17 | Báo cáo doanh thu chi tiết (Admin) | Admin xem báo cáo theo năm/tháng. Bao gồm: doanh thu theo từng tháng trong năm, doanh thu theo dịch vụ, doanh thu theo bác sĩ (kèm đánh giá TB), top 5 khách hàng chi tiêu nhiều nhất, tổng kết kỳ (tổng lịch, doanh thu, số lịch đặt cọc, số lịch hủy). | Admin |
| FR_18 | Quản lý đánh giá (Admin) | Admin xem toàn bộ đánh giá trong hệ thống, lọc theo `staffId`, `serviceId`, `rating`. Admin có thể thay mặt phản hồi đánh giá. | Admin |
| FR_19 | Hệ thống thông báo | Tự động gửi thông báo trong các sự kiện: đặt lịch mới, xác nhận lịch, đổi ca, kết quả phê duyệt đổi ca, thay đổi bác sĩ tiếp quản (do đổi ca). Người dùng xem 20 thông báo gần nhất, đếm số chưa đọc, đánh dấu đã đọc 1 thông báo hoặc tất cả. | Tất cả |
| FR_20 | Cập nhật hồ sơ cá nhân | Người dùng cập nhật thông tin: tên, email, số điện thoại, tiểu sử. Bác sĩ có thêm trường chuyên môn. Kiểm tra email trùng lặp (trừ email hiện tại của mình). | Tất cả |
| FR_21 | Đổi mật khẩu | Người dùng đổi mật khẩu: nhập mật khẩu cũ, mật khẩu mới (≥ 6 ký tự). Hệ thống xác thực mật khẩu cũ (bcrypt) trước khi cập nhật. | Tất cả |
| FR_22 | Tải lên ảnh đại diện | Người dùng tải ảnh đại diện (multipart/form-data). File lưu tại `/uploads/avatars/`, đường dẫn lưu vào `image_url` trong bảng Users. | Tất cả |
| FR_23 | Tìm kiếm & Lọc dịch vụ (trong đặt lịch) | Tại Bước 1 của luồng đặt lịch, khách hàng có thể: (1) Đánh vào **thanh tìm kiếm** (`#svc-search`) – lọc realtime theo tên dịch vụ. (2) Click **tab danh mục**: Tất Cả / Y Tế (`medical`) / Spa (`spa`) – lọc theo category. Hai bộ lọc hoạt động kết hợp đồng thời (`applySvcFilters`). Kết quả hiển thị dạng lưới (3 cột). | Customer |
| FR_24 | Tìm kiếm Bác sĩ/KTV (trong đặt lịch) | Tại Bước 2 của luồng đặt lịch, khách hàng nhập từ khóa vào **ô tìm kiếm** (`#doc-search`) – lọc realtime theo tên (`name`) và chuyên môn (`specialty`) của bác sĩ. Danh sách bác sĩ được reset khi quay lại chọn dịch vụ mới. Mỗi thẻ bác sĩ hiển thị: ảnh đại diện, tên, chuyên môn, điểm đánh giá (★), số lượt đánh giá, tiểu sử ngắn. | Customer |
| FR_25 | Xem khung giờ trống (Slot Availability) | Tại Bước 3, sau khi chọn ngày trên lịch, hệ thống tự động gọi API lấy các khung giờ của bác sĩ trong ngày đó. Mỗi slot có trường `available` (bool): nếu `true` → hiển thị màu xanh (chọn được); nếu `false` → hiển thị xám "Bận" (không nhấn được). Lịch hiển thị các ngày có ca làm việc bằng màu xanh lá (`has-shift`). Chỉ cho phép chọn ngày trong vòng 60 ngày tới. Nếu bác sĩ không làm việc ngày đó: hiển thị thông báo và gợi ý các ngày làm việc. | Customer |

##### 1.3.2. Yêu cầu phi chức năng

| Mã NFR | Tên | Mô tả |
|---|---|---|
| NFR_01 | Bảo mật | Mật khẩu được mã hóa bcrypt (salt rounds 10). Xác thực API bằng JWT (expiresIn: 7d). Phân quyền theo role (admin/doctor/customer) qua middleware `authorize`. |
| NFR_02 | Hiệu năng | Truy vấn DB được tối ưu bằng INDEX (`idx_date_staff`, `idx_customer`, `idx_status`, `idx_user_read`). Giới hạn 20 thông báo gần nhất để tránh tải nặng. |
| NFR_03 | Tính toàn vẹn dữ liệu | Đổi ca dùng Database Transaction (BEGIN/COMMIT/ROLLBACK) để đảm bảo đồng bộ khi chuyển lịch hẹn. |
| NFR_04 | Tính khả dụng | Server chạy liên tục trên port 3002. Có health check endpoint `/api/health`. |
| NFR_05 | Khả năng mở rộng | Kiến trúc MVC rõ ràng (controllers/models/routes tách biệt), dễ thêm chức năng mới. |
| NFR_06 | Trải nghiệm người dùng | Giao diện SPA (Single Page Application), không tải lại trang. Mỗi vai trò có dashboard riêng. |
| NFR_07 | Tương thích | Frontend phục vụ trực tiếp qua Express static, hỗ trợ CORS cho localhost (port 5500, 3000, 8080). |

##### 1.3.3. Quy tắc nghiệp vụ

| Mã BRU | Quy tắc |
|---|---|
| BRU_01 | Một lịch hẹn chỉ được đặt nếu bác sĩ/KTV có ca làm việc vào ngày và giờ đó. |
| BRU_02 | Không được đặt lịch trùng giờ với bác sĩ/KTV khi đang có lịch chưa hoàn thành (`checkConflict`). |
| BRU_03 | Chỉ hoàn tiền cọc nếu hủy lịch trước 24 giờ so với giờ hẹn. |
| BRU_04 | Khách hàng chỉ được đánh giá sau khi lịch hẹn có trạng thái `completed` và phải là người đặt lịch đó. |
| BRU_05 | Mỗi lịch hẹn chỉ được đánh giá 1 lần (ràng buộc UNIQUE trên `appointmentId`). |
| BRU_06 | Trạng thái lịch hẹn chỉ chuyển theo chiều xuôi: `pending` → `confirmed` → `in-progress` → `completed`. Hủy (`cancelled`) là ngoại lệ, chỉ Customer và Admin thực hiện được. |
| BRU_07 | Username và email phải là duy nhất trong toàn hệ thống. |
| BRU_08 | Bác sĩ chỉ xem và quản lý lịch hẹn được phân công cho mình; không được hủy lịch. |
| BRU_09 | Admin có toàn quyền thay đổi mọi trạng thái lịch hẹn. |
| BRU_10 | Quy trình đổi ca phải qua 3 bước: Bác sĩ A tạo yêu cầu → Bác sĩ B đồng ý → Admin phê duyệt. Thiếu bất kỳ bước nào thì lịch hẹn không được chuyển. |
| BRU_11 | Khi Admin phê duyệt đổi ca, hệ thống tự động chuyển toàn bộ lịch hẹn chưa hoàn thành/hủy của ngày đó sang bác sĩ tiếp quản và gửi thông báo cho khách hàng. |
| BRU_12 | Bác sĩ không được gửi yêu cầu đổi ca cho chính mình (`requesterId ≠ targetId`). |
| BRU_13 | Admin chỉ phân công dịch vụ cho bác sĩ/KTV (role = doctor). Cập nhật bằng cách ghi đè toàn bộ danh sách phân công. |
| BRU_14 | Lịch chọn ngày trong đặt lịch chỉ cho phép chọn ngày trong phạm vi tới 60 ngày tới (tính từ hôm nay). Ngày quá khứ và quá 60 ngày → disabled (không chọn được). |
| BRU_15 | Thanh tìm kiếm dịch vụ và tab danh mục hoạt động kết hợp: lọc theo cả tên và danh mục cùng lúc. |

---

### 2. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

#### 2.1. Phân tích nghiệp vụ (Use Case Tổng Quát)

##### Xác định Actor

| Actor | Mô tả |
|---|---|
| **Customer** (Khách hàng) | Người dùng cuối, sử dụng dịch vụ spa/phòng khám. Đăng ký, đăng nhập, đặt lịch, đánh giá, like đánh giá. |
| **Doctor/Staff** (Bác sĩ/KTV) | Nhân viên cung cấp dịch vụ. Xem lịch làm việc, cập nhật lịch hẹn, ghi chú y tế, yêu cầu đổi ca, phản hồi đánh giá. |
| **Admin** (Quản trị viên) | Người quản lý hệ thống. Quản lý nhân sự, dịch vụ, ca làm việc, duyệt đổi ca, xem thống kê/báo cáo. |
| **System** (Hệ thống) | Gửi thông báo tự động, kiểm tra xung đột lịch, thực thi chuyển lịch hẹn khi đổi ca được duyệt. |

##### Mô tả Use Case

**UC_01 – Đăng ký / Đăng nhập**
- Actor: Customer
- Tiền điều kiện: Chưa có tài khoản (đăng ký) / Đã có tài khoản (đăng nhập)
- Luồng chính: Nhập thông tin → Hệ thống validate → Tạo/Xác thực tài khoản → Trả về JWT token
- Luồng thay thế: Username/Email đã tồn tại → Thông báo lỗi

**UC_02 – Đặt lịch hẹn**
- Actor: Customer
- Tiền điều kiện: Đã đăng nhập
- Luồng chính: Chọn dịch vụ → Chọn bác sĩ → Chọn ngày (có ca làm việc) → Chọn khung giờ trống → Xác nhận → Hệ thống tạo lịch hẹn + gửi thông báo
- Luồng thay thế: Giờ trống không còn → Thông báo xung đột → Chọn giờ khác

**UC_03 – Quản lý lịch hẹn (Doctor)**
- Actor: Doctor/Staff
- Tiền điều kiện: Đã đăng nhập với role `doctor`
- Luồng chính: Xem danh sách lịch được phân công → Xác nhận/Bắt đầu/Hoàn thành → Thêm ghi chú y tế
- Ràng buộc: Chỉ xem lịch của chính mình

**UC_04 – Quản trị hệ thống (Admin)**
- Actor: Admin
- Tiền điều kiện: Đã đăng nhập với role `admin`
- Luồng chính: Xem dashboard thống kê → Quản lý dịch vụ / nhân sự / ca làm việc

##### Biểu đồ Use Case tổng quát

```
┌──────────────────────────────────────────────────────────────────┐
│                      HỆ THỐNG SPAPROMAX                          │
│                                                                  │
│  ┌───────────────┐    ┌────────────────────────────────────────┐ │
│  │   Customer    │    │         Chức năng Customer             │ │
│  │               │───▶│  (UC01) Đăng ký tài khoản             │ │
│  │               │───▶│  (UC02) Đăng nhập                     │ │
│  │               │───▶│  (UC03) Xem danh sách dịch vụ         │ │
│  │               │───▶│  (UC04) Đặt lịch hẹn (booking)        │ │
│  │               │───▶│  (UC05) Xem lịch hẹn cá nhân          │ │
│  │               │───▶│  (UC06) Hủy lịch hẹn                  │ │
│  │               │───▶│  (UC07) Đánh giá dịch vụ              │ │
│  │               │───▶│  (UC08) Like đánh giá                 │ │
│  └───────────────┘    └────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────┐    ┌────────────────────────────────────────┐ │
│  │  Doctor/Staff │───▶│  (UC09) Xem lịch làm việc (schedule)  │ │
│  │               │───▶│  (UC10) Xem & xử lý lịch hẹn          │ │
│  │               │───▶│  (UC11) Cập nhật trạng thái + ghi chú │ │
│  │               │───▶│  (UC12) Phản hồi đánh giá             │ │
│  │               │───▶│  (UC13) Gửi yêu cầu đổi ca            │ │
│  │               │───▶│  (UC14) Chấp nhận/Từ chối yêu cầu     │ │
│  └───────────────┘    └────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────┐    ┌────────────────────────────────────────┐ │
│  │     Admin     │───▶│  (UC15) Xem dashboard thống kê        │ │
│  │               │───▶│  (UC16) Xem báo cáo doanh thu         │ │
│  │               │───▶│  (UC17) Quản lý nhân sự (CRUD)        │ │
│  │               │───▶│  (UC18) Phân công dịch vụ cho bác sĩ  │ │
│  │               │───▶│  (UC19) Quản lý dịch vụ (CRUD)        │ │
│  │               │───▶│  (UC20) Quản lý ca làm việc (CRUD)    │ │
│  │               │───▶│  (UC21) Duyệt/Từ chối yêu cầu đổi ca │ │
│  │               │───▶│  (UC22) Quản lý lịch hẹn              │ │
│  │               │───▶│  (UC23) Xem đánh giá toàn hệ thống    │ │
│  └───────────────┘    └────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────┐    ┌────────────────────────────────────────┐ │
│  │    Tất cả     │───▶│  (UC24) Xem & quản lý thông báo       │ │
│  │               │───▶│  (UC25) Cập nhật hồ sơ cá nhân        │ │
│  │               │───▶│  (UC26) Đổi mật khẩu                  │ │
│  │               │───▶│  (UC27) Tải ảnh đại diện              │ │
│  └───────────────┘    └────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

#### 2.2. Phân tích cấu trúc (Class Diagram)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              CLASS DIAGRAM – SpaProMax                            │
└──────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐          ┌─────────────────┐          ┌──────────────────┐
│    Users    │          │   Appointments   │          │    Services      │
├─────────────┤    1..*  ├─────────────────┤  *..1    ├──────────────────┤
│ id (PK)     │◄────────│ id (PK)          │──────────│ id (PK)          │
│ username    │          │ customerId (FK)  │          │ name             │
│ password    │    1..*  │ staffId (FK)     │          │ category         │
│ role        │◄────────│ serviceId (FK)   │          │ duration (min)   │
│ name        │          │ date             │          │ price            │
│ email       │          │ time             │          │ description      │
│ phone       │          │ status           │          │ image_url        │
│ specialty   │          │ note             │          │ icon             │
│ bio         │          │ medicalNote      │          │ is_active        │
│ image_url   │          │ cancel_reason    │          └──────────────────┘
│ is_active   │          │ depositPaid      │                  │
│ createdAt   │          │ depositRefunded  │                  │ nhiều-nhiều
└─────────────┘          │ price            │                  │
       │                 │ createdAt        │          ┌──────────────────┐
       │ 1..*            │ updatedAt        │          │  ServiceStaff    │
       ▼                 └─────────────────┘          ├──────────────────┤
┌──────────────┐                 │ 1..1               │ serviceId (PK,FK)│
│    Shifts    │          ┌──────▼──────────┐         │ staffId (PK,FK)  │
├──────────────┤          │    Reviews      │         └──────────────────┘
│ id (PK)      │          ├─────────────────┤
│ staffId (FK) │          │ id (PK)         │
│ day          │          │ appointmentId   │         ┌──────────────────┐
│ startTime    │          │ customerId (FK) │         │  Notifications   │
│ endTime      │          │ staffId (FK)    │         ├──────────────────┤
└──────────────┘          │ serviceId (FK)  │         │ id (PK)          │
                          │ rating (1-5)    │         │ userId (FK)      │
                          │ comment         │         │ title            │
                          │ tags            │         │ message          │
                          │ staffReply      │         │ type             │
                          │ likes           │         │ isRead           │
                          │ createdAt       │         │ link             │
                          └─────────────────┘         │ createdAt        │
                                                      └──────────────────┘
```

---

#### 2.3. Thiết kế CSDL chi tiết (ERD & Các bảng dữ liệu)

##### Sơ đồ ERD

```
Users ──────────────────────── Appointments ──────────────── Services
  │  (customerId, staffId)                    (serviceId)        │
  │                                                              │
  │ (staffId)                                                    │ (nhiều-nhiều)
  │                                                              │
Shifts                    Reviews ◄─── Appointments        ServiceStaff
                          (1 lịch: 1 đánh giá)           (staffId, serviceId)

Users ──── Notifications
  (userId)
```

##### Chi tiết các bảng dữ liệu

**Bảng `Users`**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | VARCHAR(50) | PK, NOT NULL | Mã người dùng |
| `username` | VARCHAR(100) | NOT NULL, UNIQUE | Tên đăng nhập (duy nhất) |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu (bcrypt) |
| `role` | ENUM('admin','doctor','customer') | NOT NULL, DEFAULT 'customer' | Vai trò |
| `name` | VARCHAR(200) | NOT NULL | Họ tên đầy đủ |
| `email` | VARCHAR(200) | UNIQUE, NULL | Địa chỉ email (duy nhất) |
| `phone` | VARCHAR(20) | NULL | Số điện thoại |
| `specialty` | VARCHAR(200) | NULL | Chuyên môn (dành cho doctor) |
| `bio` | TEXT | NULL | Tiểu sử giới thiệu |
| `image_url` | VARCHAR(500) | NULL | Đường dẫn ảnh đại diện |
| `is_active` | TINYINT(1) | NOT NULL, DEFAULT 1 | Trạng thái kích hoạt |
| `createdAt` | DATETIME | NOT NULL, DEFAULT NOW() | Thời gian tạo |

**Bảng `Services`**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | Mã dịch vụ |
| `name` | VARCHAR(200) | NOT NULL | Tên dịch vụ |
| `category` | ENUM('medical','spa') | NOT NULL, DEFAULT 'spa' | Danh mục |
| `duration` | INT | NOT NULL | Thời lượng (phút) |
| `price` | BIGINT | NOT NULL | Giá dịch vụ (VNĐ) |
| `description` | TEXT | NULL | Mô tả chi tiết |
| `image_url` | VARCHAR(500) | NULL | Hình ảnh minh họa |
| `icon` | VARCHAR(50) | NULL | Biểu tượng (emoji) |
| `is_active` | TINYINT(1) | NOT NULL, DEFAULT 1 | Trạng thái hoạt động |

**Bảng `Appointments`**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | Mã lịch hẹn |
| `customerId` | VARCHAR(50) | FK → Users.id | Khách hàng |
| `staffId` | VARCHAR(50) | FK → Users.id | Bác sĩ/KTV |
| `serviceId` | VARCHAR(50) | FK → Services.id | Dịch vụ |
| `date` | DATE | NOT NULL | Ngày hẹn |
| `time` | VARCHAR(10) | NOT NULL | Giờ hẹn (HH:MM) |
| `status` | ENUM('pending','confirmed','in-progress','completed','cancelled') | NOT NULL, DEFAULT 'pending' | Trạng thái |
| `note` | TEXT | NULL | Ghi chú khách hàng |
| `medicalNote` | TEXT | NULL | Ghi chú y tế (bác sĩ) |
| `cancel_reason` | TEXT | NULL | Lý do hủy |
| `depositPaid` | TINYINT(1) | NOT NULL, DEFAULT 0 | Đã đặt cọc |
| `depositRefunded` | TINYINT(1) | NOT NULL, DEFAULT 0 | Đã hoàn cọc |
| `price` | BIGINT | NOT NULL | Giá tại thời điểm đặt |
| `createdAt` | DATETIME | NOT NULL, DEFAULT NOW() | Thời gian tạo |
| `updatedAt` | DATETIME | NOT NULL, ON UPDATE NOW() | Thời gian cập nhật |

**INDEX**: `idx_date_staff(date, staffId)`, `idx_customer(customerId)`, `idx_status(status)`

**Bảng `Shifts`**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | Mã ca làm việc |
| `staffId` | VARCHAR(50) | FK → Users.id | Bác sĩ/KTV |
| `day` | ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') | NOT NULL | Ngày trong tuần |
| `startTime` | VARCHAR(10) | NOT NULL | Giờ bắt đầu ca |
| `endTime` | VARCHAR(10) | NOT NULL | Giờ kết thúc ca |

**Bảng `Reviews`**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | Mã đánh giá |
| `appointmentId` | VARCHAR(50) | FK, UNIQUE | Lịch hẹn (1 lịch = 1 đánh giá) |
| `customerId` | VARCHAR(50) | FK → Users.id | Khách hàng đánh giá |
| `staffId` | VARCHAR(50) | FK → Users.id | Bác sĩ/KTV được đánh giá |
| `serviceId` | VARCHAR(50) | FK → Services.id | Dịch vụ được đánh giá |
| `rating` | INT | NOT NULL, CHECK (1-5) | Số sao (1 đến 5) |
| `comment` | TEXT | NULL | Nhận xét |
| `tags` | VARCHAR(500) | NULL | Nhãn đánh giá (CSV) |
| `staffReply` | TEXT | NULL | Phản hồi của bác sĩ |
| `likes` | INT | NOT NULL, DEFAULT 0 | Số lượt thích |
| `createdAt` | DATETIME | NOT NULL | Thời gian đánh giá |

**Bảng `Notifications`**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | Mã thông báo |
| `userId` | VARCHAR(50) | FK → Users.id | Người nhận |
| `title` | VARCHAR(200) | NOT NULL | Tiêu đề |
| `message` | TEXT | NOT NULL | Nội dung |
| `type` | ENUM('appointment','system','reminder','review') | NOT NULL | Loại thông báo |
| `isRead` | TINYINT(1) | NOT NULL, DEFAULT 0 | Đã đọc chưa |
| `link` | VARCHAR(300) | NULL | Đường dẫn liên quan |
| `createdAt` | DATETIME | NOT NULL, DEFAULT NOW() | Thời gian gửi |

**INDEX**: `idx_user_read(userId, isRead)`

**Bảng `ShiftSwaps`** *(Yêu cầu đổi ca)*

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | Mã yêu cầu đổi ca |
| `requesterId` | VARCHAR(50) | FK → Users.id | Bác sĩ gửi yêu cầu |
| `targetId` | VARCHAR(50) | FK → Users.id | Bác sĩ được yêu cầu trực hộ |
| `date` | DATE | NOT NULL | Ngày bận cần đổi |
| `shiftId` | VARCHAR(50) | FK → Shifts.id | Ca làm việc cần đổi |
| `targetDate` | DATE | NULL | Ngày đổi chéo (mutual swap, tùy chọn) |
| `targetShiftId` | VARCHAR(50) | FK → Shifts.id, NULL | Ca đổi chéo (tùy chọn) |
| `reason` | TEXT | NULL | Lý do đổi ca |
| `status` | ENUM('pending','accepted','rejected','approved','declined') | NOT NULL, DEFAULT 'pending' | Trạng thái yêu cầu |
| `createdAt` | DATETIME | NOT NULL, DEFAULT NOW() | Thời gian tạo yêu cầu |

**Quy trình trạng thái ShiftSwap**: `pending` → `accepted` (Bác sĩ B) → `approved` (Admin) / `declined` (Admin) | `rejected` (Bác sĩ B)

---

## PHẦN 2: KIỂM THỬ

---

### 1. Mục tiêu và Chiến lược kiểm thử

#### 1.1. Mục tiêu kiểm thử

- Xác minh các chức năng cốt lõi hoạt động đúng theo đặc tả.
- Phát hiện các lỗi về logic nghiệp vụ, xác thực đầu vào và phân quyền.
- Đảm bảo tính toàn vẹn dữ liệu trong các thao tác tạo lịch hẹn, đánh giá.
- Kiểm tra các ràng buộc nghiệp vụ (trùng lịch, hoàn tiền cọc, v.v.).

#### 1.2. Phạm vi kiểm thử

| Chức năng | Phạm vi |
|---|---|
| FR_01 – Đăng ký | Trong phạm vi |
| FR_02 – Đăng nhập | Trong phạm vi |
| FR_04 – Đặt lịch hẹn | Trong phạm vi |
| FR_06 – Hủy lịch hẹn | Trong phạm vi |
| FR_07 – Đánh giá dịch vụ | Trong phạm vi |
| FR_08 – Like đánh giá | Trong phạm vi |
| FR_10 – Cập nhật trạng thái lịch hẹn | Trong phạm vi |
| FR_12 – Yêu cầu đổi ca (3 bước) | Trong phạm vi |
| FR_13 – Quản lý ca làm việc | Trong phạm vi |
| FR_17 – Báo cáo doanh thu | Trong phạm vi |
| FR_19 – Hệ thống thông báo | Trong phạm vi |
| Giao diện Admin, Doctor | Ngoài phạm vi (kiểm tra thủ công) |

#### 1.3. Chiến lược kiểm thử

| Loại kiểm thử | Mô tả |
|---|---|
| **Kiểm thử hộp đen** | Dựa trên đặc tả yêu cầu, không xét mã nguồn. Áp dụng kỹ thuật phân lớp tương đương, phân tích giá trị biên. |
| **Kiểm thử hộp trắng** | Xét mã nguồn, kiểm tra các nhánh điều kiện trong controller. |
| **Kiểm thử tích hợp** | Kiểm tra luồng dữ liệu từ API → Controller → Model → DB. |

---

### 2. Kiểm thử hộp trắng

> Áp dụng cho 4 chức năng demo chính.

#### DEMO 1: Hàm `checkConflict` (AppointmentController)

**Mã nguồn logic:**
```javascript
// Kiểm tra xung đột lịch hẹn
const conflict = await AppointmentModel.checkConflict(staffId, date, time, service.duration);
if (conflict) return res.status(409).json({ error: 'Khung giờ này đã có lịch hẹn khác.' });
```

**Biểu đồ luồng:**
```
  [Nhận request đặt lịch]
           ↓
  [Validate: staffId, serviceId, date, time bắt buộc?]
       ↓ Thiếu        ↓ Đủ
  [Lỗi 400]   [Lấy thông tin service]
                       ↓
              [checkConflict(staffId, date, time, duration)]
                   ↓ Có xung đột    ↓ Không xung đột
              [Lỗi 409]        [Tạo lịch hẹn]
                                     ↓
                              [Gửi thông báo Doctor + Admin]
                                     ↓
                              [Trả về 201 Created]
```

**Các nhánh cần kiểm thử (Coverage):**
1. Thiếu trường bắt buộc → 400
2. Dịch vụ không tồn tại → 404
3. Có xung đột lịch → 409
4. Đặt lịch thành công → 201

#### DEMO 2: Hàm `login` (AuthController)

**Mã nguồn logic:**
```javascript
// File: backend/controllers/authController.js
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  const user = await UserModel.findByUsername(username);
  if (!user)
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
  if (!user.is_active)
    return res.status(403).json({ error: 'Tài khoản đã bị vô hiệu hóa' });

  const valid = await UserModel.verifyPassword(password, user.password);
  if (!valid)
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });

  const token = generateToken(user);
  res.json({ token, user, message: 'Đăng nhập thành công' });
};
```

**Biểu đồ luồng:**
```
  [Nhận request đăng nhập]
           ↓
  [Kiểm tra: username & password bắt buộc?]
       ↓ Thiếu           ↓ Đủ
  [Lỗi 400]    [Tìm user theo username trong DB]
                    ↓ Không tồn tại   ↓ Tồn tại
               [Lỗi 401]     [Kiểm tra is_active]
                                  ↓ = 0       ↓ = 1
                             [Lỗi 403]  [Xác thực mật khẩu (bcrypt)]
                                           ↓ Sai        ↓ Đúng
                                      [Lỗi 401]  [Tạo JWT token]
                                                       ↓
                                              [Trả về 200 + token + user]
```

**Các nhánh cần kiểm thử (Coverage):**
1. Thiếu username/password → 400
2. Username không tồn tại → 401
3. Tài khoản bị vô hiệu hóa (`is_active = 0`) → 403
4. Mật khẩu sai → 401
5. Đăng nhập thành công → 200 + JWT token

#### DEMO 3: Hàm `updateStatus` (AppointmentController)

**Mã nguồn logic:**
```javascript
// File: backend/controllers/appointmentController.js
exports.updateStatus = async (req, res) => {
  const { status, medicalNote, cancel_reason } = req.body;
  const appt = await AppointmentModel.findById(req.params.id);
  if (!appt) return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });

  const validTransitions = {
    admin:    ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    doctor:   ['confirmed', 'in-progress', 'completed'],
    customer: ['cancelled']
  };

  if (!validTransitions[req.user.role]?.includes(status))
    return res.status(403).json({ error: 'Không được phép thay đổi trạng thái này' });

  if (status === 'cancelled') {
    if (req.user.role === 'customer' && appt.customerId !== req.user.id)
      return res.status(403).json({ error: 'Không có quyền hủy lịch này' });
    // Refund logic: hoàn cọc nếu hủy trước 24h
    if (appt.depositPaid) {
      const willRefund = AppointmentModel.canRefund(appt.date, appt.time);
      extra.depositRefunded = willRefund ? 1 : 0;
    }
  }

  const updated = await AppointmentModel.updateStatus(req.params.id, status, extra);
  res.json(updated);
};
```

**Biểu đồ luồng:**
```
  [Nhận request cập nhật trạng thái]
           ↓
  [Tìm lịch hẹn theo id]
       ↓ Không tồn tại   ↓ Tồn tại
  [Lỗi 404]     [Kiểm tra validTransitions[role].includes(status)?]
                     ↓ Không              ↓ Có
               [Lỗi 403]        [status === 'cancelled'?]
                                    ↓ Không              ↓ Có
                          [Cập nhật trạng thái]  [customer: có phải lịch mình?]
                                                    ↓ Không        ↓ Có
                                               [Lỗi 403]  [depositPaid = 1?]
                                                              ↓ Có          ↓ Không
                                                   [Kiểm tra 24h]    [depositRefunded=0]
                                                    ↓ Trước 24h  ↓ Sau 24h
                                                [refund=1]   [refund=0]
                                                              ↓
                                              [Cập nhật DB → Trả về 200]
```

**Các nhánh cần kiểm thử (Coverage):**
1. Lịch hẹn không tồn tại → 404
2. `customer` cố đổi sang status khác `cancelled` → 403
3. `doctor` cố đổi sang `cancelled` → 403
4. `admin` đổi mọi trạng thái → 200
5. `customer` hủy lịch của người khác → 403
6. Hủy trước 24h + đã cọc → `depositRefunded = 1`
7. Hủy sau 24h + đã cọc → `depositRefunded = 0`

#### DEMO 4: Hàm `register` (AuthController)

**Mã nguồn logic:**
```javascript
// File: backend/controllers/authController.js
exports.register = async (req, res) => {
  const { username, password, name, email, phone } = req.body;
  const normalizedUsername = (username || '').trim();

  if (!normalizedUsername || !password || !name)
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  if (normalizedUsername.length < 6 || normalizedUsername.length > 20)
    return res.status(400).json({ error: 'Tên đăng nhập phải từ 6 đến 20 ký tự' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });

  if (await UserModel.existsUsername(normalizedUsername))
    return res.status(409).json({ error: 'Tên đăng nhập này đã được sử dụng' });
  if (email && await UserModel.existsEmail(email))
    return res.status(409).json({ error: 'Email đã được sử dụng' });

  const user = await UserModel.create({ id, username, password, role: 'customer', name, email, phone });
  const token = generateToken(user);
  res.status(201).json({ token, user, message: 'Đăng ký thành công' });
};
```

**Biểu đồ luồng:**
```
  [Nhận request đăng ký]
           ↓
  [Kiểm tra: username, password, name bắt buộc?]
       ↓ Thiếu              ↓ Đủ
  [Lỗi 400]      [username.length trong [6, 20]?]
                      ↓ Không         ↓ Có
                 [Lỗi 400]  [password.length >= 6?]
                                ↓ Không    ↓ Có
                           [Lỗi 400]  [username đã tồn tại?]
                                          ↓ Có       ↓ Không
                                     [Lỗi 409]  [email đã tồn tại?]
                                                    ↓ Có      ↓ Không
                                               [Lỗi 409]  [Tạo tài khoản]
                                                               ↓
                                                   [Tạo JWT token]
                                                               ↓
                                               [Trả về 201 + token + user]
```

**Các nhánh cần kiểm thử (Coverage):**
1. Thiếu username/password/name → 400
2. Username < 6 ký tự → 400
3. Password < 6 ký tự → 400
4. Username đã tồn tại → 409
5. Email đã được dùng → 409
6. Đăng ký thành công → 201 + JWT token

---

### 3. Kiểm thử hộp đen

#### 3.1. Cơ sở lý thuyết áp dụng

| Kỹ thuật | Mô tả áp dụng |
|---|---|
| **Phân lớp tương đương (Equivalence Partitioning)** | Phân chia giá trị đầu vào thành các lớp hợp lệ và không hợp lệ. |
| **Phân tích giá trị biên (Boundary Value Analysis)** | Kiểm tra tại biên của các miền hợp lệ (VD: password đúng 6 ký tự, rating = 1 và = 5). |
| **Bảng quyết định (Decision Table)** | Kiểm tra các tổ hợp điều kiện phức tạp (VD: logic hủy lịch + hoàn tiền). |

---

#### 3.2. Áp dụng kỹ thuật vào các trường dữ liệu cụ thể

---

##### FR_01: Đăng ký tài khoản

**Kỹ thuật áp dụng: Phân lớp tương đương + Phân tích giá trị biên**

**Phân lớp tương đương các trường:**

| Trường | Lớp hợp lệ | Lớp không hợp lệ |
|---|---|---|
| `username` | Chuỗi không rỗng, duy nhất trong DB | Rỗng/null, đã tồn tại |
| `password` | Chuỗi ≥ 6 ký tự | Rỗng/null, < 6 ký tự |
| `name` | Chuỗi không rỗng | Rỗng/null |
| `email` | Đúng định dạng email, duy nhất / để trống | Sai định dạng, đã tồn tại |
| `phone` | Chuỗi số / để trống | — |

**Bảng tổng hợp các ca kiểm thử FR_01:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_DK_01 | EP (Vùng hợp lệ) | username="testuser01", password="Pass123", name="Nguyễn Test", email="test01@gmail.com", phone="0912345678" | HTTP 201 – Đăng ký thành công, trả về JWT token | Hợp lệ | | |
| TC_DK_02 | EP (Vùng không hợp lệ – thiếu trường bắt buộc) | username="testuser02", password="Pass123" (thiếu `name`) | HTTP 400 – "Thiếu thông tin bắt buộc" | Không hợp lệ | | |
| TC_DK_03 | BVA (Biên dưới – 1): password 5 ký tự | username="testuser03", password="Ab123" (5 ký tự), name="Test User" | HTTP 400 – "Mật khẩu phải có ít nhất 6 ký tự" | Không hợp lệ | | |
| TC_DK_04 | BVA (Biên dưới): password đúng 6 ký tự | username="testuser04", password="Ab1234" (6 ký tự), name="Test User" | HTTP 201 – Đăng ký thành công | Hợp lệ | | |
| TC_DK_05 | EP (Vùng không hợp lệ – username đã tồn tại) | username="admin" (đã có trong DB), password="Pass1234", name="Test Admin" | HTTP 409 – "Tên đăng nhập đã tồn tại" | Không hợp lệ | | |
| TC_DK_06 | EP (Vùng không hợp lệ – email đã tồn tại) | username="newuser01", password="Pass123", name="New User", email="admin@spapromax.vn" (đã có trong DB) | HTTP 409 – "Email đã được sử dụng" | Không hợp lệ | | |

---

**TC_DK_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp hợp lệ tất cả trường)**

| Field | Value |
|---|---|
| **ID** | TC_DK_01 |
| **Title** | Đăng ký tài khoản thành công với đầy đủ thông tin hợp lệ |
| **Preconditions** | Username `testuser01` chưa tồn tại trong DB. Email `test01@gmail.com` chưa tồn tại. |
| **Step** | 1. Gọi POST `/api/auth/register` với body: `{username: "testuser01", password: "Pass123", name: "Nguyễn Test", email: "test01@gmail.com", phone: "0912345678"}` |
| **Test Data** | username=testuser01, password=Pass123, name=Nguyễn Test, email=test01@gmail.com, phone=0912345678 |
| **Expected Result** | HTTP 201 – Trả về `{token: "...", user: {...}, message: "Đăng ký thành công"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DK_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – thiếu trường bắt buộc)**

| Field | Value |
|---|---|
| **ID** | TC_DK_02 |
| **Title** | Đăng ký thất bại khi thiếu trường `name` |
| **Preconditions** | — |
| **Step** | Gọi POST `/api/auth/register` với body: `{username: "testuser02", password: "Pass123"}` (thiếu `name`) |
| **Test Data** | username=testuser02, password=Pass123 (không có name) |
| **Expected Result** | HTTP 400 – `{error: "Thiếu thông tin bắt buộc"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DK_03**
Kỹ thuật áp dụng: **Phân tích giá trị biên – password đúng 5 ký tự (dưới biên)**

| Field | Value |
|---|---|
| **ID** | TC_DK_03 |
| **Title** | Đăng ký thất bại khi mật khẩu chỉ có 5 ký tự |
| **Preconditions** | — |
| **Step** | Gọi POST `/api/auth/register` với password=`Ab123` (5 ký tự) |
| **Test Data** | username=testuser03, password=Ab123, name=Test User |
| **Expected Result** | HTTP 400 – `{error: "Mật khẩu phải có ít nhất 6 ký tự"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DK_04**
Kỹ thuật áp dụng: **Phân tích giá trị biên – password đúng 6 ký tự (tại biên hợp lệ)**

| Field | Value |
|---|---|
| **ID** | TC_DK_04 |
| **Title** | Đăng ký thành công khi mật khẩu có đúng 6 ký tự |
| **Preconditions** | Username `testuser04` chưa tồn tại |
| **Step** | Gọi POST `/api/auth/register` với password=`Ab1234` (6 ký tự) |
| **Test Data** | username=testuser04, password=Ab1234, name=Test User |
| **Expected Result** | HTTP 201 – Đăng ký thành công |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DK_05**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – username đã tồn tại)**

| Field | Value |
|---|---|
| **ID** | TC_DK_05 |
| **Title** | Đăng ký thất bại khi username đã tồn tại trong hệ thống |
| **Preconditions** | Username `admin` đã tồn tại trong DB (seed data) |
| **Step** | Gọi POST `/api/auth/register` với username=`admin` |
| **Test Data** | username=admin, password=Pass1234, name=Test Admin |
| **Expected Result** | HTTP 409 – `{error: "Tên đăng nhập đã tồn tại"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DK_06**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – email đã tồn tại)**

| Field | Value |
|---|---|
| **ID** | TC_DK_06 |
| **Title** | Đăng ký thất bại khi email đã được sử dụng |
| **Preconditions** | Email `admin@spapromax.vn` đã tồn tại trong DB |
| **Step** | Gọi POST `/api/auth/register` với email=`admin@spapromax.vn` và username khác |
| **Test Data** | username=newuser01, password=Pass123, name=New User, email=admin@spapromax.vn |
| **Expected Result** | HTTP 409 – `{error: "Email đã được sử dụng"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_02: Đăng nhập

**Kỹ thuật áp dụng: Phân lớp tương đương + Bảng quyết định**

**Bảng tổng hợp các ca kiểm thử FR_02:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_DN_01 | EP (Vùng hợp lệ) | username="admin", password="password" | HTTP 200 – Đăng nhập thành công, trả về JWT token và thông tin user | Hợp lệ | | |
| TC_DN_02 | EP (Vùng không hợp lệ – sai mật khẩu) | username="admin", password="wrongpass" | HTTP 401 – "Tên đăng nhập hoặc mật khẩu không đúng" | Không hợp lệ | | |
| TC_DN_03 | EP (Vùng không hợp lệ – username không tồn tại) | username="nonexistent_user", password="anypassword" | HTTP 401 – "Tên đăng nhập hoặc mật khẩu không đúng" | Không hợp lệ | | |
| TC_DN_04 | EP (Vùng không hợp lệ – thiếu cả 2 trường) | {} (body rỗng) | HTTP 400 – "Username and password required" | Không hợp lệ | | |

---

**TC_DN_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp hợp lệ)**

| Field | Value |
|---|---|
| **ID** | TC_DN_01 |
| **Title** | Đăng nhập thành công với thông tin hợp lệ |
| **Preconditions** | Tài khoản `admin` / `password` tồn tại và đang hoạt động |
| **Step** | Gọi POST `/api/auth/login` với `{username: "admin", password: "password"}` |
| **Test Data** | username=admin, password=password |
| **Expected Result** | HTTP 200 – `{token: "...", user: {role: "admin",...}, message: "Đăng nhập thành công"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DN_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – sai mật khẩu)**

| Field | Value |
|---|---|
| **ID** | TC_DN_02 |
| **Title** | Đăng nhập thất bại khi mật khẩu sai |
| **Preconditions** | Tài khoản `admin` tồn tại |
| **Step** | Gọi POST `/api/auth/login` với `{username: "admin", password: "wrongpass"}` |
| **Test Data** | username=admin, password=wrongpass |
| **Expected Result** | HTTP 401 – `{error: "Tên đăng nhập hoặc mật khẩu không đúng"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DN_03**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – username không tồn tại)**

| Field | Value |
|---|---|
| **ID** | TC_DN_03 |
| **Title** | Đăng nhập thất bại khi username không tồn tại |
| **Preconditions** | — |
| **Step** | Gọi POST `/api/auth/login` với username không có trong DB |
| **Test Data** | username=nonexistent_user, password=anypassword |
| **Expected Result** | HTTP 401 – `{error: "Tên đăng nhập hoặc mật khẩu không đúng"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DN_04**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – thiếu trường)**

| Field | Value |
|---|---|
| **ID** | TC_DN_04 |
| **Title** | Đăng nhập thất bại khi thiếu cả username lẫn password |
| **Preconditions** | — |
| **Step** | Gọi POST `/api/auth/login` với body rỗng `{}` |
| **Test Data** | (body rỗng) |
| **Expected Result** | HTTP 400 – `{error: "Username and password required"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_04: Đặt lịch hẹn

**Kỹ thuật áp dụng: Phân lớp tương đương + Bảng quyết định (kiểm tra xung đột)**

**Bảng tổng hợp các ca kiểm thử FR_04:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_DL_01 | EP (Vùng hợp lệ) | staffId=u1, serviceId=s1, date=(Thứ Hai gần nhất), time="10:00", depositPaid=true | HTTP 201 – Lịch hẹn được tạo, thông báo gửi cho bác sĩ và admin | Hợp lệ | | |
| TC_DL_02 | EP (Vùng không hợp lệ – trùng giờ) | staffId=u1, serviceId=s1, date=ngày X, time="09:00" (đã có lịch) | HTTP 409 – "Khung giờ này đã có lịch hẹn khác" | Không hợp lệ | | |
| TC_DL_03 | EP (Vùng không hợp lệ – thiếu trường) | staffId=u1, serviceId=s1, date=hợp lệ (không có `time`) | HTTP 400 – "Thiếu thông tin bắt buộc" | Không hợp lệ | | |
| TC_DL_04 | EP (Vùng không hợp lệ – dịch vụ không tồn tại) | staffId=u1, serviceId="s999" (không có trong DB), time="10:00" | HTTP 404 – "Dịch vụ không tồn tại" | Không hợp lệ | | |

---

**TC_DL_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp hợp lệ)**

| Field | Value |
|---|---|
| **ID** | TC_DL_01 |
| **Title** | Đặt lịch hẹn thành công với thông tin hợp lệ và giờ trống |
| **Preconditions** | Đã đăng nhập với role `customer`. Bác sĩ u1 có ca làm việc vào thứ Hai. Khung giờ 10:00 chưa có lịch. |
| **Step** | Gọi POST `/api/appointments` (Authorization: Bearer token) với body hợp lệ |
| **Test Data** | staffId=u1, serviceId=s1, date=(ngày thứ Hai gần nhất), time=10:00, depositPaid=true |
| **Expected Result** | HTTP 201 – Lịch hẹn được tạo. Thông báo gửi cho bác sĩ u1 và admin. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DL_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – trùng giờ)**

| Field | Value |
|---|---|
| **ID** | TC_DL_02 |
| **Title** | Đặt lịch thất bại khi giờ hẹn đã bị chiếm |
| **Preconditions** | Bác sĩ u1 đã có lịch `confirmed` vào ngày X lúc 09:00 với dịch vụ 30 phút. |
| **Step** | Gọi POST `/api/appointments` với cùng staffId=u1, date=X, time=09:00 |
| **Test Data** | staffId=u1, serviceId=s1, date=ngày X, time=09:00 |
| **Expected Result** | HTTP 409 – `{error: "Khung giờ này đã có lịch hẹn khác. Vui lòng chọn giờ khác."}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DL_03**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – thiếu trường)**

| Field | Value |
|---|---|
| **ID** | TC_DL_03 |
| **Title** | Đặt lịch thất bại khi thiếu trường `time` |
| **Preconditions** | Đã đăng nhập với role `customer` |
| **Step** | Gọi POST `/api/appointments` với body thiếu `time` |
| **Test Data** | staffId=u1, serviceId=s1, date=ngày hợp lệ (thiếu time) |
| **Expected Result** | HTTP 400 – `{error: "Thiếu thông tin bắt buộc"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DL_04**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – dịch vụ không tồn tại)**

| Field | Value |
|---|---|
| **ID** | TC_DL_04 |
| **Title** | Đặt lịch thất bại khi dịch vụ không tồn tại |
| **Preconditions** | Đã đăng nhập với role `customer` |
| **Step** | Gọi POST `/api/appointments` với serviceId không tồn tại trong DB |
| **Test Data** | staffId=u1, serviceId=s999, date=ngày hợp lệ, time=10:00 |
| **Expected Result** | HTTP 404 – `{error: "Dịch vụ không tồn tại"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_06: Hủy lịch hẹn

**Kỹ thuật áp dụng: Bảng quyết định (logic hoàn tiền)**

**Bảng quyết định:**

| Điều kiện | TC_HL_01 | TC_HL_02 | TC_HL_03 | TC_HL_04 |
|---|:---:|:---:|:---:|:---:|
| Đã đặt cọc (`depositPaid`) | T | T | F | — |
| Hủy trước 24h | T | F | T | — |
| Là lịch của chính mình | T | T | T | F |
| **Kết quả: depositRefunded** | **= 1** | **= 0** | **= 0** | **403 Error** |

**Bảng tổng hợp các ca kiểm thử FR_06:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_HL_01 | Bảng quyết định (hủy trước 24h, đã cọc → hoàn tiền) | status="cancelled", cancel_reason="Bận việc đột xuất", lịch hẹn > 24h, depositPaid=1 | HTTP 200 – depositRefunded=1, status="cancelled" | Hợp lệ | | |
| TC_HL_02 | Bảng quyết định (hủy sau 24h, đã cọc → không hoàn tiền) | status="cancelled", cancel_reason="Thay đổi kế hoạch", lịch hẹn ≤ 24h, depositPaid=1 | HTTP 200 – depositRefunded=0, status="cancelled" | Hợp lệ | | |
| TC_HL_03 | EP (Vùng không hợp lệ – hủy lịch người khác) | appointmentId=a3 (thuộc c2), token của c1, status="cancelled" | HTTP 403 – "Không có quyền hủy lịch này" | Không hợp lệ | | |

---

**TC_HL_01**
Kỹ thuật áp dụng: **Bảng quyết định (hủy trước 24h, đã cọc → hoàn tiền)**

| Field | Value |
|---|---|
| **ID** | TC_HL_01 |
| **Title** | Hủy lịch trước 24 giờ và được hoàn tiền cọc |
| **Preconditions** | Lịch hẹn của khách hàng đang login, trạng thái `pending`/`confirmed`, ngày hẹn > 24h từ hiện tại, `depositPaid = 1` |
| **Step** | Gọi PATCH `/api/appointments/:id/status` với `{status: "cancelled", cancel_reason: "Bận việc đột xuất"}` |
| **Test Data** | status=cancelled, cancel_reason=Bận việc đột xuất |
| **Expected Result** | HTTP 200 – `{depositRefunded: 1, status: "cancelled"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_HL_02**
Kỹ thuật áp dụng: **Bảng quyết định (hủy sau 24h, đã cọc → không hoàn tiền)**

| Field | Value |
|---|---|
| **ID** | TC_HL_02 |
| **Title** | Hủy lịch sau 24 giờ – không được hoàn tiền cọc |
| **Preconditions** | Lịch hẹn trạng thái `confirmed`, ngày hẹn trong vòng 24h hoặc đã qua, `depositPaid = 1` |
| **Step** | Gọi PATCH `/api/appointments/:id/status` với `{status: "cancelled", cancel_reason: "..."}` |
| **Test Data** | status=cancelled, cancel_reason=Thay đổi kế hoạch |
| **Expected Result** | HTTP 200 – `{depositRefunded: 0, status: "cancelled"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_HL_03**
Kỹ thuật áp dụng: **Phân lớp tương đương (không có quyền hủy lịch của người khác)**

| Field | Value |
|---|---|
| **ID** | TC_HL_03 |
| **Title** | Khách hàng không được hủy lịch của người khác |
| **Preconditions** | Đăng nhập với tài khoản `bich.ng` (c1). Lịch hẹn a3 thuộc về khách hàng c2. |
| **Step** | Gọi PATCH `/api/appointments/a3/status` với token của c1 và `{status: "cancelled"}` |
| **Test Data** | appointmentId=a3, status=cancelled |
| **Expected Result** | HTTP 403 – `{error: "Không có quyền hủy lịch này"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_07: Đánh giá dịch vụ

**Kỹ thuật áp dụng: Phân tích giá trị biên (rating 1-5)**

**Bảng tổng hợp các ca kiểm thử FR_07:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_DG_01 | BVA (Biên dưới hợp lệ): rating = 1 | appointmentId=hợp lệ, rating=1, comment="Tạm được" | HTTP 201 – Đánh giá được lưu thành công | Hợp lệ | | |
| TC_DG_02 | BVA (Biên trên hợp lệ): rating = 5 | appointmentId=hợp lệ, rating=5 | HTTP 201 – Đánh giá được lưu thành công | Hợp lệ | | |
| TC_DG_03 | BVA (Dưới biên – không hợp lệ): rating = 0 | appointmentId=hợp lệ, rating=0 | HTTP 400 – rating phải từ 1 đến 5 | Không hợp lệ | | |
| TC_DG_04 | BVA (Trên biên – không hợp lệ): rating = 6 | appointmentId=hợp lệ, rating=6 | HTTP 400 – Lỗi validation | Không hợp lệ | | |
| TC_DG_05 | EP (Vùng không hợp lệ – đánh giá trùng lần 2) | appointmentId=a5 (đã có đánh giá r1), rating=4 | HTTP 409 – Lỗi UNIQUE constraint | Không hợp lệ | | |
| TC_DG_06 | EP (Vùng không hợp lệ – lịch chưa hoàn thành) | appointmentId=a2 (status="pending"), rating=5 | HTTP 400 – Chỉ đánh giá được lịch hẹn đã hoàn thành | Không hợp lệ | | |

---

**TC_DG_01**
Kỹ thuật áp dụng: **Phân tích giá trị biên – rating tại giới hạn dưới hợp lệ (= 1)**

| Field | Value |
|---|---|
| **ID** | TC_DG_01 |
| **Title** | Đánh giá thành công với rating = 1 (giới hạn dưới) |
| **Preconditions** | Lịch hẹn có trạng thái `completed`, chưa có đánh giá |
| **Step** | Gọi POST `/api/reviews` với `{appointmentId: ..., rating: 1, comment: "Tạm được"}` |
| **Test Data** | rating=1, comment=Tạm được |
| **Expected Result** | HTTP 201 – Đánh giá được lưu thành công |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DG_02**
Kỹ thuật áp dụng: **Phân tích giá trị biên – rating tại giới hạn trên hợp lệ (= 5)**

| Field | Value |
|---|---|
| **ID** | TC_DG_02 |
| **Title** | Đánh giá thành công với rating = 5 (giới hạn trên) |
| **Preconditions** | Lịch hẹn `completed`, chưa có đánh giá |
| **Step** | Gọi POST `/api/reviews` với `{appointmentId: ..., rating: 5}` |
| **Test Data** | rating=5 |
| **Expected Result** | HTTP 201 – Đánh giá được lưu thành công |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DG_03**
Kỹ thuật áp dụng: **Phân tích giá trị biên – rating = 0 (dưới giới hạn, không hợp lệ)**

| Field | Value |
|---|---|
| **ID** | TC_DG_03 |
| **Title** | Đánh giá thất bại với rating = 0 |
| **Preconditions** | Lịch hẹn `completed` |
| **Step** | Gọi POST `/api/reviews` với `{appointmentId: ..., rating: 0}` |
| **Test Data** | rating=0 |
| **Expected Result** | HTTP 400 – Lỗi validation (rating phải từ 1 đến 5) |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DG_04**
Kỹ thuật áp dụng: **Phân tích giá trị biên – rating = 6 (trên giới hạn, không hợp lệ)**

| Field | Value |
|---|---|
| **ID** | TC_DG_04 |
| **Title** | Đánh giá thất bại với rating = 6 |
| **Preconditions** | Lịch hẹn `completed` |
| **Step** | Gọi POST `/api/reviews` với `{appointmentId: ..., rating: 6}` |
| **Test Data** | rating=6 |
| **Expected Result** | HTTP 400 – Lỗi validation |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DG_05**
Kỹ thuật áp dụng: **Phân lớp tương đương (đánh giá lần 2 cùng lịch hẹn)**

| Field | Value |
|---|---|
| **ID** | TC_DG_05 |
| **Title** | Đánh giá thất bại khi đánh giá trùng lặp cùng 1 lịch hẹn |
| **Preconditions** | Lịch hẹn `a5` đã có đánh giá `r1` trong DB (seed data) |
| **Step** | Gọi POST `/api/reviews` lần 2 với cùng `appointmentId=a5` |
| **Test Data** | appointmentId=a5, rating=4 |
| **Expected Result** | HTTP 409 – Lỗi UNIQUE constraint (đã đánh giá lịch hẹn này) |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DG_06**
Kỹ thuật áp dụng: **Phân lớp tương đương (lịch chưa hoàn thành, không được đánh giá)**

| Field | Value |
|---|---|
| **ID** | TC_DG_06 |
| **Title** | Đánh giá thất bại khi lịch hẹn chưa ở trạng thái `completed` |
| **Preconditions** | Lịch hẹn `a2` có trạng thái `pending` |
| **Step** | Gọi POST `/api/reviews` với `appointmentId=a2, rating=5` |
| **Test Data** | appointmentId=a2, rating=5 |
| **Expected Result** | HTTP 400 – Lỗi: Chỉ đánh giá được lịch hẹn đã hoàn thành |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_09: Cập nhật trạng thái lịch hẹn (Doctor)

**Kỹ thuật áp dụng: Bảng quyết định phân quyền**

**Bảng tổng hợp các ca kiểm thử FR_09:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_TT_01 | Bảng quyết định (doctor được phép: confirmed) | token=dr.minh, lịch ở "pending", status="confirmed" | HTTP 200 – status="confirmed" | Hợp lệ | | |
| TC_TT_02 | Bảng quyết định (doctor không được phép: cancelled) | token=dr.minh, status="cancelled" | HTTP 403 – "Không được phép thay đổi trạng thái này" | Không hợp lệ | | |
| TC_TT_03 | Bảng quyết định (doctor hoàn thành + ghi chú y tế) | token=dr.minh, lịch "in-progress", status="completed", medicalNote="Bệnh nhân khỏe mạnh..." | HTTP 200 – status="completed", medicalNote lưu thành công | Hợp lệ | | |

---

**TC_TT_01**
Kỹ thuật áp dụng: **Bảng quyết định (doctor được phép: confirmed)**

| Field | Value |
|---|---|
| **ID** | TC_TT_01 |
| **Title** | Bác sĩ xác nhận lịch hẹn `pending` → `confirmed` thành công |
| **Preconditions** | Đăng nhập với `dr.minh`. Lịch hẹn thuộc về dr.minh ở trạng thái `pending` |
| **Step** | Gọi PATCH `/api/appointments/:id/status` với `{status: "confirmed"}` và Bearer token của dr.minh |
| **Test Data** | status=confirmed |
| **Expected Result** | HTTP 200 – `{status: "confirmed"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_TT_02**
Kỹ thuật áp dụng: **Bảng quyết định (doctor không được phép đổi thành `cancelled`)**

| Field | Value |
|---|---|
| **ID** | TC_TT_02 |
| **Title** | Bác sĩ thất bại khi cố đổi trạng thái thành `cancelled` |
| **Preconditions** | Đăng nhập với `dr.minh` |
| **Step** | Gọi PATCH `/api/appointments/:id/status` với `{status: "cancelled"}` |
| **Test Data** | status=cancelled |
| **Expected Result** | HTTP 403 – `{error: "Không được phép thay đổi trạng thái này"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_TT_03**
Kỹ thuật áp dụng: **Bảng quyết định (doctor thêm ghi chú y tế khi hoàn thành)**

| Field | Value |
|---|---|
| **ID** | TC_TT_03 |
| **Title** | Bác sĩ hoàn thành lịch hẹn và thêm ghi chú y tế |
| **Preconditions** | Đăng nhập với `dr.minh`. Lịch hẹn ở trạng thái `in-progress` |
| **Step** | Gọi PATCH `/api/appointments/:id/status` với `{status: "completed", medicalNote: "Bệnh nhân khỏe mạnh, không có dấu hiệu bất thường."}` |
| **Test Data** | status=completed, medicalNote=Bệnh nhân khỏe mạnh, không có dấu hiệu bất thường. |
| **Expected Result** | HTTP 200 – `{status: "completed", medicalNote: "Bệnh nhân khỏe mạnh..."}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_08: Like đánh giá

**Kỹ thuật áp dụng: Phân lớp tương đương**

**Bảng tổng hợp các ca kiểm thử FR_08:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_LK_01 | EP (Vùng hợp lệ – đã đăng nhập) | reviewId=r1, token hợp lệ (likes hiện tại = 12) | HTTP 200 – likes=13 (tăng thêm 1) | Hợp lệ | | |
| TC_LK_02 | EP (Vùng không hợp lệ – chưa đăng nhập) | reviewId=r1, không có header Authorization | HTTP 401 – Lỗi xác thực | Không hợp lệ | | |

---

**TC_LK_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp hợp lệ – like thành công)**

| Field | Value |
|---|---|
| **ID** | TC_LK_01 |
| **Title** | Like đánh giá thành công khi đã đăng nhập |
| **Preconditions** | Đã đăng nhập với bất kỳ tài khoản. Đánh giá `r1` tồn tại (likes hiện tại = 12). |
| **Step** | Gọi POST `/api/reviews/r1/like` với Authorization token |
| **Test Data** | reviewId=r1 |
| **Expected Result** | HTTP 200 – `{likes: 13}` (tăng thêm 1) |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_LK_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp không hợp lệ – chưa đăng nhập)**

| Field | Value |
|---|---|
| **ID** | TC_LK_02 |
| **Title** | Like đánh giá thất bại khi chưa đăng nhập |
| **Preconditions** | Không có token JWT |
| **Step** | Gọi POST `/api/reviews/r1/like` không có header Authorization |
| **Test Data** | (không có token) |
| **Expected Result** | HTTP 401 – Lỗi xác thực |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_12: Yêu cầu đổi ca (3 bước)

**Kỹ thuật áp dụng: Bảng quyết định (phân quyền từng bước) + Phân lớp tương đương**

**Bảng tổng hợp các ca kiểm thử FR_12:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_DC_01 | EP (Vùng hợp lệ – Bước 1: tạo yêu cầu) | token=dr.minh, targetId="u2", date="2026-07-14", shiftId="sh1", reason="Bận việc gia đình" | HTTP 201 – status=pending, thông báo gửi cho ktv.lan | Hợp lệ | | |
| TC_DC_02 | EP (Vùng không hợp lệ – tự gửi cho chính mình) | token=dr.minh, targetId="u1" (chính mình), shiftId="sh1" | HTTP 400 – "Không thể tự gửi yêu cầu cho chính mình" | Không hợp lệ | | |
| TC_DC_03 | Bảng quyết định – Bước 2: Bác sĩ B chấp nhận | token=ktv.lan, swapId hợp lệ (status=pending), status="accepted" | HTTP 200 – status=accepted, thông báo gửi cho dr.minh và admin | Hợp lệ | | |
| TC_DC_04 | Bảng quyết định – bác sĩ gửi không tự chấp nhận | token=dr.minh (người gửi), status="accepted" | HTTP 403 – "Chỉ có bác sĩ nhận yêu cầu mới có quyền" | Không hợp lệ | | |
| TC_DC_05 | Bảng quyết định – Bước 3: Admin phê duyệt + chuyển lịch | token=admin, swapId (status=accepted), status="approved" | HTTP 200 – Lịch hẹn tự động chuyển sang ktv.lan, thông báo gửi cho cả 2 và khách hàng | Hợp lệ | | |
| TC_DC_06 | EP (Vùng không hợp lệ – customer không được duyệt) | token=bich.ng (customer), status="approved" | HTTP 403 – Không có quyền truy cập | Không hợp lệ | | |

---

**TC_DC_01**
Kỹ thuật áp dụng: **Phân lớp tương đương – Bước 1: Tạo yêu cầu đổi ca thành công**

| Field | Value |
|---|---|
| **ID** | TC_DC_01 |
| **Title** | Bác sĩ A tạo yêu cầu đổi ca cho Bác sĩ B thành công |
| **Preconditions** | Đăng nhập với `dr.minh` (u1). Bác sĩ B là `ktv.lan` (u2). |
| **Step** | Gọi POST `/api/shifts/swaps` với `{targetId: "u2", date: "2026-07-14", shiftId: "sh1", reason: "Bận việc gia đình"}` |
| **Test Data** | targetId=u2, date=2026-07-14, shiftId=sh1, reason=Bận việc gia đình |
| **Expected Result** | HTTP 201 – Yêu cầu được tạo với `status=pending`. Gửi thông báo cho ktv.lan. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DC_02**
Kỹ thuật áp dụng: **Phân lớp tương đương – Bác sĩ tự gửi yêu cầu cho chính mình (không hợp lệ)**

| Field | Value |
|---|---|
| **ID** | TC_DC_02 |
| **Title** | Tạo yêu cầu đổi ca thất bại khi targetId = requesterId |
| **Preconditions** | Đăng nhập với `dr.minh` (u1) |
| **Step** | Gọi POST `/api/shifts/swaps` với `{targetId: "u1", date: "2026-07-14", shiftId: "sh1"}` |
| **Test Data** | targetId=u1 (chính mình), date=2026-07-14, shiftId=sh1 |
| **Expected Result** | HTTP 400 – `{error: "Bạn không thể tự gửi yêu cầu đổi ca cho chính mình"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DC_03**
Kỹ thuật áp dụng: **Bảng quyết định – Bước 2: Bác sĩ B chấp nhận (accepted)**

| Field | Value |
|---|---|
| **ID** | TC_DC_03 |
| **Title** | Bác sĩ B chấp nhận yêu cầu đổi ca thành công |
| **Preconditions** | Đăng nhập với `ktv.lan` (u2). Yêu cầu đổi ca đang ở status=`pending`, targetId=u2. |
| **Step** | Gọi PUT `/api/shifts/swaps/:id/status` với `{status: "accepted"}` |
| **Test Data** | status=accepted |
| **Expected Result** | HTTP 200 – Yêu cầu chuyển sang `status=accepted`. Thông báo gửi cho dr.minh và Admin. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DC_04**
Kỹ thuật áp dụng: **Bảng quyết định – Bác sĩ A không được chấp nhận yêu cầu của mình**

| Field | Value |
|---|---|
| **ID** | TC_DC_04 |
| **Title** | Bác sĩ gửi yêu cầu không được phép tự chấp nhận |
| **Preconditions** | Đăng nhập với `dr.minh` (u1) – là người gửi yêu cầu, không phải targetId. |
| **Step** | Gọi PUT `/api/shifts/swaps/:id/status` với `{status: "accepted"}` bằng token của dr.minh |
| **Test Data** | status=accepted |
| **Expected Result** | HTTP 403 – `{error: "Chỉ có bác sĩ nhận yêu cầu mới có quyền chấp nhận/từ chối."}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DC_05**
Kỹ thuật áp dụng: **Bảng quyết định – Bước 3: Admin phê duyệt → tự động chuyển lịch hẹn**

| Field | Value |
|---|---|
| **ID** | TC_DC_05 |
| **Title** | Admin phê duyệt đổi ca – hệ thống tự động chuyển toàn bộ lịch hẹn |
| **Preconditions** | Đăng nhập với admin. Yêu cầu ở status=`accepted`. Bác sĩ dr.minh có lịch hẹn vào ngày đổi. |
| **Step** | Gọi PUT `/api/shifts/swaps/:id/status` với `{status: "approved"}` |
| **Test Data** | status=approved |
| **Expected Result** | HTTP 200 – Lịch hẹn của dr.minh vào ngày đó chuyển sang ktv.lan. Thông báo gửi cho cả 2 bác sĩ và khách hàng liên quan. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DC_06**
Kỹ thuật áp dụng: **Bảng quyết định – Customer không được duyệt đổi ca**

| Field | Value |
|---|---|
| **ID** | TC_DC_06 |
| **Title** | Khách hàng không có quyền phê duyệt yêu cầu đổi ca |
| **Preconditions** | Đăng nhập với `bich.ng` (role=customer). |
| **Step** | Gọi PUT `/api/shifts/swaps/:id/status` với `{status: "approved"}` |
| **Test Data** | status=approved |
| **Expected Result** | HTTP 403 – Lỗi không có quyền truy cập |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_19: Hệ thống thông báo

**Kỹ thuật áp dụng: Phân lớp tương đương**

**Bảng tổng hợp các ca kiểm thử FR_19:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_TB_01 | EP (Vùng hợp lệ – xem danh sách) | token=bich.ng, GET /api/notifications | HTTP 200 – Danh sách tối đa 20 thông báo, sắp xếp giảm dần | Hợp lệ | | |
| TC_TB_02 | EP (Vùng hợp lệ – đếm chưa đọc) | token=bich.ng, GET /api/notifications/unread-count (n1, n2 isRead=0) | HTTP 200 – count=2 | Hợp lệ | | |
| TC_TB_03 | EP (Vùng hợp lệ – đánh dấu tất cả đã đọc) | token=bich.ng, PATCH /api/notifications/read-all | HTTP 200 – "All marked as read", sau đó unread-count = 0 | Hợp lệ | | |

---

**TC_TB_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (lớp hợp lệ – xem thông báo)**

| Field | Value |
|---|---|
| **ID** | TC_TB_01 |
| **Title** | Xem danh sách thông báo cá nhân thành công |
| **Preconditions** | Đăng nhập với `bich.ng` (c1). Có thông báo n1, n2 trong DB. |
| **Step** | Gọi GET `/api/notifications` với Authorization token |
| **Test Data** | (token của bich.ng) |
| **Expected Result** | HTTP 200 – Danh sách tối đa 20 thông báo của user c1, sắp xếp theo thời gian giảm dần |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_TB_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (đếm số thông báo chưa đọc)**

| Field | Value |
|---|---|
| **ID** | TC_TB_02 |
| **Title** | Đếm số thông báo chưa đọc trả về đúng |
| **Preconditions** | Đăng nhập với `bich.ng`. n1, n2 chưa đọc (`isRead=0`). |
| **Step** | Gọi GET `/api/notifications/unread-count` |
| **Test Data** | (token của bich.ng) |
| **Expected Result** | HTTP 200 – `{count: 2}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_TB_03**
Kỹ thuật áp dụng: **Phân lớp tương đương (đánh dấu đã đọc tất cả)**

| Field | Value |
|---|---|
| **ID** | TC_TB_03 |
| **Title** | Đánh dấu tất cả thông báo là đã đọc |
| **Preconditions** | Đăng nhập với `bich.ng`. Có thông báo chưa đọc. |
| **Step** | Gọi PATCH `/api/notifications/read-all` |
| **Test Data** | (token của bich.ng) |
| **Expected Result** | HTTP 200 – `{message: "All marked as read"}`. Sau đó GET unread-count → `{count: 0}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_14 & FR_15: Quản lý dịch vụ & Phân công bác sĩ (Admin)

**Kỹ thuật áp dụng: Phân lớp tương đương**

**Bảng tổng hợp các ca kiểm thử FR_14 & FR_15:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_DV_01 | EP (Vùng hợp lệ – tạo dịch vụ mới) | token=admin, name="Dịch vụ test", category="spa", duration=60, price=500000 | HTTP 201 – Dịch vụ được tạo với id mới | Hợp lệ | | |
| TC_DV_02 | EP (Vùng không hợp lệ – thiếu trường bắt buộc) | token=admin, name="Test", category="spa", duration=60 (thiếu `price`) | HTTP 400 – "Thiếu thông tin bắt buộc" | Không hợp lệ | | |
| TC_DV_03 | EP (Vùng hợp lệ – phân công dịch vụ) | token=admin, userId=u1, serviceIds=["s1", "s6"] | HTTP 200 – Xóa phân công cũ, ghi đè bằng s1, s6 | Hợp lệ | | |
| TC_DV_04 | EP (Vùng hợp lệ – xóa toàn bộ phân công) | token=admin, userId=u1, serviceIds=[] (mảng rỗng) | HTTP 200 – Bác sĩ u1 không còn dịch vụ nào | Hợp lệ | | |

---

**TC_DV_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (tạo dịch vụ mới thành công)**

| Field | Value |
|---|---|
| **ID** | TC_DV_01 |
| **Title** | Admin tạo dịch vụ mới thành công |
| **Preconditions** | Đăng nhập với `admin` |
| **Step** | Gọi POST `/api/services` với `{name: "Dịch vụ test", category: "spa", duration: 60, price: 500000}` |
| **Test Data** | name=Dịch vụ test, category=spa, duration=60, price=500000 |
| **Expected Result** | HTTP 201 – Dịch vụ được tạo với id mới |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DV_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (thiếu trường bắt buộc)**

| Field | Value |
|---|---|
| **ID** | TC_DV_02 |
| **Title** | Admin tạo dịch vụ thất bại khi thiếu trường `price` |
| **Preconditions** | Đăng nhập với `admin` |
| **Step** | Gọi POST `/api/services` với `{name: "Test", category: "spa", duration: 60}` (thiếu price) |
| **Test Data** | name=Test, category=spa, duration=60 (không có price) |
| **Expected Result** | HTTP 400 – `{error: "Thiếu thông tin bắt buộc"}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DV_03**
Kỹ thuật áp dụng: **Phân lớp tương đương (phân công dịch vụ cho bác sĩ)**

| Field | Value |
|---|---|
| **ID** | TC_DV_03 |
| **Title** | Admin phân công dịch vụ s1, s6 cho bác sĩ u1 thành công |
| **Preconditions** | Đăng nhập với `admin` |
| **Step** | Gọi PATCH `/api/admin/users/u1/services` với `{serviceIds: ["s1", "s6"]}` |
| **Test Data** | serviceIds=["s1", "s6"] |
| **Expected Result** | HTTP 200 – `{message: "Đã cập nhật dịch vụ"}`. Xóa phân công cũ và ghi đè bằng s1, s6. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_DV_04**
Kỹ thuật áp dụng: **Phân lớp tương đương (xóa toàn bộ phân công – mảng rỗng)**

| Field | Value |
|---|---|
| **ID** | TC_DV_04 |
| **Title** | Admin xóa toàn bộ phân công dịch vụ của bác sĩ bằng mảng rỗng |
| **Preconditions** | Đăng nhập với `admin`. u1 đang được phân công s1, s6. |
| **Step** | Gọi PATCH `/api/admin/users/u1/services` với `{serviceIds: []}` |
| **Test Data** | serviceIds=[] |
| **Expected Result** | HTTP 200 – `{message: "Đã cập nhật dịch vụ"}`. Bác sĩ u1 không còn được phân công dịch vụ nào. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_17: Báo cáo doanh thu (Admin)

**Kỹ thuật áp dụng: Phân lớp tương đương + Phân tích giá trị biên**

**Bảng tổng hợp các ca kiểm thử FR_17:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_BC_01 | EP (Vùng hợp lệ – xem theo năm) | token=admin, GET /api/admin/reports?year=2026 | HTTP 200 – Trả về monthly, byService, byDoctor, periodSummary, topCustomers, years | Hợp lệ | | |
| TC_BC_02 | EP (Vùng hợp lệ – lọc theo tháng) | token=admin, GET /api/admin/reports?year=2026&month=7 | HTTP 200 – Dữ liệu lọc trong tháng 7/2026 | Hợp lệ | | |
| TC_BC_03 | EP (Vùng không hợp lệ – khách hàng không được xem) | token=bich.ng (customer), GET /api/admin/reports?year=2026 | HTTP 403 – Không có quyền truy cập | Không hợp lệ | | |

---

**TC_BC_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (xem báo cáo theo năm hợp lệ)**

| Field | Value |
|---|---|
| **ID** | TC_BC_01 |
| **Title** | Admin xem báo cáo doanh thu theo năm 2026 |
| **Preconditions** | Đăng nhập với `admin` |
| **Step** | Gọi GET `/api/admin/reports?year=2026` |
| **Test Data** | year=2026 |
| **Expected Result** | HTTP 200 – Trả về `{monthly, byService, byDoctor, periodSummary, topCustomers, years}` |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_BC_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (lọc theo năm + tháng)**

| Field | Value |
|---|---|
| **ID** | TC_BC_02 |
| **Title** | Admin xem báo cáo chi tiết theo tháng 7/2026 |
| **Preconditions** | Đăng nhập với `admin` |
| **Step** | Gọi GET `/api/admin/reports?year=2026&month=7` |
| **Test Data** | year=2026, month=7 |
| **Expected Result** | HTTP 200 – Dữ liệu báo cáo được lọc trong tháng 7/2026 |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_BC_03**
Kỹ thuật áp dụng: **Phân lớp tương đương (khách hàng không được xem báo cáo)**

| Field | Value |
|---|---|
| **ID** | TC_BC_03 |
| **Title** | Khách hàng không có quyền truy cập báo cáo doanh thu |
| **Preconditions** | Đăng nhập với `bich.ng` (role=customer) |
| **Step** | Gọi GET `/api/admin/reports?year=2026` với token của bich.ng |
| **Test Data** | (token customer) |
| **Expected Result** | HTTP 403 – Lỗi không có quyền truy cập |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_23: Tìm kiếm & Lọc dịch vụ (trong đặt lịch)

**Kỹ thuật áp dụng: Phân lớp tương đương + Phân tích giá trị biên**

**Bảng tổng hợp các ca kiểm thử FR_23:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_TK_01 | EP (Vùng hợp lệ – tìm theo tên) | Nhập keyword="massage" vào #svc-search | Lưới chỉ hiển thị dịch vụ có tên chứa "massage" (không phân biệt hoa thường) | Hợp lệ | | |
| TC_TK_02 | EP (Vùng không hợp lệ – từ khóa không khớp) | Nhập keyword="xyzabc123" vào #svc-search | Lưới hiển thị rỗng (không có kết quả phù hợp) | Không hợp lệ | | |
| TC_TK_03 | Bảng quyết định (lọc tab + tìm kiếm kết hợp) | Click tab "Spa", nhập keyword="da" vào #svc-search | Chỉ hiển thị dịch vụ loại Spa VÀ tên chứa "da" | Hợp lệ | | |
| TC_TK_04 | BVA (Biên – xóa từ khóa hiển thị lại tất cả) | Xóa toàn bộ ký tự trong #svc-search (keyword="") | Lưới hiển thị lại đầy đủ theo tab hiện tại | Hợp lệ | | |

---

**TC_TK_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (lọc realtime theo tên dịch vụ)**

| Field | Value |
|---|---|
| **ID** | TC_TK_01 |
| **Title** | Tìm kiếm dịch vụ theo từ khóa "massage" trả về đúng kết quả |
| **Preconditions** | Khách hàng đang ở Bước 1 (chọn dịch vụ). Hệ thống đã tải danh sách dịch vụ. |
| **Step** | Nhập "massage" vào ô `#svc-search` |
| **Test Data** | keyword=massage |
| **Expected Result** | Lưới dịch vụ chỉ hiển thị dịch vụ có tên chứa "massage" (không phân biệt hoa thường). Các dịch vụ khác bị ẩn. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_TK_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (từ khóa không khớp)**

| Field | Value |
|---|---|
| **ID** | TC_TK_02 |
| **Title** | Tìm kiếm từ khóa không tồn tại – hiển thị lưới rỗng |
| **Preconditions** | Khách hàng đang ở Bước 1. Hệ thống đã tải danh sách dịch vụ. |
| **Step** | Nhập "xyzabc123" vào ô `#svc-search` |
| **Test Data** | keyword=xyzabc123 |
| **Expected Result** | Lưới dịch vụ hiển thị rỗng (không có kết quả phù hợp) |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_TK_03**
Kỹ thuật áp dụng: **Bảng quyết định (lọc tab + tìm kiếm kết hợp)**

| Field | Value |
|---|---|
| **ID** | TC_TK_03 |
| **Title** | Lọc tab "Spa" đồng thời tìm kiếm "da" – kết hợp hai bộ lọc |
| **Preconditions** | Khách hàng đang ở Bước 1. Hệ thống đã tải danh sách dịch vụ gồm cả Spa và Medical. |
| **Step** | Click tab "💆 Spa", sau đó nhập "da" vào `#svc-search` |
| **Test Data** | category=spa, keyword=da |
| **Expected Result** | Chỉ hiển thị dịch vụ thuộc danh mục Spa VÀ tên chứa "da" (VD: "Chăm Sóc Da Mặt Chuyên Sâu"). Medical bị ẩn, Spa không chứa "da" cũng bị ẩn. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_TK_04**
Kỹ thuật áp dụng: **Phân tích giá trị biên (xóa từ khóa – hiển thị lại tất cả)**

| Field | Value |
|---|---|
| **ID** | TC_TK_04 |
| **Title** | Xóa từ khóa tìm kiếm – danh sách hiển thị lại đầy đủ |
| **Preconditions** | Khách hàng đã nhập "massage" và kết quả đang bị lọc. |
| **Step** | Xóa toàn bộ ký tự trong `#svc-search` (để trống) |
| **Test Data** | keyword="" (rỗng) |
| **Expected Result** | Lưới dịch vụ hiển thị lại đầy đủ tất cả dịch vụ (theo tab danh mục hiện tại) |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_24: Tìm kiếm Bác sĩ/KTV (trong đặt lịch)

**Kỹ thuật áp dụng: Phân lớp tương đương**

**Bảng tổng hợp các ca kiểm thử FR_24:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_BS_01 | EP (Vùng hợp lệ – tìm theo tên) | Nhập keyword="minh" vào #doc-search | Chỉ hiển thị bác sĩ có tên chứa "minh"; "Lê Thị Lan" bị ẩn | Hợp lệ | | |
| TC_BS_02 | EP (Vùng hợp lệ – tìm theo chuyên môn) | Nhập keyword="da liễu" vào #doc-search | Chỉ hiển thị bác sĩ có specialty chứa "da liễu" | Hợp lệ | | |
| TC_BS_03 | EP (Vùng hợp lệ – reset khi chọn dịch vụ khác) | Nhấn "Quay Lại" → chọn dịch vụ khác → vào Bước 2 | #doc-search rỗng, danh sách bác sĩ hiển thị đầy đủ theo dịch vụ mới | Hợp lệ | | |

---

**TC_BS_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (tìm theo tên)**

| Field | Value |
|---|---|
| **ID** | TC_BS_01 |
| **Title** | Tìm bác sĩ theo tên "minh" – hiển thị đúng kết quả |
| **Preconditions** | Khách hàng đang ở Bước 2 (chọn bác sĩ). Dịch vụ đã chọn có bác sĩ "Nguyễn Văn Minh" và "Lê Thị Lan". |
| **Step** | Nhập "minh" vào ô `#doc-search` |
| **Test Data** | keyword=minh |
| **Expected Result** | Chỉ hiển thị thẻ bác sĩ có tên chứa "minh". Bác sĩ "Lê Thị Lan" bị ẩn. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_BS_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (tìm theo chuyên môn)**

| Field | Value |
|---|---|
| **ID** | TC_BS_02 |
| **Title** | Tìm bác sĩ theo chuyên môn "da liễu" |
| **Preconditions** | Khách hàng đang ở Bước 2. Có bác sĩ chuyên môn "Da Liễu" trong danh sách. |
| **Step** | Nhập "da liễu" vào ô `#doc-search` |
| **Test Data** | keyword=da liễu |
| **Expected Result** | Chỉ hiển thị bác sĩ có `specialty` chứa "da liễu". |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_BS_03**
Kỹ thuật áp dụng: **Phân lớp tương đương (reset khi quay lại chọn dịch vụ khác)**

| Field | Value |
|---|---|
| **ID** | TC_BS_03 |
| **Title** | Thanh tìm kiếm bác sĩ được reset khi chọn dịch vụ mới |
| **Preconditions** | Khách hàng đang ở Bước 2, `#doc-search` đang có nội dung "minh". |
| **Step** | Nhấn "← Quay Lại" để về Bước 1, chọn dịch vụ khác, tiến vào Bước 2 |
| **Test Data** | (thao tác UI) |
| **Expected Result** | `#doc-search` được xóa về rỗng (`value=""`). Danh sách bác sĩ hiển thị đầy đủ theo dịch vụ mới. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

##### FR_25: Xem khung giờ trống (Slot Availability)

**Kỹ thuật áp dụng: Phân lớp tương đương + Phân tích giá trị biên**

**Bảng tổng hợp các ca kiểm thử FR_25:**

| Mã TC | Kỹ thuật áp dụng | Giá trị input cụ thể | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_KG_01 | EP (Vùng hợp lệ – ngày có slot trống) | Click ngày Thứ Hai (has-shift), staffId=u1, serviceId=s1 | Slot available=true → màu xanh; available=false → xám "Bận" | Hợp lệ | | |
| TC_KG_02 | EP (Vùng không hợp lệ – bác sĩ không làm ngày đó) | Click ngày Thứ Bảy, staffId=u1 (không có ca Sat) | API trả về slots=[], hiển thị "❌ Bác sĩ không làm việc" và gợi ý ngày làm việc | Không hợp lệ | | |
| TC_KG_03 | BVA (Biên trên + 1 – ngày quá 60 ngày tới) | Điều hướng đến ngày = CURDATE + 61 ngày, cố click | Ô ngày có class "disabled", không có onclick, không gọi API slot | Không hợp lệ | | |
| TC_KG_04 | BVA (Biên dưới – 1 – ngày quá khứ) | Điều hướng đến ngày = CURDATE − 1 ngày, cố click | Ô ngày có class "disabled", không thể chọn | Không hợp lệ | | |

---

**TC_KG_01**
Kỹ thuật áp dụng: **Phân lớp tương đương (ngày có slot trống)**

| Field | Value |
|---|---|
| **ID** | TC_KG_01 |
| **Title** | Chọn ngày bác sĩ có ca làm việc – hiển thị đúng danh sách slot |
| **Preconditions** | Khách hàng ở Bước 3. Bác sĩ `dr.minh` có ca Thứ Hai (Mon). Chọn ngày Thứ Hai trong tuần tới. |
| **Step** | Click vào ô ngày có màu xanh lá (`has-shift`) trên lịch |
| **Test Data** | date=ngày Thứ Hai hợp lệ, staffId=u1, serviceId=s1 |
| **Expected Result** | API `/api/appointments/slots` trả về danh sách slot. Slot `available=true` → màu xanh, chọn được. Slot `available=false` → màu xám, có chữ "Bận", không nhấn được. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_KG_02**
Kỹ thuật áp dụng: **Phân lớp tương đương (ngày bác sĩ không làm việc)**

| Field | Value |
|---|---|
| **ID** | TC_KG_02 |
| **Title** | Chọn ngày bác sĩ không có ca – hiển thị thông báo và gợi ý ngày làm việc |
| **Preconditions** | Bác sĩ `dr.minh` chỉ làm Thứ Hai và Thứ Tư. Chọn ngày Thứ Bảy. |
| **Step** | Click vào ô ngày Thứ Bảy trên lịch |
| **Test Data** | date=Thứ Bảy, staffId=u1 (không có ca Sat) |
| **Expected Result** | API trả về `slots=[]`. Giao diện hiển thị: "❌ Bác sĩ không làm việc vào ngày này" và "✅ Lịch làm việc: Thứ Hai, Thứ Tư". |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_KG_03**
Kỹ thuật áp dụng: **Phân tích giá trị biên (ngày quá 60 ngày tới – disabled)**

| Field | Value |
|---|---|
| **ID** | TC_KG_03 |
| **Title** | Ngày quá 60 ngày tới không thể chọn trên lịch |
| **Preconditions** | Khách hàng đang ở Bước 3. |
| **Step** | Điều hướng lịch (nhấn →) đến ngày cách hiện tại 61 ngày, thử click vào ô đó |
| **Test Data** | date = CURDATE + 61 ngày |
| **Expected Result** | Ô ngày hiển thị class `disabled`, không có sự kiện onclick, không thể chọn, không gọi API slot. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

**TC_KG_04**
Kỹ thuật áp dụng: **Phân tích giá trị biên (ngày quá khứ – disabled)**

| Field | Value |
|---|---|
| **ID** | TC_KG_04 |
| **Title** | Ngày quá khứ không thể chọn trên lịch |
| **Preconditions** | Khách hàng đang ở Bước 3. |
| **Step** | Điều hướng lịch (nhấn ←) đến ngày hôm qua, thử click vào ô đó |
| **Test Data** | date = CURDATE - 1 ngày |
| **Expected Result** | Ô ngày hiển thị class `disabled`, không thể chọn. |
| **Actual Result** | _(Điền sau khi chạy test)_ |
| **Status** | _(Pass/Fail)_ |

---

## PHỤ LỤC

### A. Cấu trúc thư mục dự án

```
web-t-l-ch-SPA-xung-x-ng/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── reviewController.js
│   │   ├── serviceController.js
│   │   ├── shiftController.js
│   │   └── shiftSwapController.js
│   ├── database/
│   │   └── schema.sql          ← Tạo DB + Seed data
│   ├── middleware/              ← Xác thực JWT
│   ├── models/
│   │   ├── AppointmentModel.js
│   │   ├── ReviewModel.js
│   │   ├── ServiceModel.js
│   │   ├── ShiftModel.js
│   │   ├── ShiftSwapModel.js
│   │   └── UserModel.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   ├── notifications.js
│   │   ├── reviews.js
│   │   ├── services.js
│   │   └── shifts.js
│   ├── db.js                   ← Kết nối MySQL
│   ├── server.js               ← Entry point (port 3002)
│   └── package.json
└── frontend/
    ├── admin/                  ← Trang quản trị
    ├── customer/               ← Trang khách hàng
    ├── doctor/                 ← Trang bác sĩ/KTV
    ├── css/                    ← Stylesheets
    ├── js/                     ← JavaScript
    └── index.html              ← Trang chủ
```

### B. Tài khoản dùng thử

| Vai trò | Username | Password |
|---|---|---|
| Admin | `admin` | `password` |
| Bác sĩ | `dr.minh` | `doctor123` |
| KTV | `ktv.lan` | `doctor123` |
| Khách hàng | `bich.ng` | `cust123` |

### C. Danh sách dịch vụ trong hệ thống

| Mã | Tên dịch vụ | Danh mục | Thời lượng | Giá |
|---|---|---|---|---|
| s1 | Khám Tổng Quát | Medical | 30 phút | 350,000 VNĐ |
| s2 | Massage Thư Giãn Toàn Thân | Spa | 60 phút | 550,000 VNĐ |
| s3 | Chăm Sóc Da Mặt Chuyên Sâu | Spa | 90 phút | 750,000 VNĐ |
| s4 | Tư Vấn Dinh Dưỡng Cá Nhân | Medical | 45 phút | 250,000 VNĐ |
| s5 | Trị Liệu Vai Cổ Gáy | Spa | 45 phút | 450,000 VNĐ |
| s6 | Khám & Điều Trị Da Liễu | Medical | 30 phút | 300,000 VNĐ |
| s7 | Liệu Pháp Đá Nóng | Spa | 75 phút | 650,000 VNĐ |
| s8 | Tắm Bùn Khoáng & Thalasso | Spa | 60 phút | 800,000 VNĐ |

---

*Báo cáo được tạo tự động từ mã nguồn dự án SpaProMax – Hệ thống Đặt lịch và Quản lý Spa/Phòng khám*
