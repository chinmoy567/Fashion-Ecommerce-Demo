import express from 'express';
import Notification from '../models/Notification.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// POST /notifications - Send notification (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { userId, title, message, type, link } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'title and message are required' });
  }

  const notification = new Notification({
    userId: userId || null,
    title,
    message,
    type: type || 'general',
    link: link || null,
    isRead: false,
  });

  await notification.save();

  res.status(201).json({ success: true, message: 'Notification created', data: notification });
});

// GET /notifications - Get user's notifications
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, unreadOnly = false } = req.query;

  let query = { $or: [{ userId }, { userId: null }] };
  if (unreadOnly === 'true') query.isRead = false;

  const skip = (page - 1) * limit;
  const notifications = await Notification.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

  res.json({
    success: true,
    message: 'Notifications retrieved',
    data: {
      items: notifications,
      unreadCount,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// PUT /notifications/:id/read - Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  // Check authorization
  if (notification.userId && notification.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true, message: 'Notification marked as read', data: notification });
});

// PUT /notifications/read-all - Mark all notifications as read
router.put('/read-all', verifyToken, async (req, res) => {
  const userId = req.user.id;

  await Notification.updateMany(
    { $or: [{ userId }, { userId: null }], isRead: false },
    { isRead: true }
  );

  res.json({ success: true, message: 'All notifications marked as read' });
});

// DELETE /notifications/:id - Delete notification
router.delete('/:id', verifyToken, async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  // Check authorization
  if (notification.userId && notification.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Notification deleted' });
});

// GET /notifications/count - Get unread notification count
router.get('/count', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const unreadCount = await Notification.countDocuments({
    $or: [{ userId }, { userId: null }],
    isRead: false,
  });

  res.json({ success: true, data: { unreadCount } });
});

export default router;
