/**
 * SpaProMax — API Client
 * Centralized fetch wrapper with JWT injection and error handling
 */

const API_BASE = 'http://localhost:3002/api';

function getToken() {
  return localStorage.getItem('spm_token');
}

async function request(method, endpoint, data = null, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const config = { method, headers };
  if (data && method !== 'GET') {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  // Build query string for GET
  let url = `${API_BASE}${endpoint}`;
  if (data && method === 'GET') {
    const params = new URLSearchParams(data);
    url += `?${params}`;
  }

  const res = await fetch(url, config);
  // Parse JSON trước khi kiểm tra status để có thể đọc error message
  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    // Nếu đang ở trang login thì hiện lỗi thực tế (sai mật khẩu)
    if (window.location.pathname.includes('login')) {
      throw new Error(json.error || 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
    // Token hết hạn — redirect về login
    localStorage.removeItem('spm_token');
    localStorage.removeItem('spm_user');
    window.location.href = '/login.html';
    throw new Error('Session expired');
  }

  if (!res.ok) throw new Error(json.error || json.message || `HTTP ${res.status}`);
  return json;
}

const API = {
  get:    (ep, params) => request('GET',    ep, params),
  post:   (ep, body)   => request('POST',   ep, body),
  put:    (ep, body)   => request('PUT',    ep, body),
  patch:  (ep, body)   => request('PATCH',  ep, body),
  delete: (ep)         => request('DELETE', ep),

  // Auth
  login:          (body)   => API.post('/auth/login', body),
  register:       (body)   => API.post('/auth/register', body),
  me:             ()       => API.get('/auth/me'),
  updateProfile:  (body)   => API.put('/auth/profile', body),
  changePassword: (body)   => API.put('/auth/change-password', body),
  uploadAvatar:   (file)   => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request('POST', '/auth/avatar', formData, true);
  },

  // Appointments
  getAppointments:  (p)    => API.get('/appointments', p),
  getMyAppts:       ()     => API.get('/appointments/my'),
  getSlots:         (p)    => API.get('/appointments/available-slots', p),
  getStaffAppts:    (id,p) => API.get(`/appointments/staff/${id}`, p),
  createAppt:       (body) => API.post('/appointments', body),
  updateApptStatus: (id,b) => API.patch(`/appointments/${id}/status`, b),

  // Services
  getServices:    (p)    => API.get('/services', p),
  getService:     (id)   => API.get(`/services/${id}`),
  getServiceStaff:(id)   => API.get(`/services/${id}/staff`),
  createService:  (body) => API.post('/services', body),
  updateService:  (id,b) => API.put(`/services/${id}`, b),
  deleteService:  (id)   => API.delete(`/services/${id}`),

  // Doctors
  getDoctors:  ()   => API.get('/doctors'),
  getDoctor:   (id) => API.get(`/doctors/${id}`),

  // Shifts
  getShifts:     ()    => API.get('/shifts'),
  getStaffShifts:(id)  => API.get(`/shifts/${id}`),
  createShift:   (b)   => API.post('/shifts', b),
  updateShift:   (id,b)=> API.put(`/shifts/${id}`, b),
  deleteShift:   (id)  => API.delete(`/shifts/${id}`),
  getShiftSwaps:        (p)    => API.get('/shifts/swaps', p),
  createShiftSwap:      (body) => API.post('/shifts/swaps', body),
  updateShiftSwapStatus:(id,b) => API.put(`/shifts/swaps/${id}/status`, b),

  // Reviews
  getReviews:    (p)    => API.get('/reviews', p),
  createReview:  (body) => API.post('/reviews', body),
  replyReview:   (id,b) => API.post(`/reviews/${id}/reply`, b),
  likeReview:    (id)   => API.post(`/reviews/${id}/like`),

  // Notifications
  getNotifications:  ()   => API.get('/notifications'),
  getUnreadCount:    ()   => API.get('/notifications/unread-count'),
  readAll:           ()   => API.patch('/notifications/read-all'),

  // Admin
  getAdminDashboard: ()    => API.get('/admin/dashboard'),
  getAdminReports:   (p)   => API.get('/admin/reports', p),
  getAdminUsers:     (p)   => API.get('/admin/users', p),
  createAdminUser:   (b)   => API.post('/admin/users', b),
  updateAdminUser:   (id,b)=> API.put(`/admin/users/${id}`, b),
  deleteAdminUser:   (id)  => API.delete(`/admin/users/${id}`),
  getDoctorServices: (id)  => API.get(`/admin/users/${id}/services`),
  updateDoctorServices:(id,serviceIds) => API.patch(`/admin/users/${id}/services`, { serviceIds }),
};

window.API = API;
