-- =============================================
-- SpaProMax Database Schema & Seed Data
-- Database: spapromax_db
-- MySQL / XAMPP | utf8mb4
-- Chạy file này qua phpMyAdmin hoặc MySQL CLI
-- =============================================

CREATE DATABASE IF NOT EXISTS spapromax_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spapromax_db;

-- =============================================
-- DROP TABLES (reset nếu cần chạy lại)
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Shifts;
DROP TABLE IF EXISTS ServiceStaff;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- BẢNG Users
-- =============================================
CREATE TABLE Users (
    id          VARCHAR(50)   NOT NULL,
    username    VARCHAR(100)  NOT NULL,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('admin','doctor','customer') NOT NULL DEFAULT 'customer',
    name        VARCHAR(200)  NOT NULL,
    email       VARCHAR(200)  DEFAULT NULL,
    phone       VARCHAR(20)   DEFAULT NULL,
    specialty   VARCHAR(200)  DEFAULT NULL,
    bio         TEXT          DEFAULT NULL,
    image_url   VARCHAR(500)  DEFAULT NULL,
    is_active   TINYINT(1)    NOT NULL DEFAULT 1,
    createdAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_username (username),
    UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG Services
-- =============================================
CREATE TABLE Services (
    id          VARCHAR(50)   NOT NULL,
    name        VARCHAR(200)  NOT NULL,
    category    ENUM('medical','spa') NOT NULL DEFAULT 'spa',
    duration    INT           NOT NULL COMMENT 'minutes',
    price       BIGINT        NOT NULL,
    description TEXT          DEFAULT NULL,
    image_url   VARCHAR(500)  DEFAULT NULL,
    icon        VARCHAR(50)   DEFAULT NULL,
    is_active   TINYINT(1)    NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG ServiceStaff (nhiều-nhiều: Service ↔ Doctor/Staff)
-- =============================================
CREATE TABLE ServiceStaff (
    serviceId   VARCHAR(50)   NOT NULL,
    staffId     VARCHAR(50)   NOT NULL,
    PRIMARY KEY (serviceId, staffId),
    FOREIGN KEY (serviceId) REFERENCES Services(id) ON DELETE CASCADE,
    FOREIGN KEY (staffId)   REFERENCES Users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG Shifts (Ca làm việc)
-- =============================================
CREATE TABLE Shifts (
    id          VARCHAR(50)   NOT NULL,
    staffId     VARCHAR(50)   NOT NULL,
    day         ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
    startTime   VARCHAR(10)   NOT NULL,
    endTime     VARCHAR(10)   NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (staffId) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG Appointments (Lịch hẹn)
-- =============================================
CREATE TABLE Appointments (
    id              VARCHAR(50)  NOT NULL,
    customerId      VARCHAR(50)  NOT NULL,
    staffId         VARCHAR(50)  NOT NULL,
    serviceId       VARCHAR(50)  NOT NULL,
    date            DATE         NOT NULL,
    time            VARCHAR(10)  NOT NULL,
    status          ENUM('pending','confirmed','in-progress','completed','cancelled') NOT NULL DEFAULT 'pending',
    note            TEXT         DEFAULT NULL,
    medicalNote     TEXT         DEFAULT NULL,
    cancel_reason   TEXT         DEFAULT NULL,
    depositPaid     TINYINT(1)   NOT NULL DEFAULT 0,
    depositRefunded TINYINT(1)   NOT NULL DEFAULT 0,
    price           BIGINT       NOT NULL,
    createdAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (customerId) REFERENCES Users(id),
    FOREIGN KEY (staffId)    REFERENCES Users(id),
    FOREIGN KEY (serviceId)  REFERENCES Services(id),
    INDEX idx_date_staff (date, staffId),
    INDEX idx_customer (customerId),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG Reviews (Đánh giá)
-- =============================================
CREATE TABLE Reviews (
    id            VARCHAR(50)   NOT NULL,
    appointmentId VARCHAR(50)   NOT NULL UNIQUE,
    customerId    VARCHAR(50)   NOT NULL,
    staffId       VARCHAR(50)   NOT NULL,
    serviceId     VARCHAR(50)   NOT NULL,
    rating        INT           NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment       TEXT          DEFAULT NULL,
    tags          VARCHAR(500)  DEFAULT NULL,
    staffReply    TEXT          DEFAULT NULL,
    likes         INT           NOT NULL DEFAULT 0,
    createdAt     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (appointmentId) REFERENCES Appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (customerId)    REFERENCES Users(id),
    FOREIGN KEY (staffId)       REFERENCES Users(id),
    FOREIGN KEY (serviceId)     REFERENCES Services(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BẢNG Notifications
-- =============================================
CREATE TABLE Notifications (
    id          VARCHAR(50)   NOT NULL,
    userId      VARCHAR(50)   NOT NULL,
    title       VARCHAR(200)  NOT NULL,
    message     TEXT          NOT NULL,
    type        ENUM('appointment','system','reminder','review') NOT NULL DEFAULT 'system',
    isRead      TINYINT(1)    NOT NULL DEFAULT 0,
    link        VARCHAR(300)  DEFAULT NULL,
    createdAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_user_read (userId, isRead)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SEED DATA — Users
-- Passwords: admin123 / doctor123 / cust123 (stored as plain for dev, bcrypt in prod)
-- =============================================
INSERT INTO Users (id, username, password, role, name, email, phone, specialty, bio, image_url, createdAt) VALUES
-- Admin
('u0', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',
 'Nguyễn Văn Admin', 'admin@spapromax.vn', '0900000001', NULL,
 'Quản lý hệ thống SpaProMax.',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
 '2024-01-01 08:00:00'),

-- Doctors / Staff
('u1', 'dr.minh', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor',
 'BS. Trần Minh An', 'dr.minh@spapromax.vn', '0900000002', 'Khám tổng quát & Nội khoa',
 'Bác sĩ với 10 năm kinh nghiệm trong lĩnh vực khám tổng quát và tư vấn sức khỏe toàn diện.',
 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
 '2024-01-05 08:00:00'),

('u2', 'ktv.lan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor',
 'KTV. Lê Thị Lan', 'ktv.lan@spapromax.vn', '0900000003', 'Chăm sóc da & Spa trị liệu',
 'Kỹ thuật viên spa cao cấp với chứng chỉ quốc tế, chuyên gia điều trị da và liệu pháp thư giãn.',
 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
 '2024-01-05 08:00:00'),

('u3', 'dr.hung', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor',
 'BS. Phạm Quốc Hùng', 'dr.hung@spapromax.vn', '0900000004', 'Dinh dưỡng & Sức khỏe thể chất',
 'Chuyên gia dinh dưỡng lâm sàng, tư vấn kế hoạch ăn uống cá nhân hóa và giảm cân khoa học.',
 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face',
 '2024-01-10 08:00:00'),

('u4', 'ktv.mai', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor',
 'KTV. Nguyễn Thị Mai', 'ktv.mai@spapromax.vn', '0900000005', 'Vật lý trị liệu & Massage',
 'Kỹ thuật viên vật lý trị liệu với 7 năm kinh nghiệm, chuyên điều trị đau cơ và phục hồi chức năng.',
 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=200&h=200&fit=crop&crop=face',
 '2024-01-15 08:00:00'),

('u5', 'dr.trang', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor',
 'BS. Vũ Thị Trang', 'dr.trang@spapromax.vn', '0900000006', 'Da liễu',
 'Bác sĩ da liễu chuyên điều trị mụn trứng cá, nám da, lão hóa và các bệnh lý về da.',
 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
 '2024-02-01 08:00:00'),

-- Customers
('c1', 'bich.ng', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',
 'Nguyễn Thị Bích', 'bich@gmail.com', '0911000001', NULL, NULL,
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
 '2024-02-01 10:00:00'),

('c2', 'dung.le', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',
 'Lê Văn Dũng', 'dung@gmail.com', '0911000002', NULL, NULL,
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
 '2024-02-10 10:00:00'),

('c3', 'huong.pham', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',
 'Phạm Thị Hương', 'huong@gmail.com', '0911000003', NULL, NULL,
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
 '2024-03-01 10:00:00');

-- =============================================
-- SEED DATA — Services
-- =============================================
INSERT INTO Services (id, name, category, duration, price, description, image_url, icon) VALUES
('s1', 'Khám Tổng Quát', 'medical', 30, 350000,
 'Kiểm tra sức khỏe toàn diện bao gồm đo huyết áp, đường huyết, tim mạch, khám lâm sàng cơ bản và tư vấn sức khỏe.',
 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', '🩺'),

('s2', 'Massage Thư Giãn Toàn Thân', 'spa', 60, 550000,
 'Massage toàn thân bằng tinh dầu thảo dược thiên nhiên, giúp giảm căng thẳng, thư giãn cơ bắp và cải thiện tuần hoàn máu.',
 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop', '💆'),

('s3', 'Chăm Sóc Da Mặt Chuyên Sâu', 'spa', 90, 750000,
 'Làm sạch sâu, tẩy tế bào chết, đắp mặt nạ collagen tươi, massage nâng cơ mặt và dưỡng ẩm chuyên sâu.',
 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop', '✨'),

('s4', 'Tư Vấn Dinh Dưỡng Cá Nhân', 'medical', 45, 250000,
 'Phân tích chỉ số cơ thể (BMI, tỷ lệ mỡ), lập kế hoạch dinh dưỡng cá nhân hóa theo mục tiêu sức khỏe của bạn.',
 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop', '🥗'),

('s5', 'Trị Liệu Vai Cổ Gáy', 'spa', 45, 450000,
 'Vật lý trị liệu chuyên sâu vùng cổ, vai, gáy kết hợp nhiệt trị liệu và kỹ thuật massage điểm trigger giảm đau hiệu quả.',
 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop', '🔥'),

('s6', 'Khám & Điều Trị Da Liễu', 'medical', 30, 300000,
 'Thăm khám và điều trị các vấn đề về da: mụn trứng cá, nám, tàn nhang, viêm da cơ địa và tư vấn chăm sóc da phù hợp.',
 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=400&fit=crop', '🔬'),

('s7', 'Liệu Pháp Đá Nóng', 'spa', 75, 650000,
 'Liệu pháp thư giãn cao cấp sử dụng đá bazan nóng kết hợp với tinh dầu thiên nhiên, thư giãn cơ sâu và cân bằng năng lượng.',
 'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=600&h=400&fit=crop', '💎'),

('s8', 'Tắm Bùn Khoáng & Thalasso', 'spa', 60, 800000,
 'Liệu pháp tắm bùn khoáng biển kết hợp rong biển, loại bỏ độc tố, nuôi dưỡng và tái tạo làn da từ sâu bên trong.',
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop', '🌊');

-- =============================================
-- SEED DATA — ServiceStaff
-- =============================================
INSERT INTO ServiceStaff (serviceId, staffId) VALUES
('s1','u1'),('s1','u5'),
('s2','u2'),('s2','u4'),
('s3','u2'),('s3','u5'),
('s4','u3'),
('s5','u4'),('s5','u2'),
('s6','u5'),('s6','u1'),
('s7','u2'),('s7','u4'),
('s8','u2');

-- =============================================
-- SEED DATA — Shifts
-- =============================================
INSERT INTO Shifts (id, staffId, day, startTime, endTime) VALUES
('sh1','u1','Mon','08:00','17:00'),
('sh2','u1','Wed','08:00','17:00'),
('sh3','u1','Fri','08:00','17:00'),
('sh4','u2','Tue','09:00','18:00'),
('sh5','u2','Thu','09:00','18:00'),
('sh6','u2','Sat','08:00','16:00'),
('sh7','u3','Mon','13:00','18:00'),
('sh8','u3','Thu','08:00','13:00'),
('sh9','u3','Fri','13:00','18:00'),
('sh10','u4','Mon','08:00','12:00'),
('sh11','u4','Wed','08:00','17:00'),
('sh12','u4','Fri','08:00','12:00'),
('sh13','u5','Tue','08:00','17:00'),
('sh14','u5','Thu','13:00','18:00'),
('sh15','u5','Sat','09:00','14:00');

-- =============================================
-- SEED DATA — Appointments
-- =============================================
INSERT INTO Appointments (id, customerId, staffId, serviceId, date, time, status, note, medicalNote, depositPaid, price, createdAt) VALUES
('a1','c1','u1','s1', CURDATE(), '09:00', 'confirmed', 'Tôi muốn khám sức khỏe định kỳ', '', 1, 350000, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('a2','c1','u2','s2', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00', 'pending', 'Bị đau lưng vùng thắt lưng', '', 0, 550000, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('a3','c2','u2','s3', CURDATE(), '10:30', 'in-progress', '', 'Da hỗn hợp, dầu vùng chữ T. Đang thực hiện bước 2/4.', 1, 750000, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('a4','c2','u3','s4', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '15:00', 'completed', '', 'BMI = 27.4 (thừa cân). Đã lập kế hoạch giảm cân 3 tháng.', 1, 250000, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('a5','c1','u5','s6', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '11:00', 'completed', 'Da nổi mụn nhiều', 'Chẩn đoán: Mụn trứng cá độ II. Kê đơn Clindamycin + Benzoyl Peroxide. Tái khám sau 2 tuần.', 1, 300000, DATE_SUB(NOW(), INTERVAL 7 DAY)),
('a6','c2','u1','s1', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:30', 'pending', '', '', 0, 350000, NOW()),
('a7','c3','u4','s5', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '09:00', 'completed', 'Đau vai phải nhiều', 'Căng cơ vai phải độ II. Đã trị liệu 45 phút, hẹn tái khám sau 1 tuần.', 1, 450000, DATE_SUB(NOW(), INTERVAL 8 DAY)),
('a8','c3','u2','s7', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:00', 'confirmed', '', '', 1, 650000, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- =============================================
-- SEED DATA — Reviews
-- =============================================
INSERT INTO Reviews (id, appointmentId, customerId, staffId, serviceId, rating, comment, tags, staffReply, likes, createdAt) VALUES
('r1','a5','c1','u5','s6', 5,
 'Bác sĩ rất tận tâm, giải thích rõ ràng về tình trạng da. Sau 2 tuần dùng thuốc đã cải thiện rõ rệt!',
 'Tận tâm,Chuyên nghiệp,Hiệu quả',
 'Cảm ơn bạn đã tin tưởng SpaProMax! Hãy nhớ tái khám đúng hẹn và bảo vệ da khỏi nắng nhé 😊',
 12, DATE_SUB(NOW(), INTERVAL 5 DAY)),

('r2','a4','c2','u3','s4', 4,
 'Tư vấn rất chi tiết và có kế hoạch cụ thể. Chỉ hơi tiếc là phòng chờ hơi nhỏ.',
 'Chi tiết,Hữu ích,Chuyên nghiệp',
 '', 5, DATE_SUB(NOW(), INTERVAL 4 DAY)),

('r3','a7','c3','u4','s5', 5,
 'Kỹ thuật viên rất giỏi, sau buổi trị liệu cảm giác vai nhẹ nhàng hơn hẳn. Sẽ tiếp tục đặt lịch!',
 'Giỏi nghề,Nhẹ nhàng,Hiệu quả',
 'Rất vui được phục vụ bạn! Nhớ tập bài tập kéo giãn mỗi sáng nhé 💪',
 8, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =============================================
-- SEED DATA — Notifications
-- =============================================
INSERT INTO Notifications (id, userId, title, message, type, isRead, link) VALUES
('n1','c1','Lịch hẹn được xác nhận','Lịch khám với BS. Trần Minh An vào 09:00 hôm nay đã được xác nhận.','appointment',0,'/customer/my-appointments.html'),
('n2','c1','Nhắc nhở lịch hẹn','Bạn có lịch Massage Thư Giãn vào ngày mai lúc 14:00. Đừng quên nhé!','reminder',0,'/customer/my-appointments.html'),
('n3','u1','Lịch hẹn mới','Khách hàng Nguyễn Thị Bích đã đặt lịch Khám Tổng Quát lúc 09:00 hôm nay.','appointment',0,'/doctor/appointments.html'),
('n4','c2','Lịch hẹn mới','Lịch Tắm Bùn Khoáng của bạn với KTV Lê Thị Lan đã được xác nhận.','appointment',1,'/customer/my-appointments.html');

-- =============================================
-- Kiểm tra kết quả
-- =============================================
SELECT 'Users' AS `Table`, COUNT(*) AS `Count` FROM Users
UNION ALL SELECT 'Services',     COUNT(*) FROM Services
UNION ALL SELECT 'Appointments', COUNT(*) FROM Appointments
UNION ALL SELECT 'Shifts',       COUNT(*) FROM Shifts
UNION ALL SELECT 'Reviews',      COUNT(*) FROM Reviews
UNION ALL SELECT 'Notifications',COUNT(*) FROM Notifications;
