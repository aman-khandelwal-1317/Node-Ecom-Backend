const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json({
    success : true,
    products
  });
  
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.status(200).json({
      success : true,
      product
    });
    
  } else {
    return res.status(400).json({
      success : false,
      error : 'Product not found!!'
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
    const { name, price, image, brand, category, countInStock, description } = req.body;

    const product = new Product({
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    });
  
  const createdProduct = await product.save();
  return res.status(200).json({
    success : true,
    createdProduct
  });
  
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    return res.status(200).json({
      success : true,
      updatedProduct
    });
    
  } else {
    return res.status(400).json({
      success : false,
      error : 'Product not found!!'
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    return res.status(200).json({
      success : true,
      message : 'Product Removed!!'
    });
    
  } else {
    return res.status(400).json({
      success : false,
      error : 'Product not found!!'
    });
  }
};


// @desc    Fetch products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
    const category = req.params.category;
    const products = await Product.find({ category });
    
    if (products) {
      return res.status(200).json({
        success : true,
       products
      });
    } else {
      return res.status(400).json({
        success : false,
        error : 'Products not found!!'
      });
    }
  };

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
