const express = require('express');
const { addToCart, removeFromCart, getCart } = require('../controllers/cartController');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protectUser, addToCart)
  .get(protectUser, getCart);

router.route('/:productId')
  .delete(protectUser, removeFromCart);

module.exports = router;
