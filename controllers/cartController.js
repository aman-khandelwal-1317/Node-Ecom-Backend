const {User} = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(400).json({
      success : false,
      error : 'Product not found!!'
    });
    
  }

  const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    user.cart[itemIndex].quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  res.status(200).json({ success: true, cart: user.cart });
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  user.cart = user.cart.filter(item => item.product.toString() !== productId);

  await user.save();

  res.status(200).json({ success: true, cart: user.cart });
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');

  if (!user) {
    res.status(400).json({
      success : false,
      error : 'User not found!!'
    });
  }

  res.status(200).json({ success: true, cart: user.cart });
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
