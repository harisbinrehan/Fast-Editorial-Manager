const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationsController');

// ...your authentication middleware, if needed

router.get('/:userId', notificationController.getNotifications);
router.post('/:id/read', notificationController.markAsRead);

module.exports = router;
