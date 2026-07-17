# E-Commerce Platform — Project Structure

**Version**: 1.0  
**Status**: Build-Ready

---

## Repository Structure

```
clothing-ecommerce/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── api/                      # API client and axios setup
│   │   │   ├── client.js
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   └── customers.js
│   │   ├── assets/                   # Images, icons, fonts
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   ├── components/               # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── ...
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGallery.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   └── ...
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   └── ...
│   │   │   ├── order/
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   ├── OrderTimeline.jsx
│   │   │   │   └── ...
│   │   │   └── admin/
│   │   │       ├── DashboardCard.jsx
│   │   │       ├── OrderTable.jsx
│   │   │       ├── ProductForm.jsx
│   │   │       └── ...
│   │   ├── context/                  # React Context (if needed)
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useProduct.js
│   │   │   └── ...
│   │   ├── layouts/                  # Layout components
│   │   │   ├── CustomerLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ...
│   │   ├── pages/                    # Page components
│   │   │   ├── customer/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Shop.jsx
│   │   │   │   ├── ProductDetails.jsx
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── Payment.jsx
│   │   │   │   ├── OrderSuccess.jsx
│   │   │   │   ├── OrderTracking.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Wishlist.jsx
│   │   │   │   ├── NotFound.jsx
│   │   │   │   └── ...
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── VerifyEmail.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── static/
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   ├── FAQ.jsx
│   │   │   │   ├── PrivacyPolicy.jsx
│   │   │   │   ├── Terms.jsx
│   │   │   │   ├── ReturnPolicy.jsx
│   │   │   │   └── ShippingPolicy.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── OrderDetails.jsx
│   │   │   │   ├── Customers.jsx
│   │   │   │   ├── Managers.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── CMS.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── ...
│   │   ├── routes/                   # Route definitions
│   │   │   ├── customerRoutes.jsx
│   │   │   ├── adminRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── index.jsx
│   │   ├── services/                 # Business logic services
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   └── ...
│   │   ├── store/                    # Redux store
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── productSlice.js
│   │   │   │   ├── orderSlice.js
│   │   │   │   └── ...
│   │   │   ├── store.js
│   │   │   └── hooks.js
│   │   ├── styles/                   # Global styles
│   │   │   ├── globals.css
│   │   │   ├── tailwind.css
│   │   │   └── animations.css
│   │   ├── utils/                    # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── helpers.js
│   │   │   └── localStorage.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                       # Static assets
│   │   ├── favicon.ico
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── customerController.js
│   │   │   ├── adminController.js
│   │   │   └── analyticsController.js
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── Customer.js
│   │   │   ├── Address.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── Brand.js
│   │   │   ├── ProductImage.js
│   │   │   ├── ProductVariant.js
│   │   │   ├── ProductTag.js
│   │   │   ├── Tag.js
│   │   │   ├── Cart.js
│   │   │   ├── CartItem.js
│   │   │   ├── WishlistItem.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Payment.js
│   │   │   ├── ShippingMethod.js
│   │   │   ├── Coupon.js
│   │   │   ├── AdminUser.js
│   │   │   ├── Review.js
│   │   │   ├── Notification.js
│   │   │   ├── ActivityLog.js
│   │   │   ├── CMSContent.js
│   │   │   └── Setting.js
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   ├── customers.js
│   │   │   ├── admin.js
│   │   │   └── index.js
│   │   ├── middlewares/              # Express middlewares
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── roleAuth.js           # Role-based access
│   │   │   ├── errorHandler.js       # Global error handling
│   │   │   ├── validation.js         # Request validation
│   │   │   └── logger.js             # Request logging
│   │   ├── services/                 # Business logic
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   ├── paymentService.js
│   │   │   ├── emailService.js
│   │   │   ├── analyticsService.js
│   │   │   ├── s3Service.js          # Cloudinary integration
│   │   │   └── ...
│   │   ├── validations/              # Request validation schemas
│   │   │   ├── authValidation.js
│   │   │   ├── productValidation.js
│   │   │   ├── orderValidation.js
│   │   │   └── ...
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   ├── email.js
│   │   │   └── constants.js
│   │   ├── utils/                    # Utility functions
│   │   │   ├── jwt.js
│   │   │   ├── encryption.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── logger.js
│   │   ├── app.js                    # Express app setup
│   │   └── server.js                 # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── .eslintrc.json
│
├── .claude/
│   ├── specs/
│   │   ├── REQUIREMENTS.md           # Functional requirements
│   │   ├── DECISIONS.md              # Decision log
│   │   ├── API_SPECIFICATION.md      # API design
│   │   ├── DATABASE_SCHEMA.md        # Database design
│   │   ├── PROJECT_STRUCTURE.md      # This file
│   │   └── DEVELOPMENT_GUIDE.md      # Dev standards
│   ├── agents/
│   │   ├── documentation-reviewer.md # Reviews all docs
│   │   ├── feature-builder.md        # Builds features end-to-end
│   │   ├── code-reviewer.md          # Reviews code changes
│   │   └── api-tester.md             # Tests API endpoints
│   ├── skills/
│   │   ├── create-feature.md         # Create complete feature
│   │   ├── fix-bug.md                # Debug and fix issues
│   │   └── setup-project.md          # Initial project setup
│   ├── issues/
│   │   └── ISSUES.md                 # Known issues & conflicts
│   └── CLAUDE.md                     # Main project rules
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

---

## Frontend Technology Stack

### Core
- **React 18+**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library

### State Management
- **Redux Toolkit**: Global state
- **React Hooks**: Local state

### Routing
- **React Router 6**: SPA routing

### Forms
- **React Hook Form**: Form handling
- **Zod/Yup**: Schema validation

### HTTP
- **Axios**: HTTP client

### Animations
- **Framer Motion**: Component animations
- **GSAP**: Complex animations
- **React Three Fiber**: 3D experiences

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **React Testing Library**: Component testing

---

## Backend Technology Stack

### Core
- **Node.js 18+**: Runtime
- **Express.js**: Web framework

### Database
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB

### Authentication
- **JSON Web Tokens (JWT)**: API authentication
- **bcryptjs**: Password hashing

### Email/OTP
- **Nodemailer**: Email sending
- **OTP library**: OTP generation and verification

### File Storage
- **Cloudinary**: Cloud image storage
- **Multer**: File upload handling

### Validation
- **Joi**: Schema validation

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **Supertest**: API testing
- **Nodemon**: Development server

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ClothingStore
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
BKASH_NUMBER=01912345678
```

---

## Key Conventions

### Naming
- **Folders**: lowercase, kebab-case (e.g., `cart-items`)
- **Files**: PascalCase for components (e.g., `ProductCard.jsx`), camelCase for others
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Database IDs**: MongoDB ObjectId or custom prefixed strings (e.g., `ord_123`, `pay_456`)

### File Organization
- **1 component per file** (except related sub-components)
- **Logic separate from UI** (services, hooks, utils)
- **Index files** for cleaner imports
- **Related files grouped** in folders

### API Response Format
All endpoints return:
```json
{
  "success": boolean,
  "message": string,
  "data": object,
  "errors": array
}
```

### Error Handling
- **Try-catch** in async functions
- **Error middleware** in Express
- **User-friendly messages** in responses
- **Detailed logging** on server

### Database
- **Mongoose schemas** with validation
- **Indexes** on frequently queried fields
- **Relationships** via ObjectId references
- **Timestamps** (createdAt, updatedAt) on all documents

---

## Development Workflow

### 1. Feature Development
1. Read REQUIREMENTS.md for feature specification
2. Design database schema (if needed)
3. Design API endpoints (if needed)
4. Implement backend (models → routes → controllers → services)
5. Implement frontend (pages → components → services)
6. Test end-to-end
7. Code review
8. Deploy

### 2. Code Quality
- **Lint** before commit: `npm run lint`
- **Format** before commit: `npm run format`
- **Test** before PR: `npm run test`
- **No console errors/warnings**

### 3. Commit Messages
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## Deployment

### Frontend (Render)
1. Build: `npm run build`
2. Deploy static site to Render
3. Set environment variables
4. Monitor logs

### Backend (Render)
1. Deploy Node app to Render
2. Set environment variables
3. Connect MongoDB Atlas
4. Connect Cloudinary
5. Monitor health checks

### Database (MongoDB Atlas)
- Create cluster
- Set IP whitelist
- Create database user
- Get connection string

### Storage (Cloudinary)
- Create account
- Get API credentials
- Configure upload presets

---

## Performance Targets

- **Page Load**: < 3s (initial)
- **API Response**: < 500ms (median)
- **Search**: < 1s
- **Images**: Optimized, lazy-loaded
- **Bundle Size**: < 500KB (gzipped)
- **Lighthouse Score**: > 90

---

## Security Checklist

- ✓ HTTPS only in production
- ✓ JWT tokens in secure HTTP-only cookies
- ✓ CORS configured correctly
- ✓ Input validation on all endpoints
- ✓ Passwords hashed with bcrypt
- ✓ No secrets in code or logs
- ✓ Rate limiting on auth endpoints
- ✓ SQL/NoSQL injection protection
- ✓ XSS protection
- ✓ CSRF protection (if needed)

---

## Testing Strategy

### Unit Tests
- Services, utilities, helpers
- Target: 80%+ coverage

### Integration Tests
- API endpoints with database
- Authentication flows
- Order workflows

### E2E Tests
- Critical user flows
- Payment flow (with mock)
- Admin workflows

### Performance Tests
- Load testing
- Image optimization
- Search performance

---

## Monitoring & Logging

### Backend
- Request/response logging
- Error tracking (Sentry)
- Performance monitoring
- Database query logging

### Frontend
- Error tracking
- User analytics
- Performance monitoring
- Console error tracking

---

## Documentation Standards

Every file should have:
- File purpose comment
- Function/component documentation
- Inline comments for complex logic
- README in each major folder

---

## Next Steps

1. ✓ Review and approve REQUIREMENTS.md
2. ✓ Confirm DECISIONS.md
3. ✓ Setup development environment
4. ✓ Initialize Git repository
5. ✓ Setup CI/CD pipeline
6. ✓ Begin Phase 1 development (core modules)
