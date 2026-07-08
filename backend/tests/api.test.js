const request = require('supertest');
const app = require('../server');
const db = require('../db');

// Đóng kết nối DB sau khi chạy xong tất cả test
afterAll(async () => {
  await db.end();
});

// ===========================================================
// NHÓM 1: Kiểm thử API Health Check
// ===========================================================
describe('1. Health Check', () => {

  it('[TC01] GET /api/health - server đang chạy trả về 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('SpaProMax API');
  });

});

// ===========================================================
// NHÓM 2: Kiểm thử Đăng nhập (/api/auth/login)
// => Bảng kiểm thử hộp đen - Phân lớp tương đương & Giá trị biên
// ===========================================================
describe('2. API Đăng nhập - Black-box Testing', () => {

  // Lớp 1: Dữ liệu đầu vào không hợp lệ (Thiếu trường)
  it('[TC02] Thiếu cả username và password => 400 Bad Request', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Username and password required');
  });

  it('[TC03] Có username nhưng thiếu password => 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin_spa' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Username and password required');
  });

  it('[TC04] Có password nhưng thiếu username => 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: '123456' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Username and password required');
  });

  // Lớp 2: Dữ liệu đầu vào hợp lệ nhưng sai thông tin
  it('[TC05] Username không tồn tại trong hệ thống => 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'user_khong_ton_tai_xyz_999', password: 'password123' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Tên đăng nhập hoặc mật khẩu không đúng');
  });

});

// ===========================================================
// NHÓM 3: Kiểm thử Đăng ký (/api/auth/register)
// ===========================================================
describe('3. API Đăng ký - Black-box Testing', () => {

  it('[TC06] Thiếu trường "name" bắt buộc => 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser01', password: 'password123' }); // Thiếu name
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Thiếu thông tin bắt buộc');
  });

  it('[TC07] Username ngắn hơn 6 ký tự (giá trị biên) => 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'abc', password: 'password123', name: 'Test User' }); // 'abc' chỉ 3 ký tự
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Tên đăng nhập phải từ 6 đến 20 ký tự');
  });

  it('[TC08] Password ngắn hơn 6 ký tự (giá trị biên) => 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser01', password: '123', name: 'Test User' }); // '123' chỉ 3 ký tự
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Mật khẩu phải có ít nhất 6 ký tự');
  });

});

// ===========================================================
// NHÓM 4: Kiểm thử API Dịch vụ (/api/services)
// ===========================================================
describe('4. API Dịch vụ - Black-box Testing', () => {

  it('[TC09] GET /api/services - Lấy danh sách dịch vụ => 200 OK', async () => {
    const res = await request(app).get('/api/services');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Kết quả phải là một mảng
  });

  it('[TC10] POST /api/services - Tạo dịch vụ mà không có token => 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/services')
      .send({ name: 'Dịch vụ test', price: 100000 });
    expect(res.statusCode).toEqual(401); // Phải bị chặn vì không có JWT token
  });

});

// ===========================================================
// NHÓM 5: Kiểm thử API Bác sĩ (/api/doctors)
// ===========================================================
describe('5. API Bác sĩ - Black-box Testing', () => {

  it('[TC11] GET /api/doctors - Lấy danh sách bác sĩ => 200 OK', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

// ===========================================================
// NHÓM 6: Kiểm thử Bảo vệ tuyến đường (Route Protection)
// - Mọi API yêu cầu đăng nhập phải trả về 401 khi không có token
// ===========================================================
describe('6. Bảo vệ phân quyền - Authorization Testing', () => {

  it('[TC12] GET /api/appointments - Không có token => 401 Unauthorized', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.statusCode).toEqual(401);
  });

  it('[TC13] GET /api/appointments/my - Không có token => 401 Unauthorized', async () => {
    const res = await request(app).get('/api/appointments/my');
    expect(res.statusCode).toEqual(401);
  });

  it('[TC14] POST /api/shifts - Tạo ca làm không có token => 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/shifts')
      .send({ staffId: 'BS001', dayOfWeek: 'Monday', startTime: '08:00', endTime: '12:00' });
    expect(res.statusCode).toEqual(401);
  });

  it('[TC15] GET /api/shifts/swaps - Xem đổi ca không có token => 401 Unauthorized', async () => {
    const res = await request(app).get('/api/shifts/swaps');
    expect(res.statusCode).toEqual(401);
  });

  it('[TC16] GET /api/auth/me - Xem hồ sơ không có token => 401 Unauthorized', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
  });

  it('[TC17] Token giả mạo bị từ chối truy cập => 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token_gia_mao_xyz_abc_123');
    expect(res.statusCode).toEqual(403);
  });

});

// ===========================================================
// NHÓM 7: Kiểm thử Validate Input nâng cao
// ===========================================================
describe('7. Validate Input - Giá trị biên nâng cao', () => {

  it('[TC18] POST /api/auth/register - Username dài hơn 20 ký tự => 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username_qua_dai_hon_20_ky_tu_xyz',
        password: 'password123',
        name: 'Test User'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Tên đăng nhập phải từ 6 đến 20 ký tự');
  });

  it('[TC19] GET /api/services/:id - ID dịch vụ không tồn tại => 404 Not Found', async () => {
    const res = await request(app).get('/api/services/dich_vu_khong_ton_tai_xyz_999');
    expect(res.statusCode).toEqual(404);
  });

  it('[TC20] PUT /api/auth/change-password - Không có token => 401 Unauthorized', async () => {
    const res = await request(app)
      .put('/api/auth/change-password')
      .send({ oldPassword: 'abc123', newPassword: 'newpass123' });
    expect(res.statusCode).toEqual(401);
  });

});
