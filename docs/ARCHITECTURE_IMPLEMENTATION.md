# Architecture Implementation Guide

## Complete System Architecture

This document outlines the complete implementation of the Clothing E-Commerce Platform.

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT TIER                              │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Customer SPA   │  Admin Panel     │  Mobile Web             │
│  (React/Vite)   │  (React/Vite)    │  (Responsive)           │
└────────┬────────┴────────┬─────────┴──────────┬──────────────┘
         │                 │                    │
         └─────────────────┼────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │   API Gateway / Routing    │
            │  (Express.js Router)       │
            └──────────────┬──────────────┘
         ┌──────────────────┼──────────────────────┐
         │                  │                      │
    ┌────▼────┐        ┌────▼────┐          ┌─────▼─────┐
    │ Auth    │        │ Product │          │ Order     │
    │ Service │        │ Service │          │ Service   │
    └────┬────┘        └────┬────┘          └─────┬─────┘
         │                  │                      │
         └──────────────────┼──────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │    MongoDB Database         │
            │  (20 Collections)           │
            └──────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────┐
         │                 │                  │
    ┌────▼────┐       ┌────▼────┐      ┌─────▼─────┐
    │ Email   │       │ File    │      │ Payment   │
    │ Service │       │ Storage │      │ Processor │
    │         │       │(Cloud   │      │(Manual)   │
    │(OTP)    │       │inary)   │      │           │
    └─────────┘       └─────────┘      └───────────┘
```

### Layered Architecture

#### 1. Presentation Layer (Frontend)
- **React Components**: Reusable UI components
- **Pages**: Page-level components (Home, Shop, Profile, etc.)
- **Forms**: Form handling with React Hook Form
- **State Management**: Redux Toolkit for global state
- **API Client**: Axios-based API communication

#### 2. API Layer (Backend)
- **Routes**: Express route handlers
- **Controllers**: Request handlers, validation, response formatting
- **Middleware**: Authentication, authorization, error handling
- **Validation**: Request schema validation

#### 3. Business Logic Layer
- **Services**: Core business logic isolated from HTTP
- **Models**: Mongoose schemas with validation
- **Utilities**: Helper functions and utilities

#### 4. Data Layer
- **MongoDB**: Primary database (20 collections)
- **Mongoose ODM**: Schema definition and relationships
- **Indexes**: Performance optimization

#### 5. External Services
- **Email (Nodemailer)**: OTP verification, notifications
- **Storage (Cloudinary)**: Image and file storage
- **Payment**: Manual bKash verification

---

## Implementation Approach

### Specification-Driven Development (SDD)

Every feature follows this workflow:

1. **Requirements** → Review specification
2. **Design** → Architecture & data model design
3. **Approval** → Get approval before coding
4. **Database** → Create Mongoose schemas
5. **API** → Implement backend endpoints
6. **Frontend** → Implement UI components
7. **Integration** → Connect frontend to API
8. **Testing** → Unit, integration, E2E tests
9. **Review** → Code review before merge
10. **Deploy** → Commit to main and deploy

### Code Organization Principles

- **Single Responsibility**: Each file does one thing well
- **Separation of Concerns**: Business logic separate from HTTP/UI
- **DRY (Don't Repeat Yourself)**: Extract reusable code
- **SOLID Principles**: Clean, maintainable architecture
- **Composition over Inheritance**: Prefer composition patterns

---

## Development Phases

### Phase 1: Core Features (Weeks 1-6)

**Core Feature Set** (defensible for thesis):

1. **Authentication** (Week 1)
   - Register with email verification
   - Login/logout
   - Forgot password/reset
   - OTP verification
   - JWT token management

2. **Product Catalog** (Week 2)
   - Browse products with pagination
   - Search products
   - Product filters (category, brand, price, size, color)
   - Product details page
   - Product images and variants

3. **Shopping Cart** (Week 2-3)
   - Add/remove items
   - Update quantities
   - Cart persistence
   - Shipping charge calculation

4. **Wishlist** (Week 3)
   - Add/remove from wishlist
   - View wishlist
   - Move wishlist to cart

5. **Checkout** (Week 3-4)
   - Address management (save multiple)
   - Shipping method selection
   - Order review
   - Place order

6. **Payment** (Week 4)
   - Manual bKash payment submission
   - Transaction ID and screenshot (optional)
   - Payment status tracking

7. **Order Management** (Week 4-5)
   - Order history
   - Order details
   - Order tracking with Parcel ID
   - Order status updates
   - Download invoice

8. **Admin Dashboard** (Week 5)
   - Revenue metrics (total, today, monthly)
   - Order metrics (total, pending, delivered, cancelled)
   - Customer metrics
   - Product metrics
   - Recent orders notifications

9. **Admin Order Management** (Week 5)
   - View all orders with filters
   - Confirm order (verify payment, enter Parcel ID)
   - Cancel order
   - Update order status
   - View order details

10. **RBAC** (Throughout)
    - Customer role: Browse, cart, orders, profile
    - Manager role: Products, orders, customers, analytics
    - Super Admin role: Everything

11. **Basic Analytics** (Week 6)
    - Revenue over time
    - Orders over time
    - Top products
    - Top categories

**Phase 1 Deliverables**:
- ✅ Fully functional platform
- ✅ 50+ API endpoints tested
- ✅ Clean codebase
- ✅ Comprehensive tests
- ✅ Production-ready for staging

### Phase 2: Extended Features (Weeks 7-9)

(If time allows - labeled as "future work" in thesis)

- Coupon system with rules engine
- Inventory management (stock in/out)
- Product reviews with moderation
- Notification system
- Activity logging
- Website CMS
- Advanced analytics

### Phase 3: Polish & Deployment (Weeks 10-12)

- Performance optimization
- Security hardening
- Load testing
- Final documentation
- Production deployment

---

## Technology Decisions

### Frontend Stack
- **React 18+**: Modern component model
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library built on Radix UI
- **Redux Toolkit**: State management with immutability
- **React Router**: Client-side routing
- **React Hook Form**: Form handling without bloat
- **Axios**: HTTP client for API calls
- **Framer Motion**: Smooth UI animations
- **GSAP**: Complex animation library (when needed)

### Backend Stack
- **Node.js 18+**: JavaScript runtime
- **Express.js**: Minimal web framework
- **MongoDB**: NoSQL database (flexible schema)
- **Mongoose**: ODM with validation
- **JWT**: Stateless authentication
- **bcryptjs**: Password hashing
- **Nodemailer**: Email sending
- **Cloudinary**: Cloud image storage

### Deployment
- **Render**: Backend and frontend hosting
- **MongoDB Atlas**: Managed database
- **Cloudinary**: Cloud storage

---

## Database Architecture

### 20 Collections

**Core Collections**:
1. customers - User accounts
2. addresses - Shipping addresses
3. products - Product catalog
4. product_variants - Size/color variants
5. product_images - Product photos
6. categories - Product categories
7. brands - Brand information
8. tags - Product tags
9. product_tags - Product-tag mappings

**Shopping Collections**:
10. carts - Shopping carts
11. cart_items - Items in carts
12. wishlist_items - Saved for later

**Order Collections**:
13. orders - Customer orders
14. order_items - Items in orders
15. payments - Payment records
16. shipping_methods - Delivery options

**Admin Collections**:
17. admin_users - Manager and admin accounts
18. activity_logs - Audit trail

**Future Collections**:
19. coupons - Discount codes
20. reviews - Product reviews

### Indexing Strategy

**High-Priority Indexes** (create immediately):
```javascript
// customers
db.customers.createIndex({ email: 1 }, { unique: true })

// products
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ status: 1 })

// orders
db.orders.createIndex({ orderId: 1 }, { unique: true })
db.orders.createIndex({ customerId: 1, orderPlacedDate: -1 })
db.orders.createIndex({ status: 1, orderPlacedDate: -1 })

// Full-text search
db.products.createIndex({ name: "text", description: "text" })
```

---

## API Design

### 50+ Endpoints

**Authentication (6)**:
- POST /auth/register
- POST /auth/verify-email
- POST /auth/login
- POST /auth/refresh-token
- POST /auth/logout
- POST /auth/forgot-password

**Products (6)**:
- GET /products (with filters/pagination)
- GET /products/:id
- POST /products (admin)
- PUT /products/:id (admin)
- DELETE /products/:id (admin)

**Categories (3)**:
- GET /categories
- POST /categories (admin)
- PUT /categories/:id (admin)

**Cart (5)**:
- GET /cart
- POST /cart/items
- PUT /cart/items/:cartItemId
- DELETE /cart/items/:cartItemId
- POST /cart/apply-coupon

**Orders (5)**:
- POST /orders
- GET /orders
- GET /orders/:orderId
- GET /admin/orders
- PUT /admin/orders/:orderId/confirm

**Payments (2)**:
- POST /payments
- POST /payments/:paymentId/verify (admin)

**Customers (6)**:
- GET /customer/profile
- PUT /customer/profile
- GET /customer/addresses
- POST /customer/addresses
- PUT /customer/addresses/:addressId
- DELETE /customer/addresses/:addressId

**Admin (11+)**:
- GET /admin/dashboard
- GET /admin/customers
- GET /admin/analytics
- POST /admin/managers (super admin)
- PUT /admin/managers/:managerId (super admin)
- GET /admin/settings (super admin)
- PUT /admin/settings (super admin)
- (and more...)

### Response Format

All endpoints return consistent format:

```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {},
  "errors": []
}
```

---

## Security Architecture

### Authentication & Authorization

1. **Register & Email OTP**
   - Customer creates account
   - System sends OTP to email
   - Customer verifies OTP
   - Account activated

2. **Login**
   - Validate credentials
   - Issue JWT token (15 min expiry)
   - Issue refresh token (7 day expiry)
   - Return both tokens

3. **API Protection**
   - All protected routes check JWT
   - JWT verified and decoded
   - User ID extracted from token
   - Permission checked based on role

4. **Role-Based Access**
   - Customer: Browse, cart, orders, profile
   - Manager: Products, orders, customers, analytics
   - Super Admin: Full system access

### Security Best Practices

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ No passwords stored in logs
- ✅ Sensitive data masked in responses
- ✅ Input validation on all endpoints
- ✅ XSS protection (sanitize outputs)
- ✅ SQL/NoSQL injection prevention
- ✅ HTTPS enforced in production
- ✅ CORS configured for frontend origin only
- ✅ Rate limiting on auth endpoints
- ✅ JWT secrets in environment variables

---

## Performance Architecture

### Frontend Optimization

1. **Code Splitting**
   - Route-based splitting (lazy load routes)
   - Component-based splitting (lazy load heavy components)
   - Vendor bundle optimization

2. **Image Optimization**
   - Cloudinary auto-compression
   - Multiple sizes for responsive images
   - Lazy loading with Intersection Observer

3. **State Management**
   - Redux for global state
   - Local state for UI-only state
   - Memoization to prevent unnecessary re-renders

4. **Bundle Size**
   - Target: < 500KB gzipped
   - Remove unused dependencies
   - Tree-shake unused code

### Backend Optimization

1. **Database Queries**
   - Indexes on frequently queried fields
   - Lean queries (select specific fields)
   - Pagination for large result sets
   - Connection pooling

2. **Caching**
   - Cache product catalog
   - Cache category list
   - Redis for session storage (optional)

3. **API Response**
   - Target: < 500ms response time
   - Compress responses (gzip)
   - Pagination limits

---

## Deployment Architecture

### Environment Configuration

```
Development
  └─ localhost:3000 (frontend) + localhost:5000 (backend)
     MongoDB local or Atlas dev
     Cloudinary dev account

Staging
  └─ staging.example.com
     Render staging dynos
     MongoDB Atlas staging cluster
     Cloudinary production account

Production
  └─ example.com
     Render production dynos
     MongoDB Atlas production cluster
     Cloudinary production account
```

### CI/CD Pipeline

**GitHub Actions**:
1. On PR:
   - Lint code
   - Run tests
   - Build frontend
   - Deploy to staging (if approved)

2. On push to main:
   - Run all tests
   - Build production bundle
   - Deploy to production
   - Run smoke tests

---

## Monitoring & Logging

### Frontend Monitoring
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- User analytics (Google Analytics)
- Console error tracking

### Backend Logging
- Request/response logging
- Error logging with stack traces
- Database query logging (development only)
- Performance metrics

### Database Monitoring
- Connection pool monitoring
- Query performance monitoring
- Disk usage monitoring

---

## Quality Standards

### Code Quality
- ESLint: No errors or warnings
- Prettier: Automatic formatting
- TypeScript: Type safety (future consideration)
- Comments: On complex logic only

### Test Coverage
- Unit tests: 80%+ coverage
- Integration tests: All API endpoints
- E2E tests: Critical user flows
- Performance tests: Load testing

### Definition of Done

Every feature must meet:
- ✓ Specification fully implemented
- ✓ Works end-to-end
- ✓ No lint errors
- ✓ No console errors
- ✓ Tests passing (80%+ coverage)
- ✓ API endpoints tested
- ✓ Responsive design
- ✓ Accessible (WCAG 2.1 AA)
- ✓ Performance acceptable
- ✓ Code follows standards
- ✓ Code reviewed
- ✓ Ready to merge

---

## Next Steps

1. ✅ Specifications complete
2. ✅ Architecture designed
3. ➜ Confirm critical decisions (DECISIONS.md)
4. ➜ Initialize project (`/setup-project`)
5. ➜ Build features (`/create-feature`)
6. ➜ Test and review (`/code-review`, `/api-test`)
7. ➜ Deploy to production

**Timeline**: 8-12 weeks for complete platform
