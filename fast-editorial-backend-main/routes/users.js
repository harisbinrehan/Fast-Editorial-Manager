var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');

/* GET users listing. */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

module.exports = router;
