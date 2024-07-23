const Order = require('../models/orderModel.js');
const {User, Address} = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
   return res.status(400).json({
      error : 'User already exists'
    });
  }

  const user = await User.create({
    name,
    email : email.toLowerCase(),
    password,
  });

  if (user) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  
  } else {
    return res.status(400).json({
      success : false,
      error : 'Invalid user data!!'
    });
   
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email : email.toLowerCase() }).populate('address').populate('orders');

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address : user.address,
      token: generateToken(user._id),
      orders : user.orders
    });
  } else {
    return res.status(400).json({
      success : false,
      error : 'Invalid email or password!!'
    });
   
  }
};


const getUserInfo = async (req,res) => {

  const user = await User.findById(req.user._id).populate('address');

  if (user) {

    const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product')
    .populate('user','address')
    .populate({
      path : 'shippingAddress'
    })
   


    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address : user.address,
      token: generateToken(user._id),
      orders
    });
  } else {
    return res.status(400).json({
      success : false,
      error : 'Invalid email or password!!'
    });
   
  }

}


// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).json({
        success : false,
        error : 'User not found!!'
      });
     
    }
  
    const resetToken = user.getResetPasswordToken();
    await user.save();
  
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;
  
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });
  
      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
  
      return res.status(400).json({
        success : false,
        error : 'Email could not be sent!!'
      });
      
    }
  };
  
  // @desc    Reset password
  // @route   PUT /api/users/resetpassword/:resettoken
  // @access  Public
  const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).json({
        success : false,
        error : 'Invalid token!!'
      });
      
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    res.status(201).json({
      success: true,
      data: 'Password updated successfully',
      token: generateToken(user._id),
    });
  };


  // @desc    Add address for a user
// @route   POST /api/users/address
// @access  Private
const addAddress = async (req, res) => {
    const { address, city, postalCode, country } = req.body;
  
    const user = await User.findById(req.user._id);
  
    if (!user) {
      return res.status(400).json({
        success : false,
        error : 'User not found!!'
      });
     
    }
  
    const newAddress = await Address.create({
      address,
      city,
      postalCode,
      country,
    });

    await newAddress.save();
  
    user.address.push(newAddress._id);
  
    await user.save();
  
    res.status(201).json({
      message: 'Address added successfully',
      address: user.address,
    });
  };

module.exports = {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
  addAddress,
  getUserInfo
};
