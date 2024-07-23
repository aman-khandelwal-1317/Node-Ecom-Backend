const jwt = require('jsonwebtoken');
const {User} = require('../models/userModel');
const Admin = require('../models/adminModel');

const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({
        success : false,
        error : 'Not authorized, token failed!!'
      });
     
    }
  }

  if (!token) {
    return res.status(400).json({
      success : false,
      error : 'Not authorized, token failed!!'
    });
   
  }
};

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select('-password');
      if (req.admin) {
        next();
      } else {
        return res.status(400).json({
          success : false,
          error : 'Not authorized as an admin'
        });
       
      }
    } catch (error) {
      
      return res.status(400).json({
        success : false,
        error : 'Not authorized, token failed!!'
      });
    }
  }

  if (!token) {
    return res.status(400).json({
      success : false,
      error : 'Not authorized, token failed!!'
    });
  }
};

module.exports = { protectUser, protectAdmin };
