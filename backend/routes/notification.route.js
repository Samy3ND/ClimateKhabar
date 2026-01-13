import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.put('/:notificationId/read', verifyToken, markAsRead);
router.put('/read-all', verifyToken, markAllAsRead);

export default router;
