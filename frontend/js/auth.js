/**
 * SpaProMax — Auth State Manager + Utilities
 */

// ─── Auth ─────────────────────────────────────────────────
const Auth = {
  getUser()  { try { return JSON.parse(localStorage.getItem('spm_user')); } catch { return null; } },
  getToken() { return localStorage.getItem('spm_token'); },
  isLoggedIn(){ return !!this.getToken(); },
  isAdmin()  { return this.getUser()?.role === 'admin'; },
  isDoctor() { return this.getUser()?.role === 'doctor'; },
  isCustomer(){ return this.getUser()?.role === 'customer'; },

  login(token, user) {
    localStorage.setItem('spm_token', token);
    localStorage.setItem('spm_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('spm_token');
    localStorage.removeItem('spm_user');
    window.location.href = '/login.html';
  },

  redirectToDashboard() {
    const role = this.getUser()?.role;
    if (role === 'admin')    window.location.href = '/admin/dashboard.html';
    else if (role === 'doctor') window.location.href = '/doctor/dashboard.html';
    else                     window.location.href = '/customer/dashboard.html';
  },

  // Call this at top of protected pages to gate access
  // requiredRole: string | string[] | null
  // adminBypass: if true (default), admin can access any page
  requireLogin(requiredRole = null, adminBypass = true) {
    if (!this.isLoggedIn()) { window.location.href = '/login.html'; return false; }
    const role = this.getUser()?.role;
    // Admin bypass: admin có thể xem tất cả trang (trừ khi tắt)
    if (adminBypass && role === 'admin') return true;
    if (requiredRole) {
      const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!allowed.includes(role)) {
        this.redirectToDashboard(); return false;
      }
    }
    return true;
  }
};

// ─── Toast ────────────────────────────────────────────────
const Toast = {
  container: null,

  init() {
    if (!document.getElementById('toast-container')) {
      const el = document.createElement('div');
      el.id = 'toast-container';
      document.body.appendChild(el);
    }
    this.container = document.getElementById('toast-container');
  },

  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${message}</span>`;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success: (msg) => Toast.show(msg, 'success'),
  error:   (msg) => Toast.show(msg, 'error'),
  info:    (msg) => Toast.show(msg, 'info'),
  warning: (msg) => Toast.show(msg, 'warning'),
};

// ─── Page Loader ──────────────────────────────────────────
const Loader = {
  show() {
    const el = document.getElementById('page-loader');
    if (el) { el.style.display = 'flex'; el.classList.remove('hide'); }
  },
  hide() {
    const el = document.getElementById('page-loader');
    if (el) {
      el.classList.add('hide');
      setTimeout(() => { el.style.display = 'none'; }, 400);
    }
  }
};

// ─── Format Utilities ─────────────────────────────────────
const Fmt = {
  currency(n) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  },
  date(str) {
    return new Date(str).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  },
  dateShort(str) {
    return new Date(str).toLocaleDateString('vi-VN');
  },
  timeAgo(str) {
    const diff = Date.now() - new Date(str);
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'Vừa xong';
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    return Fmt.dateShort(str);
  },
  statusVi(status) {
    return { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', 'in-progress':'Đang khám', completed:'Hoàn thành', cancelled:'Đã hủy' }[status] || status;
  },
  statusBadge(status) {
    return `<span class="badge badge-${status}">${Fmt.statusVi(status)}</span>`;
  },
  stars(n) {
    return '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
  },
  categoryVi(cat) {
    return cat === 'medical' ? 'Y tế' : 'Spa & Làm đẹp';
  },
  categoryBadge(cat) {
    const cls = cat === 'medical' ? 'badge-medical' : 'badge-spa';
    return `<span class="badge ${cls}">${Fmt.categoryVi(cat)}</span>`;
  },
  avatar(url, name = '?') {
    if (url) return `<img src="${url}" alt="${name}" class="avatar" onerror="this.outerHTML=Fmt.avatarFallback('${name}')">`;
    return Fmt.avatarFallback(name);
  },
  avatarFallback(name) {
    const initials = name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
    return `<div class="avatar" style="background:var(--grad-purple);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700">${initials}</div>`;
  }
};

// ─── Count-Up Animation ───────────────────────────────────
function animateCount(el, target, duration = 1200, prefix = '', suffix = '') {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * target).toLocaleString('vi-VN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ─── Intersection Observer for reveal ────────────────────
function initRevealAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Sidebar Active State ─────────────────────────────────
function initSidebarActive() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes(path)) link.classList.add('active');
  });
}

// ─── Populate Sidebar User Info ───────────────────────────
function populateSidebarUser() {
  const user = Auth.getUser();
  if (!user) return;
  const nameEl = document.getElementById('sidebar-user-name');
  const roleEl = document.getElementById('sidebar-user-role');
  const avatarEl = document.getElementById('sidebar-user-avatar');
  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = user.role === 'doctor' ? 'Bác sĩ / KTV' : user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
  if (avatarEl) { avatarEl.src = user.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7C3AED&color=fff`; }

  // Nếu admin đang xem trang không phải của admin, hiện banner cảnh báo
  if (user.role === 'admin') {
    const path = window.location.pathname;
    if (path.includes('/doctor/') || path.includes('/customer/')) {
      const roleViewing = path.includes('/doctor/') ? 'Bác Sĩ/KTV' : 'Khách Hàng';
      const banner = document.createElement('div');
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:linear-gradient(90deg,#7C3AED,#06B6D4);color:#fff;text-align:center;font-size:13px;font-weight:600;padding:6px 16px;display:flex;align-items:center;justify-content:center;gap:12px';
      banner.innerHTML = `🔧 Admin đang xem trang ${roleViewing} <a href="/admin/dashboard.html" style="color:#fff;text-decoration:underline;font-size:12px">← Quay về Admin</a>`;
      document.body.prepend(banner);
      // Đẩy content xuống
      document.body.style.paddingTop = '32px';
    }
  }
}

// ─── Notification Badge & Real-time Polling ────────────────
class NotificationService {
  constructor() {
    this.unreadCount = 0;
    this.intervalId = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    if (!Auth.getToken()) return;

    try {
      const res = await API.getUnreadCount();
      this.unreadCount = res.count;
      this.updateBadge(this.unreadCount);

      // Bắt đầu polling mỗi 15s
      this.intervalId = setInterval(() => this.poll(), 15000);
      this.isInitialized = true;
    } catch (e) {
      console.warn('Cannot init notifications:', e);
    }
  }

  async poll() {
    try {
      const res = await API.getUnreadCount();
      if (res.count > this.unreadCount) {
        // Có thông báo mới! Lấy danh sách để hiện Toast
        const notifs = await API.getNotifications();
        // Lọc những thông báo chưa đọc và lấy số lượng mới tăng thêm
        const newNotifs = notifs.filter(n => n.isRead === 0).slice(0, res.count - this.unreadCount);
        
        for (const n of newNotifs) {
          Toast.success(`🔔 ${n.title}: ${n.message}`);
        }
      }
      this.unreadCount = res.count;
      this.updateBadge(this.unreadCount);
    } catch (e) {
      // Ignore poll errors
    }
  }

  updateBadge(count) {
    // Có thể có nhiều thẻ badge (topbar, sidebar...)
    const badges = document.querySelectorAll('.notification-badge, #notif-badge');
    badges.forEach(b => {
      b.textContent = count > 99 ? '99+' : count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
      if(b.id === 'notif-badge') b.style.display = count > 0 ? 'block' : 'none';
    });
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.isInitialized = false;
  }
}

window.NotifService = new NotificationService();

// ─── Global Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Loader.hide();
  initSidebarActive();
  populateSidebarUser();
  initRevealAnimations();
  
  // Init Real-time Notifications
  setTimeout(() => window.NotifService.init(), 1000);

  // Logout button
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', () => Auth.logout());
  });

  // Modal close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});

window.Auth = Auth;
window.Toast = Toast;
window.Loader = Loader;
window.Fmt = Fmt;
window.animateCount = animateCount;
