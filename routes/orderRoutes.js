const express = require('express');
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  cancelOrder
} = require('../controllers/orderController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protectUser, addOrderItems);

router.route('/myorders')
  .get(protectUser, getMyOrders);

router.route('/:id')
  .get(protectUser, getOrderById)
  .delete(protectUser, cancelOrder);

module.exports = router;
