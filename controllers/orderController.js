const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const {User} = require('../models/userModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddressId, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
     return res.status(400).json({
        success : false,
        error : 'Order not found!!'
      });
    }
  
    const user = await User.findById(req.user._id);
  
    if (!user) {
      return res.status(400).json({
        success : false,
        error : 'User not found!!'
      });
    }
  
     // Find the shipping address by ID
  const shippingAddress = user.address.find(address => address._id.toString() === shippingAddressId);

  
    if (!shippingAddress) {
      return res.status(400).json({
        success : false,
        error : 'Shipping Address not found!!'
      });
    }
  
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map(item => ({
        product: item.product,
        qty: item.quantity,
      })),
      shippingAddress: shippingAddress._id,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
  
    const createdOrder = await order.save();

     // Decrease stock count
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.countInStock -= item.quantity;
    await product.save();
  }

    user.orders.push(createdOrder._id);
    await user.save();
  
    return res.status(200).json({
      success : true,
      createdOrder
    });
    
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    return res.status(200).json({
      success : true,
      order
    });
  } else {
    return res.status(400).json({
      success : false,
      error : 'Order not found!!'
    });
  }
};


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  return res.status(200).json({
    success : true,
    orders
  });
};


// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email');
    return res.status(200).json({
      success : true,
      orders
    });
  };
  
  // @desc    Update order status
  // @route   PUT /api/admin/orders/:id/status
  // @access  Private/Admin
  const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);
  
    if (order) {
      order.status = req.body.status || order.status;
  
      const updatedOrder = await order.save();
      return res.status(200).json({
        success : true,
        updatedOrder
      });
    } else {
      return res.status(400).json({
        success : false,
        message : 'Order not found!!'
      });
    }
  };


  // @desc    Cancel an order
// @route   DELETE /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(400).json({
      success : false,
      error : 'Order not found!!'
    });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(400).json({
      success : false,
      error : 'Not authorized to cancel this order!!'
    });
  }

  if (order.isDelivered) {
    return res.status(400).json({
      success : false,
      error : 'Cannot cancel a delivered order!!'
    });
  }

  await order.deleteOne();

  // Remove order ID from user's orders array
  const user = await User.findById(req.user._id);
  user.orders = user.orders.filter(orderId => orderId.toString() !== req.params.id);
  await user.save();

  return res.status(200).json({
    success : true,
    message : 'Order cancelled and removed from database'
  });
};


module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
