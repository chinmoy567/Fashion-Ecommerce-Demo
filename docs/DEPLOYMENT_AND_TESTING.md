# Deployment & Testing Guide

## Complete Testing Strategy

### Unit Testing

#### Backend Unit Tests

**authService.test.js**:
```javascript
const authService = require('../services/authService')
const Customer = require('../models/Customer')

jest.mock('../models/Customer')

describe('authService', () => {
  describe('register', () => {
    it('should hash password and create customer', async () => {
      const userData = {
        name: 'John',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'password123'
      }
      
      Customer.findOne.mockResolvedValue(null)
      Customer.prototype.save = jest.fn().mockResolvedValue({ _id: '123' })
      
      const result = await authService.register(userData)
      
      expect(result).toBeDefined()
      expect(result._id).toBe('123')
    })
    
    it('should throw error if email exists', async () => {
      Customer.findOne.mockResolvedValue({ email: 'john@example.com' })
      
      await expect(authService.register({
        email: 'john@example.com'
      })).rejects.toThrow('Email already exists')
    })
  })
})
```

#### Frontend Unit Tests

**useAuth.test.js**:
```javascript
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import useAuth from '../hooks/useAuth'
import authSlice from '../store/slices/authSlice'

describe('useAuth hook', () => {
  it('should login user', async () => {
    const store = configureStore({ reducer: { auth: authSlice.reducer } })
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    })
    
    await act(async () => {
      await result.current.login('user@example.com', 'password123')
    })
    
    expect(result.current.auth.isAuthenticated).toBe(true)
  })
})
```

### Integration Testing

#### API Integration Tests

**orders.integration.test.js**:
```javascript
const request = require('supertest')
const app = require('../app')
const Order = require('../models/Order')
const Customer = require('../models/Customer')

describe('Order API Integration', () => {
  let token
  let customerId
  
  beforeAll(async () => {
    // Create test customer
    const customer = await Customer.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '01712345678',
      password: 'hashed',
      emailVerified: true
    })
    customerId = customer._id
    
    // Generate token
    token = jwt.sign({ id: customerId, role: 'customer' }, process.env.JWT_SECRET)
  })
  
  afterAll(async () => {
    await Customer.deleteOne({ _id: customerId })
  })
  
  it('should create order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shippingAddressId: 'addr_123',
        shippingMethodId: 'ship_1'
      })
    
    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.orderId).toBeDefined()
  })
  
  it('should get orders for customer', async () => {
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data.items)).toBe(true)
  })
})
```

### End-to-End Testing

#### Playwright E2E Tests

**checkout.e2e.test.js**:
```javascript
const { test, expect } = require('@playwright/test')

test.describe('Checkout Flow', () => {
  test('complete purchase flow', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
    
    // 2. Browse products
    await page.goto('http://localhost:5173/shop')
    await page.click('text=Add to Cart')
    await expect(page.locator('text=Added to cart')).toBeVisible()
    
    // 3. Go to cart
    await page.click('[data-testid="cart-icon"]')
    await expect(page).toHaveURL('**/cart')
    
    // 4. Proceed to checkout
    await page.click('button:has-text("Checkout")')
    await expect(page).toHaveURL('**/checkout')
    
    // 5. Fill shipping address
    await page.fill('input[name="line1"]', '123 Main St')
    await page.fill('input[name="city"]', 'Dhaka')
    await page.selectOption('select[name="division"]', 'Dhaka')
    
    // 6. Select shipping method
    await page.click('text=Standard Shipping')
    
    // 7. Continue to payment
    await page.click('button:has-text("Continue to Payment")')
    await expect(page).toHaveURL('**/payment')
    
    // 8. Submit payment details
    await page.fill('input[name="senderMobile"]', '01712345678')
    await page.click('button:has-text("Submit Payment")')
    
    // 9. Verify success page
    await expect(page).toHaveURL('**/order-success')
    await expect(page.locator('text=Order placed successfully')).toBeVisible()
  })
})
```

---

## Deployment Strategy

### Phase 1: Development Setup

```bash
# Clone repository
git clone <repo-url>
cd clothing-ecommerce

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Setup environment variables
cd frontend && cp .env.example .env.local
cd ../backend && cp .env.example .env

# Start development servers
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Verify
# Frontend: http://localhost:5173
# Backend: http://localhost:5000/health
```

### Phase 2: Staging Deployment (Render)

**1. Frontend Deployment**:
```bash
# Build frontend
cd frontend
npm run build
# Creates dist/ folder

# Deploy to Render
# Go to render.com
# New > Static Site
# Connect GitHub repo
# Build command: cd frontend && npm run build
# Publish directory: frontend/dist
# Environment: VITE_API_URL=<staging-api-url>
```

**2. Backend Deployment**:
```bash
# Deploy to Render
# Go to render.com
# New > Web Service
# Connect GitHub repo
# Environment type: Node
# Build command: npm install
# Start command: npm start
# Environment variables:
#   NODE_ENV=staging
#   MONGODB_URI=<staging-db-url>
#   JWT_SECRET=<random-secret>
#   (all others from .env)
```

**3. Database Setup (MongoDB Atlas)**:
```bash
# Create MongoDB Atlas Cluster
1. Go to mongodb.com/cloud
2. Create account
3. Create cluster
4. Create database user
5. Add IP whitelist (0.0.0.0/0 for development, specific IPs for prod)
6. Get connection string
7. Update MONGODB_URI in backend .env
```

**4. Storage Setup (Cloudinary)**:
```bash
# Create Cloudinary Account
1. Go to cloudinary.com
2. Sign up
3. Get Cloud Name, API Key, API Secret
4. Update in backend .env
5. Test file upload
```

### Phase 3: Production Deployment

**DNS Configuration**:
```
Domain: example.com
Frontend: frontend.example.com → Render static site
Backend: api.example.com → Render web service
```

**SSL/HTTPS**:
- Render provides free SSL certificates
- Force HTTPS in production
- Set secure cookie flags

**Environment Variables (Production)**:
```
NODE_ENV=production
MONGODB_URI=<prod-db-connection>
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://example.com
LOG_LEVEL=warn
```

---

## Monitoring & Logging

### Application Monitoring

**Backend Logging**:
```javascript
// logger.js
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger
```

**Error Tracking (Sentry)**:
```javascript
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

### Performance Monitoring

**Frontend Monitoring**:
```javascript
// Monitor Core Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(metric => console.log('CLS:', metric))
getFID(metric => console.log('FID:', metric))
getLCP(metric => console.log('LCP:', metric))
```

### Uptime Monitoring

```bash
# Uptime checks (pingdom, statuspage.io, etc)
# Setup endpoints:
# - Frontend: https://example.com
# - Backend: https://api.example.com/health
# Alert on downtime
```

---

## Performance Optimization

### Frontend Optimization

**1. Bundle Analysis**:
```bash
npm run build
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer frontend/dist/assets/
```

**2. Image Optimization**:
```javascript
// Use Cloudinary for responsive images
<img
  src={`https://res.cloudinary.com/${cloudName}/image/fetch/w_500,q_auto/${imageUrl}`}
  srcSet={`
    https://res.cloudinary.com/${cloudName}/image/fetch/w_300,q_auto/${imageUrl} 300w,
    https://res.cloudinary.com/${cloudName}/image/fetch/w_500,q_auto/${imageUrl} 500w,
    https://res.cloudinary.com/${cloudName}/image/fetch/w_800,q_auto/${imageUrl} 800w
  `}
  sizes="(max-width: 600px) 300px, 500px"
  alt={alt}
/>
```

**3. Route-Based Code Splitting**:
```javascript
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const Admin = lazy(() => import('./pages/admin/Dashboard'))

// Reduces initial bundle by ~30%
```

### Backend Optimization

**1. Database Indexing**:
```javascript
// Create indexes for frequently queried fields
db.customers.createIndex({ email: 1 })
db.products.createIndex({ categoryId: 1 })
db.orders.createIndex({ customerId: 1, orderPlacedDate: -1 })
db.products.createIndex({ name: "text", description: "text" })
```

**2. Query Optimization**:
```javascript
// Lean queries (don't create Mongoose documents)
const products = await Product.find().lean()

// Select specific fields
const products = await Product.find().select('name price category')

// Pagination
const skip = (page - 1) * limit
const products = await Product.find().skip(skip).limit(limit)
```

**3. Caching**:
```javascript
// Cache frequently accessed data
const redis = require('redis')
const client = redis.createClient()

// Cache categories (rarely change)
const getCategories = async () => {
  const cached = await client.get('categories')
  if (cached) return JSON.parse(cached)
  
  const categories = await Category.find()
  await client.setex('categories', 3600, JSON.stringify(categories))
  return categories
}
```

---

## Security Hardening

### CORS Configuration
```javascript
const cors = require('cors')

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // Max 5 attempts
  message: 'Too many login attempts, try again later'
})

app.post('/auth/login', authLimiter, authController.login)
```

### HTTPS & Headers
```javascript
// Use helmet for security headers
const helmet = require('helmet')
app.use(helmet())

// In production, force HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next()
    }
  })
}
```

---

## Disaster Recovery

### Database Backup
```bash
# Automated MongoDB Atlas backups
# Settings > Backup > Enable automated backups

# Manual backup
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/dbname" --out ./backup

# Restore
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net/dbname" ./backup
```

### Deployment Rollback
```bash
# Git rollback
git revert <commit-hash>
git push

# Render rollback
# Go to Render dashboard > Deployments > Select previous > Redeploy
```

---

## CI/CD Pipeline

**.github/workflows/ci.yml**:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd frontend && npm install
        cd ../backend && npm install
    
    - name: Lint frontend
      run: cd frontend && npm run lint
    
    - name: Lint backend
      run: cd backend && npm run lint
    
    - name: Test frontend
      run: cd frontend && npm run test -- --coverage
    
    - name: Test backend
      run: cd backend && npm run test -- --coverage
    
    - name: Build frontend
      run: cd frontend && npm run build
    
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONARCLOUD_TOKEN: ${{ secrets.SONARCLOUD_TOKEN }}
  
  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Render (Staging)
      run: |
        curl -X POST "https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}"
  
  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Render (Production)
      run: |
        curl -X POST "https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID_PROD }}?key=${{ secrets.RENDER_API_KEY }}"
```

---

## Post-Deployment Checklist

- [ ] Frontend loads on custom domain
- [ ] Backend API responds on custom domain
- [ ] HTTPS working (green lock icon)
- [ ] Cookies set with secure flag
- [ ] All environment variables set
- [ ] Database connected and seeded
- [ ] Email service working (test OTP)
- [ ] Cloudinary working (test image upload)
- [ ] Monitoring/logging active
- [ ] Backups configured
- [ ] SSL certificate valid
- [ ] DNS records configured
- [ ] CDN configured (if using)
- [ ] Performance baseline established
- [ ] Security scanning enabled

---

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Development | 6 weeks | Build core features, test locally |
| Staging | 1 week | Deploy to staging, QA testing, security scan |
| Production | 1 week | Deploy to production, monitor, document |

**Total**: 8 weeks from start to production

---

## Support & Documentation

After deployment, provide:
- [ ] Admin user guide
- [ ] Customer FAQ
- [ ] API documentation
- [ ] Database schema documentation
- [ ] Deployment runbook
- [ ] Incident response playbook
- [ ] Monitoring dashboard access
- [ ] Backup restoration procedures
