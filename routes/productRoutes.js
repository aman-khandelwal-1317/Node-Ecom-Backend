const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require('../controllers/productController');

const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protectAdmin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

router.route('/category/:category')
  .get(getProductsByCategory); 

module.exports = router;
