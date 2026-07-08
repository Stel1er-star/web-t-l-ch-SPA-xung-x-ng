# BÁO CÁO KẾT QUẢ THỰC HIỆN BÀI TẬP LỚN MÔN HỌC
**MÔN HỌC:** QUY TRÌNH VÀ CÔNG CỤ PHÁT TRIỂN PHẦN MỀM
**TÊN DỰ ÁN:** HỆ THỐNG ĐẶT LỊCH VÀ QUẢN LÝ SPA/PHÒNG KHÁM (SpaProMax)

---

## LỜI MỞ ĐẦU

### 1. Lý do chọn đề tài
Trong thời đại công nghệ số hóa hiện nay, các hoạt động dịch vụ chăm sóc sức khỏe và sắc đẹp tại các Spa, Phòng khám đang đối mặt với nhiều thách thức trong khâu quản lý và vận hành. Qua khảo sát thực trạng, việc quản lý lịch hẹn tại nhiều cơ sở vẫn đang được thực hiện chủ yếu bằng phương pháp thủ công như ghi chép sổ sách hoặc trao đổi qua điện thoại, tin nhắn. Điều này dẫn đến hàng loạt các vấn đề bất cập:
- **Khó khăn trong việc theo dõi:** Quản lý không nắm bắt được chi tiết lịch trình công việc của từng Bác sĩ hoặc Kỹ thuật viên (KTV) trong cùng một thời điểm.
- **Rủi ro trùng lịch, sai sót:** Do thao tác thủ công, các khung giờ dễ bị chồng chéo, gây mất uy tín đối với khách hàng và làm giảm chất lượng phục vụ.
- **Thiếu tính chủ động cho khách hàng:** Khách hàng không thể tự do lựa chọn dịch vụ, bác sĩ hay khung giờ phù hợp một cách trực quan, mà phải phụ thuộc hoàn toàn vào tư vấn viên.
- **Khó khăn trong quản lý doanh thu và hiệu suất:** Việc tổng hợp dữ liệu, thống kê doanh thu và đánh giá hiệu quả làm việc của nhân viên mất rất nhiều thời gian và dễ xảy ra sai sót.

Từ những hạn chế trên, nhu cầu cấp thiết là cần có một hệ thống phần mềm chuyên dụng nhằm tự động hóa quy trình đặt lịch, tối ưu hóa công tác quản trị và nâng cao trải nghiệm khách hàng. Đó chính là lý do dự án **SpaProMax** ra đời.

### 2. Mục tiêu của dự án
Dự án hướng đến việc xây dựng một hệ thống phần mềm quản lý Spa/Phòng khám toàn diện dưới dạng ứng dụng Web SPA (Single Page Application). Mục tiêu cụ thể bao gồm:
- Cung cấp nền tảng tự phục vụ cho **Khách hàng**, cho phép họ chủ động tìm kiếm dịch vụ, lựa chọn bác sĩ, đặt lịch hẹn và quản lý lịch trình cá nhân mọi lúc, mọi nơi.
- Hỗ trợ **Bác sĩ/KTV** theo dõi lịch làm việc chính xác, cập nhật trạng thái lịch hẹn realtime và quản lý các yêu cầu thay đổi ca làm việc linh hoạt.
- Cung cấp cho **Quản trị viên (Admin)** một bộ công cụ mạnh mẽ để giám sát toàn bộ hoạt động của cơ sở, quản lý nhân sự, dịch vụ, ca làm việc, đồng thời hệ thống hóa dữ liệu dưới dạng các báo cáo thống kê trực quan nhằm hỗ trợ ra quyết định kinh doanh.

### 3. Phương pháp tiếp cận
Để hiện thực hóa các mục tiêu trên, nhóm phát triển đã quyết định áp dụng **Mô hình Lặp và Tăng trưởng (Iterative and Incremental Model)**. Phương pháp này cho phép chia nhỏ dự án thành các phân đoạn (iterations) có thể quản lý được. Mỗi phân đoạn đi qua đầy đủ các bước của vòng đời phát triển phần mềm (Khảo sát, Phân tích, Thiết kế, Cài đặt, Kiểm thử). Qua mỗi lần lặp, hệ thống được gia tăng thêm các tính năng mới, bắt đầu từ những giá trị cốt lõi nhất, giúp đảm bảo rủi ro thấp, thích ứng nhanh với thay đổi và mang lại sản phẩm có thể sử dụng sớm.

---

## CHƯƠNG 1: TỔNG QUAN DỰ ÁN VÀ CÁC CÔNG CỤ SỬ DỤNG

### 1.1. Giới thiệu hệ thống SpaProMax
**SpaProMax** là một nền tảng tập trung kết nối khách hàng và nhà cung cấp dịch vụ chăm sóc sắc đẹp/sức khỏe. Hệ thống được phân quyền chặt chẽ cho 3 nhóm đối tượng người dùng chính (Actors), mỗi nhóm có một không gian làm việc (Dashboard) và chức năng riêng biệt:

- **Khách hàng (Customer):** Đối tượng sử dụng dịch vụ. Các chức năng chính bao gồm tạo và quản lý tài khoản cá nhân, xem danh sách dịch vụ (lọc theo danh mục Y tế/Spa), tìm kiếm bác sĩ theo chuyên môn, thực hiện luồng đặt lịch hẹn 4 bước trực quan, theo dõi lịch sử dịch vụ, tiến hành đánh giá (review) sau khi hoàn thành và hủy lịch khi cần thiết.
- **Bác sĩ / Kỹ thuật viên (Doctor/Staff):** Đối tượng cung cấp dịch vụ. Chức năng chính là xem lịch làm việc cá nhân, nhận thông báo có lịch hẹn mới, thay đổi trạng thái lịch hẹn (Xác nhận, Đang thực hiện, Hoàn thành), ghi chú y tế cho khách hàng, và đặc biệt là gửi các yêu cầu đổi ca làm việc khi có việc bận đột xuất.
- **Quản trị viên (Admin):** Người vận hành và quản lý. Admin có toàn quyền khởi tạo dịch vụ, đăng ký tài khoản cho bác sĩ, phân công ca làm việc, phê duyệt các yêu cầu đổi ca của nhân viên, và xem xét các bảng phân tích dữ liệu, biểu đồ doanh thu theo thời gian thực.

### 1.2. Công cụ Quản lý dự án và Theo dõi tiến độ
Để đảm bảo dự án đi đúng hướng, đúng tiến độ và phân công công việc rõ ràng trong nhóm, các công cụ sau đã được ứng dụng:
- **Trello (hoặc Jira):** Được sử dụng để thiết lập bảng Kanban. Các tính năng, yêu cầu chức năng (FR - Functional Requirements) được chuyển hóa thành các thẻ (cards). Công việc được tổ chức theo các cột (Backlog, To Do, In Progress, Review, Done) tương ứng với từng giai đoạn lặp. Điều này giúp toàn đội nắm bắt chính xác tiến độ của Phân đoạn 1 và Phân đoạn 2.
- **GitHub:** Đóng vai trò là hệ thống quản lý phiên bản mã nguồn (Version Control System). Các nhánh (branches) được tạo cho từng tính năng mới. Tính năng Pull Request được sử dụng để review code trước khi gộp (merge) vào nhánh chính, đảm bảo mã nguồn luôn ổn định ở cuối mỗi lần lặp.

### 1.3. Công cụ Thiết kế và Mô hình hóa
Quá trình chuyển đổi từ yêu cầu sang bản thiết kế phần mềm yêu cầu sự rõ ràng và trực quan:
- **Figma:** Được sử dụng để thiết kế toàn bộ giao diện người dùng (UI/UX) và luồng tương tác. Prototype trên Figma giúp nhóm thống nhất về mặt hiển thị và thao tác luồng Đặt lịch 4 bước trước khi tiến hành code, giảm thiểu rủi ro phải làm lại giao diện.
- **PlantUML / Draw.io:** Đóng vai trò then chốt trong việc phân tích thiết kế hệ thống. Nhóm đã sử dụng để vẽ:
  - **UML Use Case Diagram:** Xác định rõ chức năng nào thuộc về người dùng nào.
  - **UML Class Diagram:** Xác định các thực thể và mối quan hệ giữa chúng (Users, Services, Appointments, v.v.).
  - **ERD (Entity Relationship Diagram):** Mô hình hóa cấu trúc bảng trong CSDL MySQL, quy định rõ các khóa chính (PK), khóa ngoại (FK) và ràng buộc dữ liệu.

### 1.4. Công cụ Lập trình và Kiểm thử
Hệ thống SpaProMax được xây dựng dựa trên kiến trúc client-server hiện đại:
- **Môi trường phát triển:** Visual Studio Code là trình soạn thảo mã nguồn chính, kết hợp cùng XAMPP để khởi tạo máy chủ Apache và hệ quản trị CSDL MySQL (MariaDB) tại môi trường local.
- **Công nghệ nền tảng:** 
  - **Backend:** Node.js kết hợp framework Express.js để xây dựng RESTful API. Hệ thống bảo mật bằng chuẩn JWT (JSON Web Token) cho xác thực và thư viện `bcryptjs` để mã hóa mật khẩu.
  - **Frontend:** Xây dựng ứng dụng thuần bằng HTML5, CSS3 và Vanilla JS. Ứng dụng hoạt động theo cơ chế SPA, dùng DOM Manipulation thay vì reload trang, kết hợp API Fetch để trao đổi dữ liệu.
- **Công cụ kiểm thử:**
  - **Postman:** Sử dụng rộng rãi cho quá trình kiểm thử hộp đen ở mức API, mô phỏng các request tạo lịch hẹn, gửi payload JSON phức tạp và kiểm tra mã lỗi HTTP phản hồi (200, 400, 401, 409).
  - **Chrome DevTools:** Sử dụng để debug logic frontend, theo dõi network và kiểm tra console log.

---

## CHƯƠNG 2: LỰA CHỌN QUY TRÌNH PHÁT TRIỂN PHẦN MỀM

### 2.1. Phân tích các mô hình phát triển phần mềm

Trong quá trình khởi tạo dự án, nhóm đã tiến hành phân tích sự phù hợp của các mô hình phát triển phần mềm phổ biến đối với đặc thù của SpaProMax.

**Tại sao Mô hình Thác nước (Waterfall) không phù hợp?**
Mô hình Thác nước yêu cầu hoàn thành trọn vẹn từng pha (Khảo sát -> Thiết kế -> Lập trình -> Kiểm thử) trước khi chuyển sang pha tiếp theo. Nếu áp dụng cho dự án này:
- Nhóm sẽ phải đặc tả và thiết kế cơ sở dữ liệu cho cả các tính năng cơ bản (đặt lịch, quản lý tài khoản) lẫn các tính năng phức tạp (quy trình đổi ca 3 bước, hệ thống nhắc nhở tự động, thống kê biểu đồ động) ngay từ đầu.
- Giao diện và mã nguồn frontend sẽ rất đồ sộ, quá trình lập trình kéo dài.
- Khách hàng (người dùng cuối/chủ spa) sẽ không được nhìn thấy hay sử dụng phần mềm cho đến tận cuối học kỳ. Bất kỳ phản hồi nào về sự bất tiện của quy trình đặt lịch lúc này sẽ đòi hỏi chi phí đập đi xây lại cực lớn, làm trễ tiến độ.

**Sự ưu việt của Mô hình Lặp và Tăng trưởng (Iterative and Incremental Model):**
Mô hình Lặp Tăng Trưởng phân chia dự án thành các phần nhỏ gọn hơn. Sự lựa chọn này mang lại những ưu điểm cốt lõi:
- **Tạo ra giá trị sớm (Incremental):** Dự án có thể sớm cho ra mắt một phiên bản lõi (Core) xử lý nghiệp vụ chính là đăng ký thành viên và đặt lịch hẹn. Hệ thống có thể hoạt động ở mức cơ bản ngay sau lần lặp đầu tiên.
- **Linh hoạt và giảm rủi ro (Iterative):** Bằng cách dời các tính năng khó (hệ thống hoàn tiền cọc, luồng đổi ca) sang các lần lặp sau, nhóm tập trung xử lý dứt điểm các thành phần nền tảng. Khi nền tảng đã vững, việc tích hợp thêm module dễ dàng hơn và rủi ro sụp đổ hệ thống được giảm thiểu.
- **Đánh giá và cải tiến liên tục:** Mỗi khi kết thúc một phân đoạn, hệ thống được mang ra kiểm thử tổng thể, cho phép tinh chỉnh luồng người dùng (ví dụ: tối ưu lại giao diện chọn khung giờ) trước khi xây dựng thêm tính năng khác.

### 2.2. Áp dụng Mô hình Lặp tăng trưởng vào SpaProMax

Dựa trên nguyên lý của mô hình, dự án SpaProMax được thiết kế thành 2 phân đoạn (iterations) thực thi chính:

#### 2.2.1. Phân đoạn 1 (Core - Các tính năng cốt lõi bắt buộc)
Mục tiêu của Phân đoạn 1 là tạo ra "xương sống" cho hệ thống, đảm bảo quy trình cung cấp dịch vụ cơ bản được vận hành xuyên suốt:
1. **Xác thực và Phân quyền:** Quản lý tài khoản, mã hóa mật khẩu, đăng nhập sinh Token cho Customer và Admin.
2. **Quản lý danh mục:** Admin có khả năng khởi tạo dữ liệu về Bác sĩ, Dịch vụ và thiết lập ca làm việc cơ bản.
3. **Luồng Đặt lịch hẹn chính (Booking Engine):** Xây dựng luồng xử lý từ việc chọn dịch vụ -> lọc bác sĩ -> chọn slot thời gian hợp lệ -> kiểm tra xung đột (Conflict resolution) -> tạo lịch hẹn thành công vào DB.
*=> Báo cáo kết quả Phân đoạn 1: Cơ sở vật chất cơ bản của Spa/Phòng khám đã được số hóa. Khách hàng có thể tương tác với hệ thống để đặt lịch thay vì gọi điện thoại.*

#### 2.2.2. Phân đoạn 2 (Add-ons - Các tính năng nâng cao)
Sau khi "xương sống" đã chạy ổn định và vượt qua các bài kiểm thử cơ bản, Phân đoạn 2 được kích hoạt để mở rộng chức năng, đáp ứng các tình huống nghiệp vụ phức tạp:
1. **Hệ thống Đổi ca (Shift Swapping):** Bổ sung quy trình nghiệp vụ phức tạp 3 bước cho Bác sĩ và Admin, kèm theo logic tự động chuyển đổi hàng loạt lịch hẹn sang bác sĩ tiếp quản.
2. **Tương tác hai chiều:** Xây dựng tính năng Đánh giá dịch vụ (Reviews & Ratings) giúp thu thập phản hồi của khách hàng.
3. **Hệ thống Thông báo:** Gắn các trigger tự động gửi notification khi lịch được tạo, trạng thái đổi, hoặc đổi ca được duyệt.
4. **Hệ thống Báo cáo (Reporting):** Xử lý số liệu, tính toán doanh thu và xuất dashboard thống kê.

---

## CHƯƠNG 3: THỰC THI PHÂN ĐOẠN 1 (TÍNH NĂNG CỐT LÕI)
*(Quá trình áp dụng quy trình phát triển cho vòng lặp đầu tiên)*

### 3.1. Khảo sát và Đặc tả yêu cầu (Requirements)
Nhóm thực hiện khảo sát các quy trình nghiệp vụ chuẩn của một mô hình Spa/Phòng khám. Từ đó lập ra tài liệu đặc tả chức năng (FR) cốt lõi:
- **FR_01 & FR_02 (Xác thực):** Hệ thống bắt buộc mã hóa mật khẩu, kiểm tra trùng lặp email/username.
- **FR_04 (Đặt lịch hẹn - Cốt lõi):** Yêu cầu luồng đặt lịch theo hướng dẫn (Wizard) 4 bước: (1) Chọn dịch vụ, (2) Chọn bác sĩ có năng lực tương ứng, (3) Lựa chọn slot rảnh trên lịch, (4) Xác nhận thông tin. Yêu cầu nghiệp vụ cốt lõi (BRU_02): Không được phép đặt lịch chồng chéo với lịch hẹn đang tồn tại của bác sĩ (`checkConflict`).
- **FR_13, FR_14 (Quản trị):** Cung cấp giao diện cho Admin thêm/sửa/xóa (CRUD) dữ liệu ca làm việc và dịch vụ.

### 3.2. Phân tích hệ thống
- **Xác định Actor:** Có 4 tác nhân tương tác với hệ thống trong Phân đoạn 1: `Customer`, `Doctor`, `Admin` và `System` (hệ thống tự động).
- **Biểu đồ Use Case:**
  - `Customer` -> `(UC_01) Đăng ký/Đăng nhập`, `(UC_04) Đặt lịch hẹn`.
  - `Doctor` -> `(UC_09) Xem lịch làm việc`, `(UC_11) Cập nhật trạng thái`.
  - `Admin` -> `(UC_17) Quản lý nhân sự`, `(UC_19) Quản lý dịch vụ`.
- **Kịch bản Use Case Đặt lịch:**
  - Điều kiện tiên quyết: Khách hàng đã đăng nhập.
  - Luồng chính: Customer chọn dịch vụ -> Server query trả về danh sách bác sĩ chuyên môn phù hợp -> Customer chọn bác sĩ -> Server query trả về các slot giờ trống -> Customer chọn slot -> Nhấn xác nhận.
  - Luồng ngoại lệ: Khung giờ vừa bị người khác đặt -> Server báo lỗi 409 Conflict -> Yêu cầu chọn slot khác.

### 3.3. Thiết kế hệ thống
- **Thiết kế Cơ sở dữ liệu (ERD - Phiên bản 1):** 
  - Khởi tạo bảng trung tâm `Users` đóng vai trò lưu trữ toàn bộ account (phân loại qua cột `role`).
  - Bảng `Services` lưu trữ thông tin dịch vụ.
  - Bảng `Shifts` quản lý khung thời gian làm việc chuẩn của nhân sự.
  - Bảng trung tâm giao dịch `Appointments`: Liên kết `customerId`, `staffId`, `serviceId`, kết hợp lưu trữ trường thời gian `date`, `time` và trạng thái `status`.
- **Thiết kế Giao diện (Mockup):** Xây dựng wireframe cho các trang Login/Register, bảng điều khiển Admin, và modal Đặt lịch hẹn.

### 3.4. Cài đặt và Kiểm thử
Trong giai đoạn này, nhóm tiến hành lập trình backend API theo chuẩn REST, xây dựng frontend bằng Vanilla JS và kết nối database. Sau khi code, tiến hành kiểm thử ngay lập tức.
- **Kiểm thử hộp đen (Black-box Testing):** 
  - Đánh giá luồng Form Đăng nhập và Đăng ký. Sử dụng kỹ thuật *Phân lớp tương đương* và *Phân tích giá trị biên*.
  - *Ví dụ Test case:* Nhập mật khẩu 5 ký tự (dưới biên hợp lệ) -> Hệ thống phải chặn và báo lỗi (HTTP 400). Đăng nhập sai thông tin -> Báo lỗi Unauthorized (HTTP 401).
- **Kiểm thử hộp trắng (White-box Testing):**
  - Đánh giá hàm lõi `checkConflict` (Kiểm tra trùng lịch) trong `AppointmentController`.
  - *Xây dựng biểu đồ luồng:* Hàm sẽ đọc `date`, `time` và `duration`. So khớp thời gian bắt đầu và kết thúc với các lịch hiện có trong DB của `staffId`.
  - *Độ phủ nhánh (Branch coverage):* Phải test qua 3 luồng logic: (1) Nhánh thiếu tham số đầu vào -> văng lỗi 400; (2) Nhánh phát hiện thời gian chồng lấp -> văng lỗi 409; (3) Nhánh thời gian an toàn -> Cho phép INSERT lịch mới (201 Created).
- **Tổng kết Phân đoạn 1:** Toàn bộ chức năng nền tảng hoạt động trơn tru. Sản phẩm đã sẵn sàng để demo phần lõi.

---

## CHƯƠNG 4: THỰC THI PHÂN ĐOẠN 2 (TÍNH NĂNG NÂNG CAO)
*(Chu trình lặp lại để mở rộng tính năng và hoàn thiện sản phẩm)*

### 4.1. Khảo sát và Phân tích bổ sung
Sau khi vận hành Phân đoạn 1, hệ thống đối mặt với các nhu cầu phát sinh từ thực tế nghiệp vụ Spa:
- Bác sĩ A gặp sự cố đột xuất, không thể đi làm vào ngày X, trong khi đã có sẵn 5 lịch hẹn của khách hàng. Việc Admin gọi điện hủy từng lịch là thiếu chuyên nghiệp. Yêu cầu một **Quy trình Đổi Ca**.
- Quản lý cần theo dõi mức độ hài lòng của khách sau dịch vụ để đánh giá KPI nhân viên. Yêu cầu **Hệ thống Review**.
- Cần có bảng tổng hợp tài chính cuối tháng. Yêu cầu **Module Thống Kê**.

### 4.2. Thiết kế hệ thống (Bản cập nhật 2.0)
Hệ thống không bị đập bỏ mà được "Tăng trưởng" (Incremental) dựa trên khung kiến trúc đã xây:
- **Cập nhật ERD CSDL:** 
  - Bổ sung bảng `ShiftSwaps` với các khóa ngoại `requesterId`, `targetId`, `shiftId` và cột trạng thái `status` (pending -> accepted -> approved).
  - Bổ sung bảng `Reviews` ánh xạ tỷ lệ 1:1 với bảng `Appointments` (Mỗi lịch hẹn chỉ được đánh giá 1 lần).
  - Bổ sung bảng `Notifications` để lưu trữ log thông báo.
- **Thiết kế kiến trúc Module:** Áp dụng mô hình Transaction trong Database (BEGIN - COMMIT - ROLLBACK) cho tính năng duyệt đổi ca. Đảm bảo nếu quá trình chuyển 5 lịch hẹn bị lỗi ở lịch hẹn thứ 3, toàn bộ thao tác sẽ bị rollback để không làm sai lệch dữ liệu.

### 4.3. Cài đặt và Kiểm thử tính năng mới
- **Quá trình Lập trình:** Cập nhật các Controller mới, bổ sung routes, xử lý logic frontend cho dashboard thống kê (sử dụng Chart.js để vẽ biểu đồ doanh thu).
- **Kiểm thử hộp đen (Hệ thống Review - FR_07):** 
  - Kiểm thử ràng buộc nghiệp vụ (Business Rules): Chỉ những lịch hẹn có status = `completed` mới hiển thị nút Đánh giá. Tài khoản khác cố tình gửi request POST review cho lịch của người khác -> Server chặn lỗi 403 Forbidden.
- **Kiểm thử hộp trắng (Hàm `updateStatus` - Logic hủy lịch):**
  - *Sơ đồ luồng:* Khi request là `cancelled`, hệ thống phải kiểm tra role (Admin hủy được mọi lịch, Khách chỉ hủy được lịch của mình). Tiếp theo, kiểm tra cọc (depositPaid). Nếu có cọc, kiểm tra hàm `canRefund(date, time)`. Nếu thời điểm hủy cách giờ hẹn > 24h, cập nhật cờ `depositRefunded = 1`.
  - *Test nhánh:* Phủ sóng các kịch bản hủy trước 24h (hợp lệ hoàn tiền) và sau 24h (mất tiền cọc) để đảm bảo không thất thoát dòng tiền của doanh nghiệp.

---

## KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 1. Kết quả đạt được
- Ứng dụng thành công **Quy trình Lặp và Tăng trưởng** từ lý thuyết vào thực tiễn dự án phần mềm. Hệ thống SpaProMax được hoàn thành đúng kế hoạch qua 2 phân đoạn, đáp ứng vượt mong đợi các nghiệp vụ phức tạp của một cơ sở Spa/Phòng khám chuyên nghiệp (quản lý lịch, phân quyền, xử lý xung đột, đổi ca tự động).
- Vận dụng bài bản và trơn tru các bộ công cụ phát triển phần mềm chuẩn công nghiệp: từ quản lý tiến độ (Trello), version control (GitHub), thiết kế mockup và hệ thống (Figma, UML, ERD), cho đến lập trình (VS Code, Node.js) và kiểm thử (Postman).

### 2. Ưu điểm và bài học kinh nghiệm trong quy trình
- **Ưu điểm:** Việc chọn mô hình Lặp tăng trưởng là quyết định mang tính chiến lược. Nó giúp đội ngũ phát triển không bị "ngợp" trước các nghiệp vụ logic quá phức tạp (đổi ca, hoàn tiền, thông báo hàng loạt) trong những ngày đầu. Khi lõi hệ thống đã vững ở Phân đoạn 1, việc lập trình và sửa lỗi ở Phân đoạn 2 diễn ra rất mượt mà.
- **Bài học kinh nghiệm:** Để mô hình này hoạt động hiệu quả, đòi hỏi hệ thống cơ sở dữ liệu (Database) ban đầu phải được thiết kế có tính mở, dễ dàng bổ sung bảng mới (Reviews, Swaps) mà không phá vỡ liên kết cũ. Việc quản lý mã nguồn bằng Git branch chặt chẽ là chìa khóa để không làm hỏng code cốt lõi khi phát triển tính năng phụ trợ.

### 3. Hướng phát triển tương lai (Các vòng lặp tiếp theo)
Hệ thống hoàn toàn có thể tiếp tục "Tăng trưởng" qua Phân đoạn 3, 4 trong tương lai với các đề xuất sau:
- **Tích hợp cổng Thanh toán điện tử (Fintech):** Chuyển từ việc tải lên ảnh chuyển khoản thủ công sang thanh toán qua VNPay, MoMo, ZaloPay API, cho phép tự động cập nhật trạng thái `depositPaid = 1` tức thời.
- **Tích hợp Trí tuệ nhân tạo (AI & Machine Learning):** Xây dựng module gợi ý (Recommendation Engine) dựa trên lịch sử đặt dịch vụ của khách hàng để cross-sell (bán chéo) các gói liệu trình phù hợp. Gắn thêm Chatbot tư vấn khách hàng 24/7 tự động kiểm tra slot trống qua API hệ thống.
