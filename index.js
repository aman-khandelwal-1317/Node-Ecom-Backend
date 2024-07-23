const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var cors = require('cors')

const {Address,User} = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes'); 

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminOrderRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use(notFound);
app.use(errorHandler);




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
