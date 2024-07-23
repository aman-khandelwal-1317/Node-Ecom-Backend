const express = require('express');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/orders')
  .get(protectAdmin, getAllOrders);

router.route('/orders/:id/status')
  .put(protectAdmin, updateOrderStatus);

module.exports = router;
