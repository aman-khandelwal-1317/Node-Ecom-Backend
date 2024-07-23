const express = require('express');
const { registerUser, authUser, forgotPassword, resetPassword , addAddress, getUserInfo } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(authUser);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);
router.route('/address').post(protectUser, addAddress);
router.route('/info').get(protectUser, getUserInfo);

module.exports = router;
