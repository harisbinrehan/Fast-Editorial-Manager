const Notification = require('../model/notificationsModel');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("USEr", userId)
        const notifications = await Notification.find({ recipient: userId });

        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
