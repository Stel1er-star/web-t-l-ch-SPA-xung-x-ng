const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 20',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

router.get('/unread-count', async (req, res) => {
  try {
    const [[row]] = await db.query(
      'SELECT COUNT(*) as count FROM Notifications WHERE userId = ? AND isRead = 0',
      [req.user.id]
    );
    res.json({ count: row.count });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

router.patch('/:id/read', async (req, res) => {
  try {
    await db.query('UPDATE Notifications SET isRead = 1 WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

router.patch('/read-all', async (req, res) => {
  try {
    await db.query('UPDATE Notifications SET isRead = 1 WHERE userId = ?', [req.user.id]);
    res.json({ message: 'All marked as read' });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

module.exports = router;
