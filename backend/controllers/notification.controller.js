import Notification from '../models/notification.model.js';
import { errorHandler } from '../utils/error.js';

export const getNotifications = async (req, res, next) => {
    try {
        if (!req.user) return next(errorHandler(401, 'Unauthorized'));

        // Fetch notifications: specifically for this user OR broadcast (null)
        // Filter logic can be refined: e.g. only global notifications created AFTER user registration? 
        // For now, simpler is better: All global notifications + specific ones.
        const notifications = await Notification.find({
            $or: [
                { recipient: req.user.id },
                { recipient: null }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20 to ensure performance

        // Transform to add 'isRead' flag for the requesting user
        const result = notifications.map(n => ({
            _id: n._id,
            title: n.title,
            message: n.message,
            link: n.link,
            type: n.type,
            createdAt: n.createdAt,
            isRead: n.readBy.includes(req.user.id)
        }));

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        // Use addToSet to avoid duplicates in the array
        await Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { readBy: req.user.id } }
        );

        res.status(200).json('Notification marked as read');
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req, res, next) => {
    try {
        // Find all notifications for relevant to user that are NOT read by user
        const unreadCriteria = {
            $or: [{ recipient: req.user.id }, { recipient: null }],
            readBy: { $ne: req.user.id }
        };

        await Notification.updateMany(
            unreadCriteria,
            { $addToSet: { readBy: req.user.id } }
        );

        res.status(200).json('All notifications marked as read');
    } catch (error) {
        next(error);
    }
}
