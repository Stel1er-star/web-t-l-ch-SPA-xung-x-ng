const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    req.user = user;
    next();
  });
};

/**
 * Role-based authorization middleware factory
 * Usage: authorize('admin') or authorize('admin', 'doctor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This action requires one of these roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
