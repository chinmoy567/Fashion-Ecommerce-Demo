import express from 'express';
import Notification from '../models/Notification.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// POST /notifications - Send notification (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { recipientId, recipientRole, message, type, data } = req.body;

  if (!recipientRole || !message || !type) {
    return res.status(400).json({ success: false, message: 'recipientRole, type, and message are required' });
  }

  const notification = new Notification({
    recipientId: recipientId || null,
    recipientRole,
    type,
    message,
    data: data || null,
    isRead: false,
  });

  await notification.save();

  res.status(201).json({ success: true, message: 'Notification created', data: notification });
});

// GET /notifications - Get user's notifications
router.get('/', verifyToken, async (req, res) => {
  const recipientId = req.user.userId;
  const { page = 1, limit = 10, unreadOnly = false } = req.query;

  let query = { $or: [{ recipientId }, { recipientId: null, recipientRole: req.user.role }] };
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
  if (notification.recipientId && notification.recipientId.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true, message: 'Notification marked as read', data: notification });
});

// PUT /notifications/read-all - Mark all notifications as read
router.put('/read-all', verifyToken, async (req, res) => {
  const recipientId = req.user.userId;

  await Notification.updateMany(
    { $or: [{ recipientId }, { recipientId: null, recipientRole: req.user.role }], isRead: false },
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
  if (notification.recipientId && notification.recipientId.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Notification deleted' });
});

// GET /notifications/count - Get unread notification count
router.get('/count', verifyToken, async (req, res) => {
  const recipientId = req.user.userId;
  const unreadCount = await Notification.countDocuments({
    $or: [{ recipientId }, { recipientId: null, recipientRole: req.user.role }],
    isRead: false,
  });

  res.json({ success: true, data: { unreadCount } });
});

export default router;
