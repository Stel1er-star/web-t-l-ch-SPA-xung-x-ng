# Hệ Thống Đặt Lịch & Quản Lý Spa/Phòng Khám (SpaProMax)

Dự án này là một hệ thống quản lý Spa & Phòng khám đầy đủ chức năng bao gồm 3 phân hệ: **Khách Hàng**, **Bác Sĩ/KTV**, và **Quản Trị Viên (Admin)**.

## Yêu Cầu Hệ Thống
1. **Node.js**: Phiên bản 14 trở lên.
2. **XAMPP / WAMP / MySQL**: Để chạy cơ sở dữ liệu MySQL.

---

## Hướng Dẫn Cài Đặt Dành Cho Bạn Bè / Giảng Viên

### Bước 1: Thiết lập Cơ Sở Dữ Liệu (Database)
1. Mở **XAMPP** và khởi động dịch vụ **MySQL** và **Apache**.
2. Truy cập vào **phpMyAdmin** qua trình duyệt: `http://localhost/phpmyadmin`
3. Nhấn vào tab **Import** (Nhập).
4. Chọn file `backend/database/schema.sql` (nằm trong thư mục dự án bạn vừa tải về).
5. Bấm **Go** (Thực hiện).
   *(File này sẽ tự động tạo database `spapromax_db` và chèn sẵn toàn bộ dữ liệu mẫu, bao gồm cả tài khoản admin, bác sĩ và khách hàng).*

### Bước 2: Thiết lập Backend
1. Mở Terminal / Command Prompt và di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường:
   - Copy file `.env.example` và đổi tên thành `.env`.
   - Nếu bạn dùng XAMPP mặc định (user là `root`, password để trống), thì không cần sửa gì trong file `.env` này.

### Bước 3: Chạy Ứng Dụng
1. Vẫn ở trong thư mục `backend`, chạy lệnh:
   ```bash
   node server.js
   ```
2. Nếu Terminal hiện `🚀 SpaProMax API running on http://localhost:3002` và `✅ MySQL Connected to spapromax_db` là bạn đã thành công!

---

## Trải Nghiệm Ứng Dụng

Mở trình duyệt và truy cập: **`http://localhost:3002`**

*(Giao diện Frontend được phục vụ trực tiếp qua server backend ở port 3002)*

### Tài Khoản Dùng Thử (Đã có sẵn trong database)

**1. Quản Trị Viên (Admin)**
- **Username**: `admin`
- **Password**: `password`
- **Tính năng**: Quản lý ca làm việc, dịch vụ, doanh thu.

**2. Bác Sĩ / Kỹ Thuật Viên (Doctor/Staff)**
- **Username**: `dr.minh` (hoặc `ktv.lan`)
- **Password**: `doctor123`
- **Tính năng**: Xem lịch làm việc, nhận/hủy lịch hẹn, viết ghi chú y tế (khám xong).

**3. Khách Hàng (Customer)**
- **Username**: `bich.ng`
- **Password**: `cust123`
- **Tính năng**: Đặt lịch mới (theo dịch vụ, bác sĩ, khung giờ), xem lịch sử khám, đánh giá dịch vụ.

---

## Cấu Trúc Thư Mục
- `backend/`: Chứa Node.js API (Express), Models, Controllers, Middleware và file Database Schema.
- `frontend/`: Chứa giao diện web (HTML/CSS/JS thuần).
  - `/admin`: Các trang của Quản trị viên.
  - `/doctor`: Các trang của Bác sĩ.
  - `/customer`: Các trang đặt lịch của Khách hàng.
  - `/js` và `/css`: Xử lý API, Auth, và UI Design System.
