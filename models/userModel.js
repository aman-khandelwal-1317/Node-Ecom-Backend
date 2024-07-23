const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
  address: [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Address',
  }],
}, {
  timestamps: true,
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);


module.exports = {User,Address}
