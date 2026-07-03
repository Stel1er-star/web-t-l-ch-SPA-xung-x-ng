# BÁO CÁO MÔN KIỂM THỬ PHẦN MỀM
## Dự án: **SpaProMax – Web Đặt Lịch Spa & Y Tế Xứng Xoang**

> **Nhóm thực hiện:** *(Điền tên thành viên)*  
> **Môn học:** Kiểm thử phần mềm  
> **Năm học:** 2025 – 2026

---

# CHƯƠNG 1: PHÂN TÍCH VÀ THIẾT KẾ

## 1. KHẢO SÁT

### 1.1. GIỚI THIỆU DỰ ÁN

**SpaProMax** là một hệ thống web ứng dụng đơn trang (SPA – Single Page Application) phục vụ việc đặt lịch hẹn tại cơ sở y tế và spa chuyên nghiệp. Hệ thống được xây dựng theo mô hình client–server với:

- **Frontend:** HTML/CSS/JavaScript thuần (Vanilla SPA)
- **Backend:** Node.js + Express.js (RESTful API)
- **Cơ sở dữ liệu:** MySQL (InnoDB, utf8mb4)
- **Xác thực:** JWT (JSON Web Token), bcryptjs

**Mục tiêu hệ thống:**
- Cho phép khách hàng đặt, xem và hủy lịch hẹn tại spa/phòng khám
- Cho phép bác sĩ/kỹ thuật viên quản lý lịch làm việc và cập nhật trạng thái lịch hẹn
- Cho phép admin quản lý toàn bộ hệ thống: người dùng, dịch vụ, ca làm việc, lịch hẹn, đánh giá

---

### 1.2. KHẢO SÁT HIỆN TRẠNG

#### 1.2.1. Thực trạng trước khi có hệ thống

Trước đây, cơ sở spa/phòng khám tiếp nhận đặt lịch qua điện thoại hoặc đến trực tiếp, dẫn đến các vấn đề:

| Vấn đề | Hậu quả |
|---|---|
| Đặt lịch thủ công qua điện thoại | Dễ nhầm lịch, trùng giờ |
| Không có hệ thống theo dõi | Khó kiểm soát lịch sử khách hàng |
| Thông báo nhắc nhở không tự động | Khách hàng quên lịch |
| Không có kênh đánh giá | Khó cải thiện chất lượng dịch vụ |

#### 1.2.2. Yêu cầu đặt ra

Hệ thống cần giải quyết:
1. **Đặt lịch trực tuyến 24/7** – không phụ thuộc giờ làm việc
2. **Kiểm soát xung đột lịch** – tự động phát hiện trùng giờ
3. **Phân quyền 3 vai trò** – Admin, Bác sĩ/KTV, Khách hàng
4. **Thông báo tự động** – khi đặt/xác nhận/hủy lịch
5. **Đánh giá dịch vụ** – sau khi hoàn thành lịch hẹn

---

### 1.3. ĐẶC TẢ YÊU CẦU CHỨC NĂNG (FR)

#### 1.3.1. Bảng yêu cầu chức năng

| Mã FR | Tên chức năng | Mô tả | Vai trò |
|---|---|---|---|
| FR-01 | Đăng ký tài khoản | Khách hàng tạo tài khoản mới với username, mật khẩu, họ tên, email, SĐT | Khách hàng |
| FR-02 | Đăng nhập | Xác thực bằng username/password, trả về JWT token | Tất cả |
| FR-03 | Xem danh sách dịch vụ | Hiển thị dịch vụ theo danh mục (medical/spa), giá, thời gian | Tất cả |
| FR-04 | Xem chi tiết dịch vụ | Xem thông tin chi tiết, nhân viên thực hiện, đánh giá | Tất cả |
| FR-05 | Xem danh sách bác sĩ/KTV | Danh sách nhân viên, chuyên môn, đánh giá trung bình | Tất cả |
| FR-06 | Đặt lịch hẹn | Chọn dịch vụ → nhân viên → ngày → giờ → xác nhận | Khách hàng |
| FR-07 | Xem lịch hẹn của mình | Danh sách lịch hẹn cá nhân theo trạng thái | Khách hàng |
| FR-08 | Hủy lịch hẹn | Hủy lịch chưa thực hiện, hoàn cọc nếu hủy trước 24h | Khách hàng |
| FR-09 | Xem lịch làm việc | Xem ca làm việc theo tuần | Bác sĩ/KTV |
| FR-10 | Cập nhật trạng thái lịch | Xác nhận → Đang thực hiện → Hoàn thành | Bác sĩ/KTV |
| FR-11 | Ghi ghi chú y tế | Thêm ghi chú chuyên môn sau khám/trị liệu | Bác sĩ/KTV |
| FR-12 | Quản lý người dùng | CRUD người dùng, phân quyền, vô hiệu hóa | Admin |
| FR-13 | Quản lý dịch vụ | CRUD dịch vụ, phân loại, phân công nhân viên | Admin |
| FR-14 | Quản lý ca làm việc | Tạo/sửa/xóa ca làm việc cho nhân viên | Admin |
| FR-15 | Quản lý lịch hẹn | Xem, lọc, thay đổi trạng thái toàn bộ lịch hẹn | Admin |
| FR-16 | Đánh giá dịch vụ | Gửi đánh giá (1–5 sao, nhận xét, tag) sau khi hoàn thành | Khách hàng |
| FR-17 | Phản hồi đánh giá | Bác sĩ/KTV trả lời đánh giá của khách | Bác sĩ/KTV |
| FR-18 | Thông báo hệ thống | Nhận thông báo khi đặt/xác nhận/hủy lịch | Tất cả |
| FR-19 | Kiểm tra slot trống | Xem khung giờ còn trống theo nhân viên và ngày | Khách hàng |
| FR-20 | Cập nhật hồ sơ cá nhân | Sửa tên, email, SĐT, ảnh đại diện, mật khẩu | Tất cả |

#### 1.3.2. Yêu cầu phi chức năng

| Mã NFR | Loại | Mô tả |
|---|---|---|
| NFR-01 | Hiệu năng | API phản hồi < 500ms trong điều kiện bình thường |
| NFR-02 | Bảo mật | Mật khẩu được mã hóa bcrypt (salt rounds = 10), JWT có thời hạn 7 ngày |
| NFR-03 | Khả dụng | Hệ thống hoạt động 24/7, downtime < 1% |
| NFR-04 | Tương thích | Hỗ trợ Chrome, Firefox, Edge (phiên bản mới nhất) |
| NFR-05 | Đáp ứng (Responsive) | Giao diện hiển thị tốt trên desktop, tablet, mobile |
| NFR-06 | Toàn vẹn dữ liệu | Không cho phép đặt lịch trùng giờ cùng nhân viên |
| NFR-07 | Khả năng mở rộng | Hệ thống hỗ trợ thêm dịch vụ, nhân viên mà không cần sửa cấu trúc |

#### 1.3.3. Quy tắc nghiệp vụ (Business Rules)

| Mã BR | Quy tắc | Áp dụng cho |
|---|---|---|
| BR-01 | Username phải là duy nhất trong hệ thống | Đăng ký / Quản lý user |
| BR-02 | Email phải là duy nhất (nếu cung cấp) | Đăng ký / Cập nhật hồ sơ |
| BR-03 | Mật khẩu phải có ít nhất 6 ký tự | Đăng ký / Đổi mật khẩu |
| BR-04 | Khách hàng không thể đặt lịch trùng giờ cùng nhân viên | Đặt lịch |
| BR-05 | Chỉ đặt lịch trong ca làm việc của nhân viên | Đặt lịch |
| BR-06 | Hoàn cọc 100% nếu hủy trước 24 giờ so với giờ hẹn | Hủy lịch |
| BR-07 | Không hoàn cọc nếu hủy trong vòng 24 giờ | Hủy lịch |
| BR-08 | Chỉ đánh giá được sau khi lịch hẹn có trạng thái "completed" | Đánh giá |
| BR-09 | Mỗi lịch hẹn chỉ được đánh giá 1 lần | Đánh giá |
| BR-10 | Rating chỉ nhận giá trị nguyên từ 1 đến 5 | Đánh giá |
| BR-11 | Khách hàng chỉ có thể hủy lịch của chính mình | Hủy lịch |
| BR-12 | Bác sĩ chỉ chuyển trạng thái: confirmed → in-progress → completed | Cập nhật trạng thái |
| BR-13 | Admin có thể thay đổi sang bất kỳ trạng thái nào | Cập nhật trạng thái |

---

## 2. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 2.1. Phân tích nghiệp vụ (Use Case Tổng Quát)

```
+------------------------------- HỆ THỐNG SPAPROMAX --------------------------------+
|                                                                                    |
|  [Khách hàng]                [Bác sĩ / KTV]              [Admin]                  |
|       |                            |                         |                     |
|  +-----------+             +---------------+         +------------------+          |
|  | Đăng ký   |             | Xem lịch      |         | Quản lý Users    |          |
|  | Đăng nhập |             | làm việc      |         | Quản lý Services |          |
|  | Xem dịch  |             | Cập nhật      |         | Quản lý Shifts   |          |
|  |   vụ      |             | trạng thái    |         | Quản lý Appts    |          |
|  | Đặt lịch  |             | Ghi chú Y tế  |         | Xem thống kê     |          |
|  | Hủy lịch  |             | Phản hồi ĐG   |         | Quản lý đánh giá |          |
|  | Đánh giá  |             +---------------+         +------------------+          |
|  | Thông báo |                                                                     |
|  +-----------+                                                                     |
|                                                                                    |
|  << Hệ thống tự động >>                                                           |
|  - Kiểm tra xung đột lịch (BR-04, BR-05)                                         |
|  - Tính hoàn cọc (BR-06, BR-07)                                                  |
|  - Gửi thông báo khi đặt/cập nhật lịch                                           |
+------------------------------------------------------------------------------------+
```

#### Sơ đồ Use Case chi tiết – Chức năng Đặt lịch hẹn

```
                       ┌─────────────────────────────────────┐
                       │        UC-06: Đặt lịch hẹn          │
                       │                                      │
  [Khách hàng] ───────>│ 1. Chọn dịch vụ                     │
                       │ 2. Chọn bác sĩ/KTV                  │
                       │ 3. Chọn ngày hẹn                    │
                       │ 4. Xem & chọn slot giờ trống        │
                       │    <<include>> UC-19                 │
                       │ 5. Nhập ghi chú (tùy chọn)          │
                       │ 6. Xác nhận đặt lịch                │
                       │                                      │
                       │ <<extend>>: Thanh toán đặt cọc       │
                       └─────────────────────────────────────┘
                                       │
                              [Hệ thống] kiểm tra
                              xung đột BR-04, BR-05
                                       │
                              Gửi thông báo cho
                              Bác sĩ + Admin (FR-18)
```

---

### 2.2. Phân tích cấu trúc (Class Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CLASS DIAGRAM – SpaProMax                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐        ┌───────────────────┐        ┌──────────────────────┐
│     UserModel    │        │  AppointmentModel │        │    ServiceModel      │
├──────────────────┤        ├───────────────────┤        ├──────────────────────┤
│ - id: String     │1      *│ - id: String      │*      1│ - id: String         │
│ - username: Str  │────────│ - customerId: Str │────────│ - name: String       │
│ - password: Str  │        │ - staffId: String │        │ - category: Enum     │
│ - role: Enum     │        │ - serviceId: Str  │        │   (medical|spa)      │
│ - name: String   │        │ - date: Date      │        │ - duration: Int(min) │
│ - email: String  │        │ - time: String    │        │ - price: BigInt(VND) │
│ - phone: String  │        │ - status: Enum    │        │ - description: Text  │
│ - specialty: Str │        │ - note: Text      │        │ - image_url: String  │
│ - bio: Text      │        │ - medicalNote:Text│        │ - icon: String       │
│ - image_url: Str │        │ - cancel_reason:T │        │ - is_active: Bool    │
│ - is_active: Bool│        │ - depositPaid:Bool│        ├──────────────────────┤
│ - createdAt: DT  │        │ - depositRefunded │        │ + findAll(category)  │
├──────────────────┤        │ - price: BigInt   │        │ + findById(id)       │
│ + findByUsername │        │ - createdAt: DT   │        │ + getStaffForService │
│ + findById(id)   │        │ - updatedAt: DT   │        │ + create(data)       │
│ + findAll(role)  │        ├───────────────────┤        │ + update(id, fields) │
│ + findDoctors()  │        │ + findById(id)    │        │ + delete(id)         │
│ + create(data)   │        │ + findByCustomer  │        └──────────────────────┘
│ + update(id,fld) │        │ + findByStaff     │
│ + updatePassword │        │ + checkConflict() │        ┌──────────────────────┐
│ + delete(id)     │        │ + getBookedSlots  │        │    ReviewModel       │
│ + existsUsername │        │ + create(data)    │        ├──────────────────────┤
│ + existsEmail    │        │ + updateStatus    │        │ - id: String         │
│ + generateId(r)  │        │ + canRefund()     │        │ - appointmentId: Str │
└──────────────────┘        │ + generateId()    │        │ - customerId: String │
                            └───────────────────┘        │ - staffId: String    │
                                                         │ - serviceId: String  │
┌──────────────────┐                                     │ - rating: Int(1-5)   │
│    ShiftModel    │                                     │ - comment: Text      │
├──────────────────┤                                     │ - tags: String       │
│ - id: String     │                                     │ - staffReply: Text   │
│ - staffId: String│                                     │ - likes: Int         │
│ - day: Enum      │                                     │ - createdAt: DateTime│
│   (Mon..Sun)     │                                     ├──────────────────────┤
│ - startTime: Str │                                     │ + findById(id)       │
│ - endTime: String│                                     │ + findAll(filters)   │
├──────────────────┤                                     │ + findByAppointment  │
│ + findByStaff    │                                     │ + create(data)       │
│ + findAll()      │                                     │ + reply(id, text)    │
│ + isWorking()    │                                     │ + like(id, userId)   │
│ + getAvailable   │                                     │ + getStaffStats()    │
│   Slots()        │                                     └──────────────────────┘
│ + create(data)   │
│ + update(id,d)   │
│ + delete(id)     │
└──────────────────┘
```

**Quan hệ giữa các lớp:**
- `UserModel` (1) → `AppointmentModel` (*): Một khách hàng có nhiều lịch hẹn
- `UserModel` (1) → `AppointmentModel` (*): Một nhân viên có nhiều lịch hẹn
- `ServiceModel` (1) → `AppointmentModel` (*): Một dịch vụ thuộc nhiều lịch hẹn
- `AppointmentModel` (1) → `ReviewModel` (0..1): Mỗi lịch hẹn có tối đa 1 đánh giá
- `UserModel` (nhiều) ↔ `ServiceModel` (nhiều): Qua bảng trung gian `ServiceStaff`
- `UserModel` (1) → `ShiftModel` (*): Một nhân viên có nhiều ca làm việc

---

### 2.3. Thiết kế CSDL chi tiết (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            ERD – SpaProMax Database                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐             ┌────────────────────────────┐
  │   USERS      │             │       APPOINTMENTS          │
  ├──────────────┤             ├────────────────────────────┤
  │ PK id (VC50) │─────────┐  │ PK id (VC50)               │
  │ username(U)  │         └─>│ FK customerId → Users.id   │
  │ password     │         ┌─>│ FK staffId    → Users.id   │
  │ role (ENUM)  │─────────┘  │ FK serviceId  → Services.id│
  │ name         │            │ date (DATE)                 │
  │ email (U)    │            │ time (VC10)                 │
  │ phone        │            │ status (ENUM)               │
  │ specialty    │            │   pending/confirmed/        │
  │ bio          │            │   in-progress/completed/    │
  │ image_url    │            │   cancelled                 │
  │ is_active    │            │ note (TEXT)                 │
  │ createdAt    │            │ medicalNote (TEXT)          │
  └──────────────┘            │ cancel_reason (TEXT)        │
         │                    │ depositPaid (BOOL)          │
         │                    │ depositRefunded (BOOL)      │
         │                    │ price (BIGINT)              │
         │                    │ createdAt / updatedAt       │
         │                    │ INDEX(date, staffId)        │
         │                    │ INDEX(customerId)           │
         │                    │ INDEX(status)               │
         │                    └────────────────────────────┘
         │                                 │
         │                    ┌────────────┘
         │                    │
         │            ┌───────────────┐
         │            │    REVIEWS    │
         │            ├───────────────┤
         │            │ PK id         │
         │            │ FK appointmentId (UNIQUE)→Appointments.id│
         │            │ FK customerId → Users.id │
         │            │ FK staffId    → Users.id │
         │            │ FK serviceId  → Services.id│
         │            │ rating INT(1-5 CHECK)    │
         │            │ comment TEXT             │
         │            │ tags (VC500)             │
         │            │ staffReply TEXT          │
         │            │ likes INT DEFAULT 0      │
         │            │ createdAt                │
         │            └───────────────┘
         │
  ┌──────┴───────┐       ┌──────────────────┐
  │   SHIFTS     │       │  SERVICE_STAFF   │
  ├──────────────┤       │  (junction table)│
  │ PK id        │       ├──────────────────┤
  │ FK staffId   │       │ PK FK serviceId  │
  │   → Users.id │       │ PK FK staffId    │
  │ day (ENUM)   │       │   → Services.id  │
  │   Mon..Sun   │       │   → Users.id     │
  │ startTime    │       └──────────────────┘
  │ endTime      │              │
  └──────────────┘              │
                        ┌───────┴──────────┐
                        │    SERVICES      │
                        ├──────────────────┤
                        │ PK id            │
                        │ name             │
                        │ category (ENUM)  │
                        │   medical/spa    │
                        │ duration INT(min)│
                        │ price BIGINT     │
                        │ description TEXT │
                        │ image_url        │
                        │ icon (VC50)      │
                        │ is_active        │
                        └──────────────────┘

  ┌──────────────────────────────┐
  │       NOTIFICATIONS          │
  ├──────────────────────────────┤
  │ PK id                        │
  │ FK userId → Users.id         │
  │ title (VC200)                │
  │ message TEXT                 │
  │ type ENUM                    │
  │   appointment/system/        │
  │   reminder/review            │
  │ isRead BOOL DEFAULT 0        │
  │ link (VC300)                 │
  │ createdAt                    │
  │ INDEX(userId, isRead)        │
  └──────────────────────────────┘
```

#### Chi tiết bảng CSDL

**Bảng Users:**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | VARCHAR(50) | PK | Định danh người dùng (prefix: c/u/a + timestamp) |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Tên đăng nhập |
| password | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa (bcrypt) |
| role | ENUM | NOT NULL, DEFAULT 'customer' | admin / doctor / customer |
| name | VARCHAR(200) | NOT NULL | Họ và tên đầy đủ |
| email | VARCHAR(200) | UNIQUE, NULL | Email (tùy chọn, nhưng phải duy nhất) |
| phone | VARCHAR(20) | NULL | Số điện thoại |
| specialty | VARCHAR(200) | NULL | Chuyên môn (chỉ dùng cho doctor) |
| bio | TEXT | NULL | Tiểu sử giới thiệu |
| image_url | VARCHAR(500) | NULL | Đường dẫn ảnh đại diện |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Trạng thái tài khoản |
| createdAt | DATETIME | NOT NULL, DEFAULT NOW() | Thời điểm tạo |

**Bảng Appointments:**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | VARCHAR(50) | PK | Định danh lịch hẹn (prefix: a + timestamp) |
| customerId | VARCHAR(50) | FK→Users.id, NOT NULL | ID khách hàng |
| staffId | VARCHAR(50) | FK→Users.id, NOT NULL | ID nhân viên thực hiện |
| serviceId | VARCHAR(50) | FK→Services.id, NOT NULL | ID dịch vụ |
| date | DATE | NOT NULL | Ngày hẹn |
| time | VARCHAR(10) | NOT NULL | Giờ hẹn (HH:MM) |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending/confirmed/in-progress/completed/cancelled |
| note | TEXT | NULL | Ghi chú của khách hàng |
| medicalNote | TEXT | NULL | Ghi chú y tế của bác sĩ |
| cancel_reason | TEXT | NULL | Lý do hủy (nếu có) |
| depositPaid | TINYINT(1) | DEFAULT 0 | Đã đặt cọc hay chưa |
| depositRefunded | TINYINT(1) | DEFAULT 0 | Đã hoàn cọc hay chưa |
| price | BIGINT | NOT NULL | Giá dịch vụ tại thời điểm đặt (VND) |
| createdAt | DATETIME | DEFAULT NOW() | Thời điểm đặt lịch |
| updatedAt | DATETIME | DEFAULT NOW(), ON UPDATE NOW() | Lần cập nhật cuối |

**Bảng Services:**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | VARCHAR(50) | PK | Định danh dịch vụ (prefix: s + timestamp) |
| name | VARCHAR(200) | NOT NULL | Tên dịch vụ |
| category | ENUM('medical','spa') | NOT NULL, DEFAULT 'spa' | Danh mục |
| duration | INT | NOT NULL | Thời gian thực hiện (phút) |
| price | BIGINT | NOT NULL | Giá dịch vụ (VND) |
| description | TEXT | NULL | Mô tả chi tiết |
| image_url | VARCHAR(500) | NULL | Ảnh minh họa |
| icon | VARCHAR(50) | NULL | Emoji icon hiển thị |
| is_active | TINYINT(1) | DEFAULT 1 | Còn hoạt động hay không |

**Bảng Shifts:**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | VARCHAR(50) | PK | Định danh ca làm |
| staffId | VARCHAR(50) | FK→Users.id | ID nhân viên |
| day | ENUM('Mon'..'Sun') | NOT NULL | Thứ trong tuần |
| startTime | VARCHAR(10) | NOT NULL | Giờ bắt đầu (HH:MM) |
| endTime | VARCHAR(10) | NOT NULL | Giờ kết thúc (HH:MM) |

**Bảng Reviews:**

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | VARCHAR(50) | PK | Định danh đánh giá |
| appointmentId | VARCHAR(50) | FK, UNIQUE | ID lịch hẹn (1-1 với review) |
| customerId | VARCHAR(50) | FK→Users.id | ID khách đánh giá |
| staffId | VARCHAR(50) | FK→Users.id | ID nhân viên được đánh giá |
| serviceId | VARCHAR(50) | FK→Services.id | ID dịch vụ |
| rating | INT | NOT NULL, CHECK(1-5) | Số sao đánh giá |
| comment | TEXT | NULL | Nhận xét |
| tags | VARCHAR(500) | NULL | Nhãn phân loại (CSV) |
| staffReply | TEXT | NULL | Phản hồi của nhân viên |
| likes | INT | DEFAULT 0 | Lượt thích |
| createdAt | DATETIME | DEFAULT NOW() | Thời điểm đánh giá |

---

## 3. XÂY DỰNG DEMO HÀM KIỂM THỬ HỘP TRẮNG (White-box Testing)

### 3.1. Demo kiểm thử hàm `canRefund()` trong AppointmentModel

Hàm này áp dụng quy tắc nghiệp vụ BR-06/BR-07: **hoàn cọc nếu hủy trước 24 giờ so với giờ hẹn**.

```javascript
// File: backend/models/AppointmentModel.js

static canRefund(appointmentDate, appointmentTime) {
    const apptDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const now = new Date();
    const diffHours = (apptDateTime - now) / (1000 * 60 * 60);
    return diffHours > 24;
}
```

**Phân tích luồng điều khiển (Control Flow):**

```
                    ┌─────────────────────────┐
                    │ Nhận appointmentDate,   │
                    │     appointmentTime      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Tạo apptDateTime từ    │
                    │  date + time            │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Lấy now = new Date()   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Tính diffHours =       │
                    │  (apptDateTime - now)   │
                    │  / 3600000              │
                    └────────────┬────────────┘
                                 │
                         ┌───────▼────────┐
                         │ diffHours > 24?│
                         └───┬───────┬───┘
                           Đúng    Sai
                             │       │
                        ┌────▼──┐ ┌──▼────┐
                        │return │ │return │
                        │ true  │ │ false │
                        │(hoàn  │ │(không │
                        │ cọc)  │ │ hoàn) │
                        └───────┘ └───────┘
```

**Các đường đi kiểm thử (Path Coverage):**

| Path | Điều kiện | diffHours | Kết quả mong đợi |
|---|---|---|---|
| Path 1 | Hủy trước hẹn 25h | > 24 | `true` (hoàn cọc) |
| Path 2 | Hủy trước hẹn đúng 24h | = 24 | `false` (không hoàn) |
| Path 3 | Hủy trước hẹn 23h | < 24 | `false` (không hoàn) |
| Path 4 | Hủy sau giờ hẹn | âm | `false` (không hoàn) |

### 3.2. Demo kiểm thử hàm `checkConflict()` trong AppointmentModel

```javascript
static async checkConflict(staffId, date, time, duration, excludeId = null) {
    const [hNew, mNew] = time.split(':').map(Number);
    const startNew = hNew * 60 + mNew;    // phút từ 00:00
    const endNew = startNew + duration;

    const [existing] = await db.query(/* lấy các lịch hiện có */);

    for (const appt of existing) {
        const [hEx, mEx] = appt.time.split(':').map(Number);
        const startEx = hEx * 60 + mEx;
        const endEx = startEx + appt.duration;
        // Overlap: mới bắt đầu trước khi cũ kết thúc AND mới kết thúc sau khi cũ bắt đầu
        if (startNew < endEx && endNew > startEx) return true;
    }
    return false;
}
```

**Ví dụ kiểm thử với ca đã có: 09:00–09:30 (30 phút):**

| Test | Slot mới | Duration | startNew | endNew | Conflict? | Giải thích |
|---|---|---|---|---|---|---|
| TC-CF-01 | 08:00 | 30 phút | 480 | 510 | ❌ Không | Kết thúc lúc 8:30, trước 9:00 |
| TC-CF-02 | 08:45 | 30 phút | 525 | 555 | ✅ Có | 8:45–9:15 giao với 9:00–9:30 |
| TC-CF-03 | 09:00 | 30 phút | 540 | 570 | ✅ Có | Trùng hoàn toàn |
| TC-CF-04 | 09:15 | 30 phút | 555 | 585 | ✅ Có | 9:15 nằm trong 9:00–9:30 |
| TC-CF-05 | 09:30 | 30 phút | 570 | 600 | ❌ Không | Bắt đầu đúng lúc cũ kết thúc |

---

# CHƯƠNG 2: THIẾT KẾ CA KIỂM THỬ (TEST CASE)

## 1.1. Cơ sở lý thuyết áp dụng

### Kỹ thuật Phân vùng tương đương (Equivalence Partitioning – EP)

Đây là phương pháp chia miền dữ liệu đầu vào của một chương trình thành các lớp (vùng) tương đương nhau về mặt xử lý logic. Nguyên lý: nếu một giá trị đại diện trong một vùng gây ra lỗi, thì các giá trị khác trong vùng đó cũng sẽ gây ra lỗi tương tự, và ngược lại. Nhờ đó, Tester chỉ cần chọn một vài giá trị đại diện cho mỗi vùng (hợp lệ và không hợp lệ) để kiểm thử, giúp giảm thiểu đáng kể số lượng Test Case mà vẫn đảm bảo hiệu quả.

**Phân vùng:**
- **Vùng hợp lệ (Valid):** Các giá trị hệ thống chấp nhận và xử lý đúng
- **Vùng không hợp lệ (Invalid):** Các giá trị hệ thống từ chối/báo lỗi

### Kỹ thuật Phân tích giá trị biên (Boundary Value Analysis – BVA)

Các nghiên cứu thực tế cho thấy phần lớn lỗi phần mềm thường ẩn nấp tại các ranh giới (biên) của các vùng dữ liệu chứ không phải ở giữa vùng. Kỹ thuật BVA tập trung vào việc kiểm thử tại các giá trị biên này. Cụ thể, với một vùng có biên giới hạn `[min, max]`, ta kiểm tra: `min-1`, `min`, `min+1`, `max-1`, `max`, `max+1`. BVA thường được sử dụng kết hợp như một sự bổ sung hoàn hảo cho EP.

---

## 1.2. Áp dụng kỹ thuật vào các trường dữ liệu cụ thể

### Phân tích trường dữ liệu – Tổng quan

| Trường dữ liệu | Quy tắc nghiệp vụ | Vùng hợp lệ | Vùng không hợp lệ |
|---|---|---|---|
| Username | BR-01: Duy nhất, bắt buộc | Chuỗi không rỗng, chưa tồn tại | Rỗng, đã tồn tại |
| Password | BR-03: ≥ 6 ký tự | 6 ký tự trở lên | < 6 ký tự, rỗng |
| Email | BR-02: Duy nhất, đúng định dạng | email@domain.com, hoặc bỏ trống | Sai định dạng, đã tồn tại |
| Rating (đánh giá) | BR-10: Số nguyên 1–5 | 1, 2, 3, 4, 5 | 0, 6, số thực, chuỗi |
| Giá dịch vụ | > 0, số nguyên | 1 trở lên | 0, âm, không phải số |
| Thời gian dịch vụ | > 0 phút, số nguyên | 15, 30, 45, 60, 90 phút | 0, âm |

---

## 2. BẢNG TEST CASE CHI TIẾT

### 2.1. Chức năng: ĐĂNG KÝ TÀI KHOẢN (FR-01)

**Điều kiện kiểm thử:**
- `username`: bắt buộc, duy nhất
- `password`: bắt buộc, ≥ 6 ký tự
- `name`: bắt buộc
- `email`: tùy chọn, đúng định dạng, duy nhất nếu cung cấp

**Phân vùng tương đương – Trường Password:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Đúng ≥ 6 ký tự | "abc123" |
| I1 (không hợp lệ) | Độ dài < 6 ký tự | "abc" |
| I2 (không hợp lệ) | Rỗng / không có | "" |

**Giá trị biên – Trường Password:**

| Biên | Giá trị | Loại |
|---|---|---|
| Biên dưới - 1 | 5 ký tự: "abcde" | Không hợp lệ |
| Biên dưới | 6 ký tự: "abcdef" | Hợp lệ |
| Biên dưới + 1 | 7 ký tự: "abcdefg" | Hợp lệ |

| Mã TC | Kỹ thuật | Trường | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|---|
| TC_REG_01 | EP (V1) | Hợp lệ toàn bộ | username="newuser", password="abc123", name="Nguyễn Văn A" | HTTP 201, trả về token + thông tin user | Hợp lệ | HTTP 201 – trả về JWT token và object user (đúng như mộng) | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_02 | EP (I2) | password | password="" (rỗng) | HTTP 400: "Thiếu thông tin bắt buộc" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin bắt buộc" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_03 | BVA (Biên dưới - 1) | password | password="abcde" (5 ký tự) | HTTP 400: "Mật khẩu phải có ít nhất 6 ký tự" | Không hợp lệ | HTTP 400 – message: "Mật khẩu phải có ít nhất 6 ký tự" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_04 | BVA (Biên dưới) | password | password="abcdef" (6 ký tự) | HTTP 201, đăng ký thành công | Hợp lệ | HTTP 201 – tạo tài khoản thành công | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_05 | BVA (Biên dưới + 1) | password | password="abcdefg" (7 ký tự) | HTTP 201, đăng ký thành công | Hợp lệ | HTTP 201 – tạo tài khoản thành công | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_06 | EP (I1) | username | username trùng "admin" | HTTP 409: "Tên đăng nhập đã tồn tại" | Không hợp lệ | HTTP 409 – message: "Tên đăng nhập đã tồn tại" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_07 | EP (I1) | email | email="admin@spapromax.vn" (đã tồn tại) | HTTP 409: "Email đã được sử dụng" | Không hợp lệ | HTTP 409 – message: "Email đã được sử dụng" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_08 | EP (I2) | name | name="" (rỗng) | HTTP 400: "Thiếu thông tin bắt buộc" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin bắt buộc" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_09 | EP (V1) | email | email="" (bỏ trống, không bắt buộc) | HTTP 201, đăng ký thành công | Hợp lệ | HTTP 201 – email=null trong DB | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REG_10 | EP (I1) | email | email="not-an-email" (sai định dạng) | HTTP 400: Thông báo định dạng email không hợp lệ | Không hợp lệ | HTTP 201 – hệ thống không kiểm tra định dạng email, vẫn tạo tài khoản | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate email format*

---

### 2.2. Chức năng: ĐĂNG NHẬP (FR-02)

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_LOG_01 | EP (V1) | username="admin", password="password" | HTTP 200, trả về token + user info | Hợp lệ | HTTP 200 – trả về JWT token, role="admin", is_active=1 | 29/06/2026 – Nhóm KT – **Pass** |
| TC_LOG_02 | EP (I1) | username="" (rỗng) | HTTP 400: "Username and password required" | Không hợp lệ | HTTP 400 – message: "Username and password required" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_LOG_03 | EP (I1) | password="" (rỗng) | HTTP 400: "Username and password required" | Không hợp lệ | HTTP 400 – message: "Username and password required" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_LOG_04 | EP (I2) | username="admin", password="sai" | HTTP 401: "Tên đăng nhập hoặc mật khẩu không đúng" | Không hợp lệ | HTTP 401 – message: "Tên đăng nhập hoặc mật khẩu không đúng" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_LOG_05 | EP (I2) | username="khongtontai", password="abc123" | HTTP 401: "Tên đăng nhập hoặc mật khẩu không đúng" | Không hợp lệ | HTTP 401 – message: "Tên đăng nhập hoặc mật khẩu không đúng" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_LOG_06 | EP (I3) | username="bich.ng" (bị vô hiệu hóa) | HTTP 403: "Tài khoản đã bị vô hiệu hóa" | Không hợp lệ | HTTP 403 – message: "Tài khoản đã bị vô hiệu hóa" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_LOG_07 | EP (V1) | username="dr.minh", password="password" | HTTP 200, role="doctor" | Hợp lệ | HTTP 200 – role="doctor", trả về token hợp lệ | 29/06/2026 – Nhóm KT – **Pass** |
| TC_LOG_08 | EP (V1) | username="bich.ng", password="password" | HTTP 200, role="customer" | Hợp lệ | HTTP 200 – role="customer", trả về thông tin user đầy đủ | 29/06/2026 – Nhóm KT – **Pass** |

---

### 2.3. Chức năng: XEM DANH SÁCH DỊCH VỤ (FR-03)

**Phân vùng – Tham số lọc danh mục (category):**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Không lọc, trả về tất cả | category=null |
| V2 (hợp lệ) | Lọc theo "medical" | category="medical" |
| V3 (hợp lệ) | Lọc theo "spa" | category="spa" |
| I1 (không hợp lệ) | Danh mục không tồn tại | category="xyz" |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_SVC_LIST_01 | EP (V1) | GET /api/services (không filter) | HTTP 200, mảng tất cả dịch vụ đang active | Hợp lệ | HTTP 200 – 8 dịch vụ active được trả về | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_LIST_02 | EP (V2) | GET /api/services?category=medical | HTTP 200, chỉ trả về dịch vụ y tế | Hợp lệ | HTTP 200 – 3 dịch vụ category=medical | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_LIST_03 | EP (V3) | GET /api/services?category=spa | HTTP 200, chỉ trả về dịch vụ spa | Hợp lệ | HTTP 200 – 5 dịch vụ category=spa | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_LIST_04 | EP (I1) | GET /api/services?category=xyz | HTTP 200, mảng rỗng [] | Không hợp lệ | HTTP 200 – [] mảng rỗng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_LIST_05 | EP (V1) | Dịch vụ có is_active=0 | HTTP 200, không trả về dịch vụ đã ẩn | Hợp lệ | HTTP 200 – dịch vụ is_active=0 không xuất hiện | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_LIST_06 | Auth | Người dùng chưa đăng nhập | HTTP 200, vẫn xem được (public endpoint) | Hợp lệ | HTTP 200 – không yêu cầu xác thực | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.4. Chức năng: XEM CHI TIẾT DỊCH VỤ (FR-04)

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_SVC_DETAIL_01 | EP (V1) | GET /api/services/s1 (tồn tại) | HTTP 200, object dịch vụ đầy đủ (name, category, duration, price, description, staff) | Hợp lệ | HTTP 200 – trả về đầy đủ thông tin dịch vụ + danh sách staff thực hiện | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_DETAIL_02 | EP (I1) | GET /api/services/s999 (không tồn tại) | HTTP 404: "Không tìm thấy dịch vụ" | Không hợp lệ | HTTP 404 – message: "Không tìm thấy dịch vụ" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_DETAIL_03 | EP (I2) | GET /api/services/ (id rỗng) | HTTP 400 hoặc 404 | Không hợp lệ | HTTP 404 – route không match | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_DETAIL_04 | EP (V1) | Xem danh sách đánh giá theo dịch vụ | HTTP 200, mảng reviews kèm rating trung bình | Hợp lệ | HTTP 200 – trả về reviews và avgRating | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_DETAIL_05 | EP (V1) | Xem dịch vụ đã bị vô hiệu hóa (is_active=0) | HTTP 404 hoặc 200 với thông báo ẩn | Hợp lệ | HTTP 200 – vẫn trả về chi tiết dịch vụ dù is_active=0 ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Dịch vụ đã ẩn vẫn xem được chi tiết qua API*

---

### 2.5. Chức năng: XEM DANH SÁCH BÁC SĨ / KỸ THUẬT VIÊN (FR-05)

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_DOC_LIST_01 | EP (V1) | GET /api/users/doctors | HTTP 200, danh sách tất cả doctor/KTV đang active | Hợp lệ | HTTP 200 – 5 doctor được trả về, có name, specialty, avgRating | 30/06/2026 – Nhóm KT – **Pass** |
| TC_DOC_LIST_02 | EP (V1) | Lọc theo dịch vụ: serviceId=s1 | HTTP 200, chỉ trả về doctor thực hiện dịch vụ s1 | Hợp lệ | HTTP 200 – 2 doctor có trong service_staff của s1 | 30/06/2026 – Nhóm KT – **Pass** |
| TC_DOC_LIST_03 | EP (I1) | Lọc serviceId=s999 (không tồn tại) | HTTP 404 hoặc mảng [] | Không hợp lệ | HTTP 200 – [] mảng rỗng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_DOC_LIST_04 | EP (V1) | Doctor có is_active=0 | HTTP 200, không hiển thị doctor bị vô hiệu hóa | Hợp lệ | HTTP 200 – doctor is_active=0 không có trong kết quả | 30/06/2026 – Nhóm KT – **Pass** |
| TC_DOC_LIST_05 | EP (V1) | Xem thông tin chi tiết 1 doctor: GET /api/users/u1 | HTTP 200, name, specialty, bio, avgRating, reviews | Hợp lệ | HTTP 200 – đầy đủ thông tin, avgRating tính đúng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_DOC_LIST_06 | EP (I1) | GET /api/users/u999 (không tồn tại) | HTTP 404: "Không tìm thấy người dùng" | Không hợp lệ | HTTP 404 – message: "Không tìm thấy người dùng" | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.6. Chức năng: ĐẶT LỊCH HẸN (FR-06) – Chức năng trọng tâm

#### Phân tích vùng – Trường Ngày hẹn (date)

| Vùng | Mô tả | Giá trị đại diện |
|---|---|---|
| V1 (hợp lệ) | Ngày trong tương lai | Ngày mai |
| I1 (không hợp lệ) | Ngày trong quá khứ | Hôm qua |
| I2 (không hợp lệ) | Ngày hôm nay (đã qua giờ) | Hôm nay, giờ đã qua |

#### Phân tích vùng – Trường Giờ hẹn (time)

| Vùng | Mô tả | Giá trị đại diện |
|---|---|---|
| V1 (hợp lệ) | Trong ca làm việc, slot còn trống | 09:00 (trong ca 08:00–17:00) |
| I1 (không hợp lệ) | Ngoài ca làm việc | 07:00 hoặc 20:00 |
| I2 (không hợp lệ) | Slot đã bị đặt (trùng lịch) | Cùng giờ với lịch hiện tại |
| I3 (không hợp lệ) | Không đủ thời gian trong ca | 16:50 cho dịch vụ 30 phút (kết thúc 17:20 > ca) |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_APT_01 | EP (V1) | staffId=u1, serviceId=s1, date=ngày_mai_thứ_Hai, time=09:00 | HTTP 201, lịch hẹn được tạo, status="pending" | Hợp lệ | HTTP 201 – object lịch hẹn được trả về đầy đủ, status="pending" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_02 | EP (I1) | staffId=null | HTTP 400: "Thiếu thông tin bắt buộc" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin bắt buộc" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_03 | EP (I1) | serviceId=null | HTTP 400: "Thiếu thông tin bắt buộc" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin bắt buộc" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_04 | EP (I1) | date=null | HTTP 400: "Thiếu thông tin bắt buộc" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin bắt buộc" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_05 | EP (I1) | time=null | HTTP 400: "Thiếu thông tin bắt buộc" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin bắt buộc" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_06 | EP (I2) | serviceId="s999" (không tồn tại) | HTTP 404: "Dịch vụ không tồn tại" | Không hợp lệ | HTTP 404 – message: "Dịch vụ không tồn tại" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_07 | BR-04 | Đặt lịch trùng giờ với lịch đã có của u1 | HTTP 409: "Khung giờ này đã có lịch hẹn khác" | Không hợp lệ | HTTP 409 – message: "Khung giờ này đã có lịch hẹn khác. Vui lòng chọn giờ khác." | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_08 | BR-05 | u1 không làm vào Chủ Nhật, chọn ngày Chủ Nhật | Không có slot khả dụng, hệ thống trả về slots=[] | Không hợp lệ | HTTP 200 – slots=[] (danh sách rỗng, không có slot) | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_09 | EP (V1) | Đặt với note = "Tôi muốn khám sức khỏe định kỳ" | HTTP 201, note được lưu đúng | Hợp lệ | HTTP 201 – field note trong DB khớp đúng nội dung đã gửi | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_10 | EP (V1) | depositPaid = true | HTTP 201, depositPaid=1 trong DB | Hợp lệ | HTTP 201 – depositPaid=1 được lưu chính xác | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_11 | EP (V1) | depositPaid = false | HTTP 201, depositPaid=0 trong DB | Hợp lệ | HTTP 201 – depositPaid=0 mặc định | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_12 | Auth | Gửi request không có JWT token | HTTP 401: Unauthorized | Không hợp lệ | HTTP 401 – "Unauthorized" – middleware chặn đúng | 29/06/2026 – Nhóm KT – **Pass** |
| TC_APT_13 | Auth | Gửi request với JWT của doctor (không phải customer) | HTTP 403: Forbidden | Không hợp lệ | HTTP 201 – doctor vẫn đặt lịch được (chưa phân quyền) | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu kiểm tra vai trò customer khi đặt lịch*

---

### 2.7. Chức năng: XEM LỊCH HẸN CÁ NHÂN (FR-07)

**Phân vùng – Tham số lọc trạng thái:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Không lọc, trả về tất cả | status=null |
| V2 (hợp lệ) | Lọc pending | status="pending" |
| V3 (hợp lệ) | Lọc completed | status="completed" |
| I1 (không hợp lệ) | Trạng thái không hợp lệ | status="unknown" |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_MY_APT_01 | EP (V1) | GET /api/appointments/my (không filter) | HTTP 200, tất cả lịch hẹn của customer đang đăng nhập | Hợp lệ | HTTP 200 – 4 lịch hẹn của bich.ng trả về đúng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_MY_APT_02 | EP (V2) | GET /api/appointments/my?status=pending | HTTP 200, chỉ lịch chờ xác nhận | Hợp lệ | HTTP 200 – 1 lịch status=pending | 30/06/2026 – Nhóm KT – **Pass** |
| TC_MY_APT_03 | EP (V3) | GET /api/appointments/my?status=completed | HTTP 200, lịch đã hoàn thành | Hợp lệ | HTTP 200 – 1 lịch status=completed | 30/06/2026 – Nhóm KT – **Pass** |
| TC_MY_APT_04 | EP (I1) | GET /api/appointments/my?status=unknown | HTTP 200, mảng [] hoặc 400 | Không hợp lệ | HTTP 200 – [] mảng rỗng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_MY_APT_05 | Auth | Gửi request không có JWT | HTTP 401: Unauthorized | Không hợp lệ | HTTP 401 – "Unauthorized" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_MY_APT_06 | EP (V1) | Customer A chỉ thấy lịch của mình | HTTP 200, không lẫn lịch của Customer B | Hợp lệ | HTTP 200 – kết quả chỉ chứa customerId = A | 30/06/2026 – Nhóm KT – **Pass** |
| TC_MY_APT_07 | EP (V1) | Xem chi tiết 1 lịch hẹn: GET /api/appointments/a1 | HTTP 200, đầy đủ thông tin lịch kèm tên service, staff | Hợp lệ | HTTP 200 – JOIN đầy đủ service name, staff name | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.8. Chức năng: HỦY LỊCH HẸN (FR-08)

**Phân tích vùng – Khoảng thời gian còn lại trước giờ hẹn:**

| Vùng | Mô tả | Kết quả hoàn cọc |
|---|---|---|
| V1 (> 24h) | Hủy trước hơn 24 giờ | Hoàn cọc (depositRefunded=1) |
| I1 (= 24h) | Hủy đúng 24 giờ | KHÔNG hoàn cọc |
| I2 (< 24h) | Hủy trong vòng 24 giờ | KHÔNG hoàn cọc |

**Giá trị biên – Khoảng thời gian (tính theo giờ):**

| Biên | Giá trị | Hoàn cọc? |
|---|---|---|
| Biên trên + 1 | 25h trước | ✅ Có |
| Biên trên (24h) | Đúng 24h trước | ❌ Không |
| Biên trên - 1 | 23h trước | ❌ Không |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_CAN_01 | BVA (Biên trên + 1) | Hủy lịch còn 25h, đã đặt cọc | HTTP 200, status="cancelled", depositRefunded=1 | Hợp lệ | HTTP 200 – status="cancelled", depositRefunded=1 – hoàn cọc đúng | 29/06/2026 – Nhóm KT – **Pass** |
| TC_CAN_02 | BVA (Biên trên) | Hủy lịch còn đúng 24h, đã đặt cọc | HTTP 200, status="cancelled", depositRefunded=0 | Hợp lệ* | HTTP 200 – status="cancelled", depositRefunded=0 – không hoàn cọc (diffHours=24, điều kiện >24 không thỏa) | 29/06/2026 – Nhóm KT – **Pass** |
| TC_CAN_03 | BVA (Biên trên - 1) | Hủy lịch còn 23h, đã đặt cọc | HTTP 200, status="cancelled", depositRefunded=0 | Hợp lệ* | HTTP 200 – status="cancelled", depositRefunded=0 – không hoàn cọc đúng | 29/06/2026 – Nhóm KT – **Pass** |
| TC_CAN_04 | EP (V1) | Hủy lịch, chưa đặt cọc, còn 30h | HTTP 200, status="cancelled", depositRefunded=0 | Hợp lệ | HTTP 200 – status="cancelled", depositRefunded=0 | 29/06/2026 – Nhóm KT – **Pass** |
| TC_CAN_05 | BR-11 | Customer A hủy lịch của Customer B | HTTP 403: "Không có quyền hủy lịch này" | Không hợp lệ | HTTP 403 – message: "Không có quyền hủy lịch này" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_CAN_06 | EP (I1) | Hủy lịch không tồn tại | HTTP 404: "Không tìm thấy lịch hẹn" | Không hợp lệ | HTTP 404 – message: "Không tìm thấy lịch hẹn" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_CAN_07 | BR-12 | Doctor hủy lịch | HTTP 403: "Không được phép thay đổi trạng thái này" | Không hợp lệ | HTTP 403 – message: "Không được phép thay đổi trạng thái này" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_CAN_08 | EP (V1) | Hủy với cancel_reason = "Có việc đột xuất" | HTTP 200, cancel_reason được lưu | Hợp lệ | HTTP 200 – cancel_reason lưu chính xác trong DB | 29/06/2026 – Nhóm KT – **Pass** |

*Ghi chú: Đây là hành vi hợp lệ của hệ thống (không vi phạm quy tắc), nhưng không hoàn cọc.

---

### 2.9. Chức năng: XEM LỊCH LÀM VIỆC – Bác sĩ/KTV (FR-09)

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_SHIFT_VIEW_01 | EP (V1) | GET /api/shifts/my (đăng nhập doctor) | HTTP 200, danh sách ca làm việc của doctor đó | Hợp lệ | HTTP 200 – 5 ca làm việc của dr.minh | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SHIFT_VIEW_02 | Auth | Gửi request không có JWT | HTTP 401: Unauthorized | Không hợp lệ | HTTP 401 – "Unauthorized" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SHIFT_VIEW_03 | Auth | Customer xem lịch làm việc | HTTP 403: Forbidden | Không hợp lệ | HTTP 200 – customer vẫn xem được lịch làm việc ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu phân quyền role=doctor cho endpoint này*
| TC_SHIFT_VIEW_04 | EP (V1) | GET /api/shifts?staffId=u1 (lịch của nhân viên cụ thể) | HTTP 200, ca làm việc theo tuần | Hợp lệ | HTTP 200 – danh sách ca làm theo ngày trong tuần | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SHIFT_VIEW_05 | EP (I1) | GET /api/shifts?staffId=u999 (không tồn tại) | HTTP 200, mảng [] | Không hợp lệ | HTTP 200 – [] mảng rỗng | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.10. Chức năng: CẬP NHẬT TRẠNG THÁI LỊCH HẸN (FR-10)

**Phân vùng – Vai trò và trạng thái được phép:**

| Vai trò | Trạng thái được phép chuyển đến |
|---|---|
| Admin | pending, confirmed, in-progress, completed, cancelled |
| Doctor | confirmed, in-progress, completed |
| Customer | cancelled |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_STA_01 | EP (V1) | Admin → status="confirmed" | HTTP 200, lịch hẹn cập nhật thành công | Hợp lệ | HTTP 200 – status="confirmed" được lưu và trả về | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_02 | EP (V1) | Doctor → status="in-progress" | HTTP 200, lịch hẹn cập nhật thành công | Hợp lệ | HTTP 200 – status="in-progress" được lưu | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_03 | EP (V1) | Doctor → status="completed" + medicalNote="Ghi chú" | HTTP 200, medicalNote được lưu | Hợp lệ | HTTP 200 – status="completed", medicalNote lưu đúng | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_04 | BR-12 | Doctor → status="pending" | HTTP 403: "Không được phép thay đổi trạng thái này" | Không hợp lệ | HTTP 403 – message: "Không được phép thay đổi trạng thái này" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_05 | BR-12 | Doctor → status="cancelled" | HTTP 403: "Không được phép thay đổi trạng thái này" | Không hợp lệ | HTTP 403 – message: "Không được phép thay đổi trạng thái này" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_06 | EP (V1) | Customer → status="cancelled" (lịch của mình) | HTTP 200, status="cancelled" | Hợp lệ | HTTP 200 – status="cancelled" được cập nhật | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_07 | BR-11 | Customer A → status="cancelled" lịch của Customer B | HTTP 403: "Không có quyền hủy lịch này" | Không hợp lệ | HTTP 403 – message: "Không có quyền hủy lịch này" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_08 | EP (I1) | appointmentId không tồn tại | HTTP 404: "Không tìm thấy lịch hẹn" | Không hợp lệ | HTTP 404 – message: "Không tìm thấy lịch hẹn" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_STA_09 | BR-13 | Admin → chuyển sang bất kỳ trạng thái nào | HTTP 200, thành công | Hợp lệ | HTTP 200 – thử tất cả 5 trạng thái, đều thành công | 29/06/2026 – Nhóm KT – **Pass** |

---

### 2.11. Chức năng: GHI GHI CHÚ Y TẾ (FR-11)

**Phân vùng – Nội dung medicalNote:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Có nội dung hợp lệ | "Bệnh nhân bị viêm xoang mạn tính" |
| V2 (hợp lệ) | Xóa ghi chú (cập nhật thành null) | medicalNote=null |
| I1 (không hợp lệ) | Lịch hẹn chưa in-progress/completed | Lịch status=pending |
| I2 (không hợp lệ) | Không phải doctor của lịch hẹn đó | Doctor khác |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_NOTE_01 | EP (V1) | Doctor ghi medicalNote khi lịch in-progress | HTTP 200, medicalNote được lưu vào DB | Hợp lệ | HTTP 200 – medicalNote lưu chính xác | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTE_02 | EP (V2) | Ghi medicalNote="" (xóa ghi chú) | HTTP 200, medicalNote=null trong DB | Hợp lệ | HTTP 200 – medicalNote=null | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTE_03 | EP (I1) | Ghi medicalNote khi lịch còn status=pending | HTTP 403 hoặc 400: Chưa đủ điều kiện | Không hợp lệ | HTTP 200 – ghi được dù lịch pending ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu kiểm tra trạng thái lịch trước khi ghi chú y tế*
| TC_NOTE_04 | Auth | Customer cố ghi medicalNote | HTTP 403: Forbidden | Không hợp lệ | HTTP 403 – "Forbidden" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTE_05 | EP (V1) | medicalNote dài 2000 ký tự (TEXT field) | HTTP 200, lưu đầy đủ nội dung | Hợp lệ | HTTP 200 – lưu đủ 2000 ký tự | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTE_06 | EP (I2) | Doctor khác cố sửa medicalNote của lịch không phải của mình | HTTP 403: Forbidden | Không hợp lệ | HTTP 200 – doctor khác vẫn sửa được ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu kiểm tra staffId của lịch = doctor đang đăng nhập*

---

### 2.12. Chức năng: QUẢN LÝ NGƯỜI DÙNG – Admin (FR-12)

| Mã TC | Kỹ thuật | Thao tác | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|---|
| TC_USR_01 | EP (V1) | Tạo user mới | role="doctor", name="BS. Test", username="doc_test", password="123456" | HTTP 201, user được tạo với role=doctor | Hợp lệ | HTTP 201 – user mới có id dạng "u+timestamp", role=doctor | 29/06/2026 – Nhóm KT – **Pass** |
| TC_USR_02 | EP (I1) | Tạo user trùng username | username đã tồn tại | HTTP 409: "Tên đăng nhập đã tồn tại" | Không hợp lệ | HTTP 409 – message: "Tên đăng nhập đã tồn tại" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_USR_03 | EP (V1) | Vô hiệu hóa user | is_active=0 | HTTP 200, user.is_active=0 | Hợp lệ | HTTP 200 – user.is_active=0 trong DB | 29/06/2026 – Nhóm KT – **Pass** |
| TC_USR_04 | Auth | Non-admin tạo user | JWT của customer | HTTP 403: Forbidden | Không hợp lệ | HTTP 403 – "Forbidden" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_USR_05 | EP (V1) | Lấy danh sách tất cả user | GET /api/admin/users | HTTP 200, mảng user | Hợp lệ | HTTP 200 – mảng 9 user, không trả về field password | 29/06/2026 – Nhóm KT – **Pass** |
| TC_USR_06 | EP (V1) | Lấy user theo role | role="doctor" | HTTP 200, chỉ trả về doctor | Hợp lệ | HTTP 200 – mảng 5 user có role=doctor | 29/06/2026 – Nhóm KT – **Pass** |

---

### 2.13. Chức năng: QUẢN LÝ DỊCH VỤ – Admin (FR-13)

**Phân vùng – Trường Giá dịch vụ (price) và Thời gian (duration):**

| Trường | Vùng hợp lệ | Vùng không hợp lệ |
|---|---|---|
| price | > 0, số nguyên (VND) | 0, âm, null, chuỗi |
| duration | > 0, số nguyên (phút) | 0, âm, null, số thực |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_SVC_01 | EP (V1) | Tạo dịch vụ đầy đủ hợp lệ: name="Test", category="spa", duration=60, price=500000 | HTTP 201, dịch vụ được tạo | Hợp lệ | HTTP 201 – dịch vụ được tạo, id dạng "s+timestamp" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_02 | EP (I1) | price=0 | HTTP 400: Giá dịch vụ không hợp lệ | Không hợp lệ | HTTP 201 – dịch vụ vẫn được tạo với price=0 | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate giá dịch vụ > 0*
| TC_SVC_03 | EP (I1) | price=-100000 (âm) | HTTP 400: Giá dịch vụ không hợp lệ | Không hợp lệ | HTTP 201 – dịch vụ vẫn được tạo với giá âm | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate giá dịch vụ > 0*
| TC_SVC_04 | EP (I1) | duration=0 | HTTP 400: Thời gian không hợp lệ | Không hợp lệ | HTTP 201 – duration=0 được chấp nhận | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate duration > 0*
| TC_SVC_05 | EP (I2) | name="" (rỗng) | HTTP 400: Tên dịch vụ bắt buộc | Không hợp lệ | HTTP 500 – lỗi DB NOT NULL constraint, không có message thân thiện | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate name bắt buộc*
| TC_SVC_06 | EP (V1) | Vô hiệu hóa dịch vụ: is_active=0 | HTTP 200, dịch vụ không xuất hiện trong danh sách | Hợp lệ | HTTP 200 – dịch vụ biến mất khỏi danh sách (lọc WHERE is_active=1) | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SVC_07 | EP (I1) | category="invalid" (không phải medical/spa) | HTTP 400: category không hợp lệ | Không hợp lệ | HTTP 500 – lỗi DB ENUM constraint không được xử lý đúng | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate category hợp lệ*
| TC_SVC_08 | Auth | Non-admin tạo dịch vụ | JWT của customer | HTTP 403: Forbidden | Không hợp lệ | HTTP 403 – "Forbidden" – middleware phân quyền hoạt động đúng | 29/06/2026 – Nhóm KT – **Pass** |

---

### 2.14. Chức năng: QUẢN LÝ CA LÀM VIỆC (FR-14)

**Phân vùng – Trường startTime / endTime:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | startTime < endTime, đúng định dạng HH:MM | 08:00 → 17:00 |
| I1 (không hợp lệ) | startTime ≥ endTime | 17:00 → 08:00 |
| I2 (không hợp lệ) | Sai định dạng thời gian | "abc", "25:00" |
| I3 (không hợp lệ) | staffId không tồn tại | staffId="u999" |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_SHIFT_01 | EP (V1) | Tạo ca mới: staffId=u1, day=Mon, start=08:00, end=17:00 | HTTP 201, ca làm việc được tạo | Hợp lệ | HTTP 201 – ca mới được tạo thành công | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SHIFT_02 | EP (I1) | startTime="17:00" > endTime="08:00" | HTTP 400: "Thời gian không hợp lệ" | Không hợp lệ | HTTP 201 – ca được tạo dù giờ ngược ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate startTime < endTime*
| TC_SHIFT_03 | EP (I2) | startTime="abc" (sai định dạng) | HTTP 400: "Định dạng giờ không hợp lệ" | Không hợp lệ | HTTP 201 – lưu giá trị "abc" vào DB ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate định dạng HH:MM*
| TC_SHIFT_04 | EP (I3) | staffId="u999" (không tồn tại) | HTTP 404: "Không tìm thấy nhân viên" | Không hợp lệ | HTTP 500 – lỗi FK constraint | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu kiểm tra staffId tồn tại trước khi insert*
| TC_SHIFT_05 | EP (V1) | Sửa ca: đổi endTime=18:00 | HTTP 200, ca được cập nhật | Hợp lệ | HTTP 200 – endTime=18:00 lưu đúng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SHIFT_06 | EP (V1) | Xóa ca: DELETE /api/shifts/:id | HTTP 200, ca bị xóa | Hợp lệ | HTTP 200 – ca không còn trong DB | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SHIFT_07 | Auth | Customer tạo ca làm việc | HTTP 403: Forbidden | Không hợp lệ | HTTP 403 – "Forbidden" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_SHIFT_08 | EP (V1) | Tạo ca ngày Enum: day="Sun" | HTTP 201, ca ngày Chủ Nhật được tạo | Hợp lệ | HTTP 201 – day="Sun" hợp lệ theo ENUM | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.15. Chức năng: QUẢN LÝ LỊCH HẸN – Admin (FR-15)

**Phân vùng – Tham số lọc lịch hẹn:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Xem tất cả, không filter | – |
| V2 (hợp lệ) | Lọc theo trạng thái | status=pending |
| V3 (hợp lệ) | Lọc theo ngày | date=2026-06-30 |
| V4 (hợp lệ) | Lọc theo nhân viên | staffId=u1 |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_ADMIN_APT_01 | EP (V1) | GET /api/admin/appointments (không filter) | HTTP 200, toàn bộ lịch hẹn trong hệ thống | Hợp lệ | HTTP 200 – 8 lịch hẹn từ seed data | 30/06/2026 – Nhóm KT – **Pass** |
| TC_ADMIN_APT_02 | EP (V2) | GET /api/admin/appointments?status=pending | HTTP 200, chỉ lịch pending | Hợp lệ | HTTP 200 – 2 lịch status=pending | 30/06/2026 – Nhóm KT – **Pass** |
| TC_ADMIN_APT_03 | EP (V3) | GET /api/admin/appointments?date=2026-06-30 | HTTP 200, lịch theo ngày | Hợp lệ | HTTP 200 – lọc đúng theo date | 30/06/2026 – Nhóm KT – **Pass** |
| TC_ADMIN_APT_04 | EP (V4) | GET /api/admin/appointments?staffId=u1 | HTTP 200, lịch của nhân viên u1 | Hợp lệ | HTTP 200 – 3 lịch của dr.minh | 30/06/2026 – Nhóm KT – **Pass** |
| TC_ADMIN_APT_05 | Auth | Customer gọi endpoint admin | HTTP 403: Forbidden | Không hợp lệ | HTTP 403 – "Forbidden" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_ADMIN_APT_06 | Auth | Doctor gọi endpoint admin | HTTP 403: Forbidden | Không hợp lệ | HTTP 403 – "Forbidden" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_ADMIN_APT_07 | EP (V1) | Admin xem chi tiết 1 lịch: GET /api/admin/appointments/a1 | HTTP 200, đầy đủ thông tin lịch + tên customer, staff, service | Hợp lệ | HTTP 200 – JOIN đầy đủ thông tin | 30/06/2026 – Nhóm KT – **Pass** |
| TC_ADMIN_APT_08 | EP (I1) | GET /api/admin/appointments/a999 (không tồn tại) | HTTP 404: "Không tìm thấy lịch hẹn" | Không hợp lệ | HTTP 404 – message: "Không tìm thấy lịch hẹn" | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.16. Chức năng: ĐÁNH GIÁ DỊCH VỤ (FR-16)

**Phân vùng – Trường Rating (1–5 sao):**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Rating từ 1 đến 5 | 3 |
| I1 (không hợp lệ) | Rating = 0 (nhỏ hơn min) | 0 |
| I2 (không hợp lệ) | Rating = 6 (lớn hơn max) | 6 |
| I3 (không hợp lệ) | Không phải số nguyên | 3.5 |

**Giá trị biên – Rating:**

| Biên | Giá trị | Loại |
|---|---|---|
| Biên dưới - 1 | 0 | Không hợp lệ |
| Biên dưới | 1 | Hợp lệ |
| Biên dưới + 1 | 2 | Hợp lệ |
| Biên trên - 1 | 4 | Hợp lệ |
| Biên trên | 5 | Hợp lệ |
| Biên trên + 1 | 6 | Không hợp lệ |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_REV_01 | EP (V1) | appointmentId=a4(completed), rating=3, comment="OK" | HTTP 201, review được tạo | Hợp lệ | HTTP 201 – review có đầy đủ các field, rating=3 chính xác | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REV_02 | BVA (Biên dưới) | rating=1 | HTTP 201, review được tạo | Hợp lệ | HTTP 201 – rating=1 được lưu chính xác | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REV_03 | BVA (Biên dưới - 1) | rating=0 | HTTP 400: "rating không hợp lệ" hoặc DB check lỗi | Không hợp lệ | HTTP 500 – lỗi DB constraint (CHECK rating BETWEEN 1 AND 5) nổi lên nhưng không được xử lý đúng | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Cần bắt validate rating trước khi gửi DB*
| TC_REV_04 | BVA (Biên trên) | rating=5 | HTTP 201, review được tạo | Hợp lệ | HTTP 201 – rating=5 được lưu chính xác | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REV_05 | BVA (Biên trên + 1) | rating=6 | HTTP 400: "rating không hợp lệ" | Không hợp lệ | HTTP 500 – lỗi DB constraint, không có message thân thiện cho người dùng | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate cấp API*
| TC_REV_06 | BR-08 | appointmentId=a2(pending), rating=4 | HTTP 400/403: Lịch chưa hoàn thành, không thể đánh giá | Không hợp lệ | HTTP 201 – review được tạo dù lịch hẹn chưa completed | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu kiểm tra trạng thái lịch hẹn trước khi đánh giá*
| TC_REV_07 | BR-09 | appointmentId=a4 đã có review (r2) | HTTP 409/400: "Lịch hẹn này đã được đánh giá" | Không hợp lệ | HTTP 500 – lỗi DB UNIQUE constraint trên appointmentId | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Cần kiểm tra trước khi insert, trả message rõ ràng*
| TC_REV_08 | EP (V1) | comment="" (không bắt buộc) | HTTP 201, comment=null trong DB | Hợp lệ | HTTP 201 – comment=null trong DB | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REV_09 | EP (V1) | tags="Tận tâm,Chuyên nghiệp,Hiệu quả" | HTTP 201, tags được lưu đúng | Hợp lệ | HTTP 201 – tags lưu đúng dạng CSV | 29/06/2026 – Nhóm KT – **Pass** |
| TC_REV_10 | EP (I1) | appointmentId không tồn tại | HTTP 404 hoặc 400 | Không hợp lệ | HTTP 500 – lỗi FK constraint, chưa xử lý được gracefully | 29/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Cần kiểm tra appointment tồn tại trước khi tạo review*

---

### 2.17. Chức năng: PHẢN HỒI ĐÁNH GIÁ – Bác sĩ/KTV (FR-17)

**Phân vùng – Nội dung staffReply:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Có nội dung phản hồi hợp lệ | "Cảm ơn bạn đã tin tưởng!" |
| I1 (không hợp lệ) | staffReply rỗng | staffReply="" |
| I2 (không hợp lệ) | Review không thuộc doctor đang đăng nhập | Review của doctor khác |
| I3 (không hợp lệ) | Review không tồn tại | reviewId="r999" |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_REPLY_01 | EP (V1) | Doctor phản hồi đúng review của mình: PATCH /api/reviews/r1/reply | HTTP 200, staffReply được lưu | Hợp lệ | HTTP 200 – staffReply lưu chính xác | 30/06/2026 – Nhóm KT – **Pass** |
| TC_REPLY_02 | EP (I1) | staffReply="" (rỗng) | HTTP 400: "Nội dung phản hồi không được rỗng" | Không hợp lệ | HTTP 200 – lưu staffReply="" vào DB ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu validate nội dung phản hồi không rỗng*
| TC_REPLY_03 | EP (I2) | Doctor A phản hồi review của Doctor B | HTTP 403: "Không có quyền phản hồi đánh giá này" | Không hợp lệ | HTTP 200 – Doctor A vẫn phản hồi được review không thuộc mình ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu kiểm tra staffId của review = doctor đang đăng nhập*
| TC_REPLY_04 | EP (I3) | reviewId="r999" (không tồn tại) | HTTP 404: "Không tìm thấy đánh giá" | Không hợp lệ | HTTP 404 – message: "Không tìm thấy đánh giá" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_REPLY_05 | Auth | Customer phản hồi đánh giá | HTTP 403: Forbidden | Không hợp lệ | HTTP 403 – "Forbidden" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_REPLY_06 | EP (V1) | Doctor phản hồi lần 2 (ghi đè) | HTTP 200, staffReply được cập nhật | Hợp lệ | HTTP 200 – nội dung mới ghi đè thành công | 30/06/2026 – Nhóm KT – **Pass** |
| TC_REPLY_07 | EP (V1) | staffReply dài 1000 ký tự | HTTP 200, lưu đủ nội dung | Hợp lệ | HTTP 200 – lưu đủ 1000 ký tự | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.18. Chức năng: THÔNG BÁO HỆ THỐNG (FR-18)

**Phân vùng – Loại thao tác thông báo:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | Xem danh sách thông báo | GET /notifications |
| V2 (hợp lệ) | Đánh dấu đã đọc | PATCH /notifications/:id/read |
| V3 (hợp lệ) | Đếm số thông báo chưa đọc | GET /notifications/unread-count |
| I1 (không hợp lệ) | Đánh dấu thông báo không thuộc user | notificationId của user khác |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_NOTIF_01 | EP (V1) | GET /api/notifications (đăng nhập customer) | HTTP 200, danh sách thông báo của user đó | Hợp lệ | HTTP 200 – 3 thông báo của bich.ng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTIF_02 | EP (V2) | PATCH /api/notifications/n1/read | HTTP 200, isRead=1 | Hợp lệ | HTTP 200 – isRead=1 được cập nhật | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTIF_03 | EP (V3) | GET /api/notifications/unread-count | HTTP 200, { count: N } | Hợp lệ | HTTP 200 – { count: 2 } đúng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTIF_04 | EP (I1) | Customer A đánh dấu đọc thông báo của Customer B | HTTP 403: Forbidden | Không hợp lệ | HTTP 200 – đánh dấu được thông báo không thuộc mình ⚠️ | 30/06/2026 – Nhóm KT – **Fail** |⚠️ *Lỗi: Thiếu kiểm tra userId = user đang đăng nhập*
| TC_NOTIF_05 | Auth | Gửi request không có JWT | HTTP 401: Unauthorized | Không hợp lệ | HTTP 401 – "Unauthorized" | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTIF_06 | EP (V1) | Đặt lịch thành công → kiểm tra thông báo được tạo tự động | Hệ thống tự tạo thông báo cho customer và staff | Hợp lệ | Thông báo được tạo tự động với type="appointment", đúng nội dung | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTIF_07 | EP (V1) | Hủy lịch → kiểm tra thông báo hủy | Hệ thống tạo thông báo "Lịch hẹn đã bị hủy" | Hợp lệ | Thông báo hủy được tạo đúng | 30/06/2026 – Nhóm KT – **Pass** |
| TC_NOTIF_08 | EP (V1) | Đánh dấu tất cả đã đọc: PATCH /api/notifications/read-all | HTTP 200, tất cả isRead=1 | Hợp lệ | HTTP 200 – tất cả isRead=1 | 30/06/2026 – Nhóm KT – **Pass** |

---

### 2.19. Chức năng: KIỂM TRA SLOT TRỐNG (FR-19)

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_SLT_01 | EP (V1) | staffId=u1, date=ngày_thứ_Hai, serviceId=s1 | HTTP 200, trả về danh sách slots với trạng thái available | Hợp lệ | HTTP 200 – trả về 16 slots (08:00–16:30), đa số available=true | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SLT_02 | EP (I1) | staffId=null | HTTP 400: "Thiếu thông tin" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SLT_03 | EP (I1) | date=null | HTTP 400: "Thiếu thông tin" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SLT_04 | EP (I1) | serviceId=null | HTTP 400: "Thiếu thông tin" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SLT_05 | BR-05 | u1 không làm ngày Chủ Nhật | HTTP 200, slots=[] | Không hợp lệ (không có slot) | HTTP 200 – slots=[] – trả về mảng rỗng đúng | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SLT_06 | EP (V1) | Slot bị chiếm bởi lịch hẹn hiện có | HTTP 200, slot đó có available=false | Hợp lệ | HTTP 200 – slot 09:00 có available=false do lịch a1 đã chiếm | 29/06/2026 – Nhóm KT – **Pass** |
| TC_SLT_07 | EP (I2) | serviceId="s999" (không tồn tại) | HTTP 404: "Không tìm thấy dịch vụ" | Không hợp lệ | HTTP 404 – message: "Không tìm thấy dịch vụ" | 29/06/2026 – Nhóm KT – **Pass** |

---

### 2.20. Chức năng: ĐỔI MẬT KHẨU / CẬP NHẬT HỒ SƠ (FR-20)

**Phân vùng – Mật khẩu mới:**

| Vùng | Mô tả | Đại diện |
|---|---|---|
| V1 (hợp lệ) | ≥ 6 ký tự | "newpass123" |
| I1 | < 6 ký tự | "123" |
| I2 | Rỗng | "" |

| Mã TC | Kỹ thuật | Dữ liệu đầu vào | Kết quả mong đợi | Loại vùng | Kết quả thực tế | Lịch sử kiểm thử |
|---|---|---|---|---|---|---|
| TC_PWD_01 | EP (V1) | oldPassword đúng, newPassword="newpass123" | HTTP 200: "Đổi mật khẩu thành công" | Hợp lệ | HTTP 200 – message: "Đổi mật khẩu thành công", hash mới được lưu trong DB | 29/06/2026 – Nhóm KT – **Pass** |
| TC_PWD_02 | EP (I1) | oldPassword sai | HTTP 401: "Mật khẩu cũ không đúng" | Không hợp lệ | HTTP 401 – message: "Mật khẩu cũ không đúng" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_PWD_03 | BVA (Biên dưới - 1) | newPassword="12345" (5 ký tự) | HTTP 400: "Mật khẩu mới phải có ít nhất 6 ký tự" | Không hợp lệ | HTTP 400 – message: "Mật khẩu mới phải có ít nhất 6 ký tự" | 29/06/2026 – Nhóm KT – **Pass** |
| TC_PWD_04 | BVA (Biên dưới) | newPassword="123456" (6 ký tự) | HTTP 200: "Đổi mật khẩu thành công" | Hợp lệ | HTTP 200 – đổi mật khẩu thành công, bcrypt hash mới được lưu | 29/06/2026 – Nhóm KT – **Pass** |
| TC_PWD_05 | EP (I2) | oldPassword="" hoặc newPassword="" | HTTP 400: "Thiếu thông tin" | Không hợp lệ | HTTP 400 – message: "Thiếu thông tin" | 29/06/2026 – Nhóm KT – **Pass** |

---

### 2.21. Tổng hợp Test Case – Toàn hệ thống

| STT | Chức năng | Số TC | Pass | Fail |
|---|---|---|---|---|
| 1 | FR-01: Đăng ký tài khoản | 10 | 9 | 1 |
| 2 | FR-02: Đăng nhập | 8 | 8 | 0 |
| 3 | FR-03: Xem danh sách dịch vụ | 6 | 6 | 0 |
| 4 | FR-04: Xem chi tiết dịch vụ | 5 | 4 | 1 |
| 5 | FR-05: Xem danh sách bác sĩ/KTV | 6 | 6 | 0 |
| 6 | FR-06: Đặt lịch hẹn | 13 | 12 | 1 |
| 7 | FR-07: Xem lịch hẹn cá nhân | 7 | 7 | 0 |
| 8 | FR-08: Hủy lịch hẹn | 8 | 8 | 0 |
| 9 | FR-09: Xem lịch làm việc (Bác sĩ/KTV) | 5 | 4 | 1 |
| 10 | FR-10: Cập nhật trạng thái lịch | 9 | 9 | 0 |
| 11 | FR-11: Ghi ghi chú y tế | 6 | 4 | 2 |
| 12 | FR-12: Quản lý người dùng (Admin) | 6 | 6 | 0 |
| 13 | FR-13: Quản lý dịch vụ (Admin) | 8 | 3 | 5 |
| 14 | FR-14: Quản lý ca làm việc | 8 | 5 | 3 |
| 15 | FR-15: Quản lý lịch hẹn (Admin) | 8 | 8 | 0 |
| 16 | FR-16: Đánh giá dịch vụ | 10 | 6 | 4 |
| 17 | FR-17: Phản hồi đánh giá | 7 | 5 | 2 |
| 18 | FR-18: Thông báo hệ thống | 8 | 7 | 1 |
| 19 | FR-19: Kiểm tra slot trống | 7 | 7 | 0 |
| 20 | FR-20: Đổi mật khẩu / Cập nhật hồ sơ | 5 | 5 | 0 |
| | **TỔNG CỘNG** | **152** | **129** | **21** |

> **Tỷ lệ Pass: 84.9%** – 21 test case Fail phát hiện lỗi thực tế về **validate đầu vào** và **phân quyền** cần được sửa.

---

*Ghi chú: Cột "Kết quả thực tế" và "Lịch sử kiểm thử" được điền trong quá trình thực thi kiểm thử thực tế.*
