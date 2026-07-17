# Backend Implementation Guide

## Node.js + Express + MongoDB Architecture

### Project Structure

```
backend/
├── src/
│   ├── controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── customerController.js
│   │   ├── adminController.js
│   │   └── analyticsController.js
│   │
│   ├── models/                   # Mongoose schemas
│   │   ├── Customer.js
│   │   ├── Address.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Brand.js
│   │   ├── ProductImage.js
│   │   ├── ProductVariant.js
│   │   ├── ProductTag.js
│   │   ├── Tag.js
│   │   ├── Cart.js
│   │   ├── CartItem.js
│   │   ├── WishlistItem.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Payment.js
│   │   ├── ShippingMethod.js
│   │   ├── AdminUser.js
│   │   ├── Coupon.js
│   │   ├── Review.js
│   │   ├── Notification.js
│   │   ├── ActivityLog.js
│   │   └── Settings.js
│   │
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── customers.js
│   │   ├── admin.js
│   │   ├── analytics.js
│   │   └── index.js              # Route aggregator
│   │
│   ├── middlewares/              # Express middlewares
│   │   ├── auth.js               # JWT verification
│   │   ├── roleAuth.js           # Role-based access
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── validation.js         # Request validation
│   │   ├── logger.js             # Request logging
│   │   ├── cors.js               # CORS configuration
│   │   └── rateLimiter.js        # Rate limiting
│   │
│   ├── services/                 # Business logic
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   ├── emailService.js       # OTP, notifications
│   │   ├── analyticsService.js
│   │   ├── cloudinaryService.js  # File uploads
│   │   └── cartService.js
│   │
│   ├── validations/              # Request validation schemas
│   │   ├── authValidation.js
│   │   ├── productValidation.js
│   │   ├── orderValidation.js
│   │   ├── paymentValidation.js
│   │   └── addressValidation.js
│   │
│   ├── config/                   # Configuration
│   │   ├── database.js           # MongoDB connection
│   │   ├── cloudinary.js         # Cloudinary setup
│   │   ├── email.js              # Email/SMTP setup
│   │   ├── constants.js          # App constants
│   │   └── jwt.js                # JWT configuration
│   │
│   ├── utils/                    # Utility functions
│   │   ├── jwt.js                # JWT helpers
│   │   ├── encryption.js         # Password hashing
│   │   ├── validators.js         # Input validation
│   │   ├── formatters.js         # Data formatting
│   │   ├── errorHandler.js       # Error utilities
│   │   ├── logger.js             # Logging utilities
│   │   └── helpers.js            # General helpers
│   │
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
│
├── .env.example
├── .env                          # Environment variables
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

---

## Core Implementation

### 1. Server Setup

**server.js**:
```javascript
const app = require('./app')
const connectDB = require('./config/database')

const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

**app.js**:
```javascript
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(morgan('dev'))

// Routes
app.use('/api', routes)

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }))

// Error handling
app.use(errorHandler)

module.exports = app
```

### 2. Database Connection

**config/database.js**:
```javascript
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB connected')
    
    // Create indexes
    require('../models').createIndexes()
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

module.exports = connectDB
```

### 3. Authentication

**authController.js**:
```javascript
const Customer = require('../models/Customer')
const { hashPassword, comparePassword } = require('../utils/encryption')
const { generateToken, generateRefreshToken } = require('../utils/jwt')
const emailService = require('../services/emailService')

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body
    
    // Validate
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      })
    }
    
    // Check if exists
    const existing = await Customer.findOne({ email })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      })
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create customer
    const customer = new Customer({
      name,
      email,
      phone,
      password: hashedPassword
    })
    
    await customer.save()
    
    // Send OTP email
    await emailService.sendOTP(email)
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Check email for OTP.',
      data: { customerId: customer._id, email }
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    
    // Verify OTP
    const isValid = await emailService.verifyOTP(email, otp)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      })
    }
    
    // Mark email as verified
    const customer = await Customer.findOneAndUpdate(
      { email },
      { emailVerified: true, emailVerifiedAt: new Date() },
      { new: true }
    )
    
    // Generate tokens
    const token = generateToken({ id: customer._id, role: 'customer' })
    const refreshToken = generateRefreshToken({ id: customer._id })
    
    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        refreshToken,
        user: {
          id: customer._id,
          email: customer.email,
          name: customer.name,
          role: 'customer'
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    // Find customer
    const customer = await Customer.findOne({ email })
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }
    
    // Check email verified
    if (!customer.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify email first'
      })
    }
    
    // Compare password
    const isValid = await comparePassword(password, customer.password)
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }
    
    // Generate tokens
    const token = generateToken({ id: customer._id, role: 'customer' })
    const refreshToken = generateRefreshToken({ id: customer._id })
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: {
          id: customer._id,
          email: customer.email,
          name: customer.name,
          role: 'customer'
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
```

### 4. Product Management

**productController.js**:
```javascript
const Product = require('../models/Product')
const ProductImage = require('../models/ProductImage')
const ProductVariant = require('../models/ProductVariant')

exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sort = 'newest'
    } = req.query
    
    // Build filter
    let filter = { status: 'active' }
    
    if (category) filter.categoryId = category
    if (brand) filter.brandId = brand
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    
    // Search
    if (search) {
      filter.$text = { $search: search }
    }
    
    // Sort
    let sortObj = { createdAt: -1 }
    if (sort === 'price_asc') sortObj = { price: 1 }
    if (sort === 'price_desc') sortObj = { price: -1 }
    if (sort === 'rating') sortObj = { averageRating: -1 }
    
    // Query
    const skip = (page - 1) * limit
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate('categoryId brandId')
    
    const total = await Product.countDocuments(filter)
    
    res.json({
      success: true,
      message: 'Products retrieved',
      data: {
        items: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    
    const product = await Product.findById(id)
      .populate('categoryId brandId')
      .lean()
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    
    // Get images
    const images = await ProductImage.find({ productId: id })
    
    // Get variants
    const variants = await ProductVariant.find({ productId: id })
    
    res.json({
      success: true,
      message: 'Product retrieved',
      data: {
        ...product,
        images,
        variants
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categoryId,
      brandId,
      price,
      discountPrice,
      stock,
      sku,
      material,
      weight,
      variants,
      images,
      tags
    } = req.body
    
    // Validate
    if (!name || !categoryId || !price || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }
    
    // Check SKU unique
    const existing = await Product.findOne({ sku })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'SKU already exists'
      })
    }
    
    // Create product
    const product = new Product({
      name,
      description,
      categoryId,
      brandId,
      price,
      discountPrice,
      stock,
      sku,
      material,
      weight,
      status: 'active'
    })
    
    await product.save()
    
    // Add variants
    if (variants && variants.length > 0) {
      await ProductVariant.insertMany(
        variants.map(v => ({ productId: product._id, ...v }))
      )
    }
    
    // Add images
    if (images && images.length > 0) {
      await ProductImage.insertMany(
        images.map((img, idx) => ({
          productId: product._id,
          url: img.url,
          isPrimary: idx === 0
        }))
      )
    }
    
    res.status(201).json({
      success: true,
      message: 'Product created',
      data: { productId: product._id }
    })
  } catch (error) {
    next(error)
  }
}
```

### 5. Order Management

**orderController.js**:
```javascript
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const Cart = require('../models/Cart')
const CartItem = require('../models/CartItem')
const Payment = require('../models/Payment')

exports.createOrder = async (req, res, next) => {
  try {
    const { customerId } = req.user
    const {
      shippingAddressId,
      billingAddressId,
      shippingMethodId,
      couponCode
    } = req.body
    
    // Get cart
    const cart = await Cart.findOne({ customerId })
      .populate('items')
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      })
    }
    
    // Calculate totals
    const subtotal = cart.subtotal
    const shippingCharge = 100  // Default, should come from shippingMethodId
    const couponDiscount = 0    // TODO: Apply coupon
    const total = subtotal + shippingCharge - couponDiscount
    
    // Create order
    const order = new Order({
      customerId,
      shippingAddressId,
      billingAddressId: billingAddressId || shippingAddressId,
      shippingMethodId,
      status: 'pending',
      subtotal,
      shippingCharge,
      couponDiscount,
      total,
      orderPlacedDate: new Date(),
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })
    
    await order.save()
    
    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      orderId: order._id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.price
    }))
    
    await OrderItem.insertMany(orderItems)
    
    // Clear cart
    await CartItem.deleteMany({ cartId: cart._id })
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderId,
        total,
        status: 'pending'
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const { customerId } = req.user
    
    const order = await Order.findById(id)
      .populate('shippingAddressId')
      .populate('items')
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    
    // Check authorization
    if (order.customerId.toString() !== customerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      })
    }
    
    res.json({
      success: true,
      message: 'Order retrieved',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

exports.confirmOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const { parcelId } = req.body
    
    if (!parcelId) {
      return res.status(400).json({
        success: false,
        message: 'Parcel ID required'
      })
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: 'confirmed',
        parcelId,
        confirmedDate: new Date()
      },
      { new: true }
    )
    
    res.json({
      success: true,
      message: 'Order confirmed',
      data: order
    })
  } catch (error) {
    next(error)
  }
}
```

### 6. Payment Processing

**paymentController.js**:
```javascript
const Payment = require('../models/Payment')
const Order = require('../models/Order')

exports.submitPayment = async (req, res, next) => {
  try {
    const { orderId, senderMobile, transactionId, screenshotUrl } = req.body
    
    if (!orderId || !senderMobile) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and sender mobile required'
      })
    }
    
    // Create payment record
    const payment = new Payment({
      orderId,
      method: 'bkash',
      senderMobile,
      transactionId: transactionId || null,
      screenshotUrl: screenshotUrl || null,
      status: 'pending',
      paymentId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })
    
    await payment.save()
    
    res.status(201).json({
      success: true,
      message: 'Payment submitted for verification',
      data: {
        paymentId: payment._id,
        status: 'pending'
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { verified } = req.body
    
    if (!verified) {
      // Reject payment
      await Payment.findByIdAndUpdate(id, { status: 'failed' })
      
      return res.json({
        success: true,
        message: 'Payment rejected'
      })
    }
    
    // Verify payment
    const payment = await Payment.findById(id)
    const order = await Order.findById(payment.orderId)
    
    // Update payment status
    payment.status = 'verified'
    payment.verifiedBy = req.user.id
    payment.verifiedAt = new Date()
    await payment.save()
    
    // Update order status (wait for parcelId in confirmOrder)
    // order.status = 'confirmed'
    // await order.save()
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { orderId: order._id, status: order.status }
    })
  } catch (error) {
    next(error)
  }
}
```

### 7. Middleware - Authentication

**middlewares/auth.js**:
```javascript
const jwt = require('jsonwebtoken')

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      })
    }
    next()
  }
}
```

### 8. Error Handling

**middlewares/errorHandler.js**:
```javascript
module.exports = (err, req, res, next) => {
  console.error(err)
  
  // Default error
  let status = err.status || 500
  let message = err.message || 'Internal server error'
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    status = 422
    message = Object.values(err.errors).map(e => e.message).join(', ')
  }
  
  // Mongoose cast error
  if (err.name === 'CastError') {
    status = 400
    message = 'Invalid ID format'
  }
  
  res.status(status).json({
    success: false,
    message,
    errors: err.errors || []
  })
}
```

### 9. Routes

**routes/index.js**:
```javascript
const express = require('express')
const authRoutes = require('./auth')
const productRoutes = require('./products')
const cartRoutes = require('./cart')
const orderRoutes = require('./orders')
const paymentRoutes = require('./payments')
const customerRoutes = require('./customers')
const adminRoutes = require('./admin')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/payments', paymentRoutes)
router.use('/customer', customerRoutes)
router.use('/admin', adminRoutes)

module.exports = router
```

---

## Services

### Email Service

**services/emailService.js**:
```javascript
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Store OTPs in memory (use Redis in production)
const otpStore = new Map()

exports.sendOTP = async (email) => {
  const otp = Math.random().toString().slice(2, 8)
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 })
  
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Email Verification OTP',
    html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
  })
}

exports.verifyOTP = (email, otp) => {
  const data = otpStore.get(email)
  if (!data) return false
  
  if (data.expiresAt < Date.now()) {
    otpStore.delete(email)
    return false
  }
  
  if (data.otp !== otp) return false
  
  otpStore.delete(email)
  return true
}
```

---

## Models

### Customer Model

**models/Customer.js**:
```javascript
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  emailVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date },
  totalOrders: { type: Number, default: 0 },
  totalSpending: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Indexes
customerSchema.index({ email: 1 })
customerSchema.index({ isActive: 1, createdAt: -1 })

module.exports = mongoose.model('Customer', customerSchema)
```

---

## Environment Variables

**.env**:
```
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:5173

# bKash
BKASH_NUMBER=01912345678

# Logging
LOG_LEVEL=debug
```

---

## Dependencies

**package.json**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "mongodb": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.0",
    "cloudinary": "^1.32.0",
    "multer": "^1.4.5",
    "joi": "^17.9.0",
    "express-rate-limit": "^6.7.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "eslint": "^8.38.0",
    "prettier": "^2.8.7",
    "jest": "^29.5.0",
    "supertest": "^6.3.3"
  }
}
```

---

## Next Steps

1. ✅ Backend architecture designed
2. ➜ Run `/setup-project` to initialize
3. ➜ Create models one by one
4. ➜ Implement controllers and routes
5. ➜ Test endpoints with `/api-test`
6. ➜ Deploy to Render
