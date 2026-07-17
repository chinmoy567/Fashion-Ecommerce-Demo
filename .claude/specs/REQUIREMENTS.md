# E-Commerce Platform — Requirements Specification

**Project**: Clothing E-Commerce Platform for Bangladesh Market  
**Version**: 1.0  
**Last Updated**: 2026-07-17  
**Status**: Build-Ready (after decisions in DECISIONS.md are confirmed)

---

## Executive Summary

A full-stack e-commerce platform with two primary interfaces:
- **Customer Storefront**: Browse, search, cart, wishlist, checkout, order tracking, profile management
- **Admin/Manager Back-office**: Catalogue, order management, customer analytics, CMS, staff management

**Distinctive Features**:
- Manual bKash "Send Money" payment (no API integration)
- Manual fulfilment workflow (managers enter Parcel ID)
- Email OTP verification
- Bangladesh-specific address model (Division/District/Upazila/Union/Postal Code)

---

## 1. Actors & Role-Based Access Control (RBAC)

### Three Roles

| Capability | Customer | Manager | Super Admin |
|---|:---:|:---:|:---:|
| Browse / cart / wishlist / checkout / track own orders | ✓ | — | — |
| Manage own profile | ✓ | ✓ | ✓ |
| Manage products (add / edit / delete / stock) | — | ✓ | ✓ |
| Manage orders (confirm / cancel / status / courier) | — | ✓ | ✓ |
| Manage inventory | — | ✓ | ✓ |
| View analytics | — | ✓ | ✓ |
| View customers | — | ✓ | ✓ |
| Website management / CMS | — | ⚠ partial* | ✓ |
| Add / edit / delete categories | — | ✗ | ✓ |
| Manage managers | — | — | ✓ |
| Store settings | — | — | ✓ |

\* Manager can edit Featured Products only (see DECISIONS.md)

---

## 2. Admin / Back-Office Modules

### Core Modules (Specified)

#### Dashboard
- **Cards**: Total Revenue, Today's Revenue, Monthly Revenue
- **Stats**: Total Orders, Pending Orders, Delivered Orders, Cancelled Orders, Total Customers, Total Products
- **Notifications**: New order notifications fire in real-time

#### Products
- **CRUD**: Add, Edit, Delete products
- **Fields**: 
  - Basic: Name, Description, Category, Brand, Price, Discount Price, Stock, SKU
  - Media: Images, Variants
  - Attributes: Sizes, Colors, Material, Weight, Tags, Status
  - Display: Is Featured

#### Categories
- **Admin-only CRUD**: Men, Women, Kids, Accessories (→ Cap → Mask), Shoes, Winter, Summer
- **Hierarchy**: Support parent/child relationships

#### Orders
- **Filtering**: Pending, Confirmed, Cancelled
- **Per Order**: Order ID, Customer ID, Product Details, Quantity, Price, Shipping Address, Parcel ID, Order Date
- **Workflow**: 
  - Manager enters Parcel ID **before** Confirm
  - Manager/Admin can mark Cancelled
  - OTP email verification required
  - Customer address + mobile shown to staff

#### Customers
- **View-only**: Name, Email, Phone, Address, Total Orders, Total Spending
- **Access**: Admin + Manager (read-only)

#### Managers (Super Admin Only)
- **CRUD**: Add, Edit, Remove managers
- **Setup**: Assign email + password
- **Actions**: Reset password
- **Panel Scope**: Dashboard, Products, Orders, Customers, Inventory, Analytics

#### Sales & Analytics
- **Metrics**: Revenue, Profit, Orders, Products Sold, Top Products, Top Categories, Customer Growth
- **Time Series**: Monthly, Weekly, Daily Sales
- **Charts**: Bar, Pie, Line charts

#### Website Management (CMS)
- **Content**:
  - Homepage Banner
  - Hero Slider
  - Featured Products (editable by managers)
  - Latest Collection
  - About Us
  - Contact Information
  - Social Media Links
  - Footer

#### Profile (Admin/Manager)
- **Personal Info**: Picture, Full Name
- **Contact**: Primary + Secondary Email, Mobile 1–3, Address with required Line 1 / City / Upazila / Division / Postal Code
- **Optional**: Line 2, Union
- **Account Settings**: Change password/email
- **Actions**: Logout, account management

### Undefined Modules (Scope TBD)

- **Inventory**: Distinct from product stock? Stock-in/out, low-stock alerts?
- **Coupons & Discounts**: Rules, types, validation?
- **Reviews**: Admin moderation flow?
- **Notifications**: Channels and triggers?
- **Activity Logs**: Contents and retention?
- **Reports**: Separate from Analytics?
- **Settings**: Store-level configuration list?

---

## 3. Customer Storefront Modules

### Primary Sections

#### Home
- Announcement Bar
- Navigation Bar
- Hero Banner
- Featured Categories
- New Arrivals
- Best Sellers
- Flash Sale
- Trending Products
- Featured Collection
- Why Choose Us
- Customer Reviews
- Instagram Gallery
- Newsletter Signup
- Footer

#### Shop
- **Filters**: Category, Brand, Price, Size, Color, Discount, Availability
- **Controls**: Sort, Grid/List toggle, Pagination
- **Search**: Full product search with suggestions and recent searches

#### Categories
⚠ **Differs from admin list** (see DECISIONS.md)
- Men, Women, Kids, Shoes, Accessories, Winter Collection, Summer Collection, Sale

#### Product Details
- **Media**: Gallery with zoom
- **Info**: Name, Brand, Price, Discount Price, Rating, Stock Status
- **Selection**: Size + Color picker, Quantity input
- **Actions**: Add to Cart, Buy Now, Wishlist, Share
- **Content**: Description, Specifications, Reviews, Related Products, Recently Viewed

#### Search
- Product search
- Auto-suggestions
- Recent search history
- Results display

#### Wishlist
- View saved items
- Move to cart
- Remove items
- Share wishlist

#### Cart
- **Items**: View all, manage quantity, remove
- **Coupon**: Apply coupon code
- **Totals**: Shipping charge, Order summary
- **Action**: Proceed to checkout

#### Checkout
- **Customer Info**: Verify/update personal details
- **Addresses**: 
  - Shipping Address (required)
  - Billing Address (optional)
- **Shipping**: Select shipping method
- **Payment**: Select payment method (bKash Send Money)
- **Review**: Order summary before submission
- **Action**: Place order

#### Payment (bKash Manual)
- **Display**: Store's bKash number + instructions
- **Input**: Sender mobile number (required)
- **Optional**: Transaction ID, Screenshot upload
- **Submit**: Payment details submission

#### Order Success
- Thank you message
- Order ID
- Payment status
- Estimated delivery date

#### Order Tracking
- Order status
- Parcel ID
- Courier information
- Timeline/progress visualization
- Delivery updates

#### My Orders
- **Filters**: Current, Completed, Cancelled
- **Per Order**: Order details, status, Download Invoice
- **Actions**: View details, track order, cancel (if applicable)

#### Customer Profile
- **Dashboard**: Overview
- **Personal Info**: Edit profile, picture, name
- **Address Book**: Save multiple addresses, set default
- **Wishlist**: View saved items
- **My Orders**: Order history
- **Payment History**: Past transactions
- **Notifications**: Alerts and messages
- **Account**: Change password/email, Logout

#### Authentication
- **Login**: Email/password
- **Register**: Create new account
- **Email Verification**: OTP verification (placement TBD in DECISIONS.md)
- **Password**: Forgot password, Reset password

#### Static Pages
- About Us
- Contact Us (with Google Map)
- FAQ
- Privacy Policy
- Terms & Conditions
- Return & Refund Policy
- Shipping Policy
- Footer

---

## 4. Data Entities & Relationships

### Core Entities

**CUSTOMER**
- customer_id (PK)
- name, email (OTP-verified), phone, password
- total_orders (derived), total_spending (derived)

**ADDRESS**
- address_id (PK)
- customer_id (FK)
- line1, line2 (optional), city, upazila, union, division, postal_code
- is_default

**PRODUCT**
- product_id (PK)
- category_id (FK), brand_id (FK)
- name, description, price, discount_price, stock, sku
- material, weight, status, is_featured

**PRODUCT_VARIANT**
- variant_id (PK)
- product_id (FK)
- size, color, stock (per variant)

**PRODUCT_IMAGE**
- image_id (PK)
- product_id (FK)
- url, is_primary

**CATEGORY**
- category_id (PK)
- name, parent_id (self-ref for hierarchy)

**BRAND**
- brand_id (PK)
- name

**TAG** / **PRODUCT_TAG**
- tag_id (PK), product_id (FK)
- name

**CART** / **CART_ITEM**
- cart_id (PK), customer_id (FK)
- cart_item_id (PK), cart_id (FK), product_id (FK), variant_id (FK), quantity

**WISHLIST_ITEM**
- wishlist_id (PK)
- customer_id (FK), product_id (FK)

**ORDER**
- order_id (PK)
- customer_id (FK), shipping_address_id (FK)
- status (Pending, Confirmed, Shipped, Delivered, Completed, Cancelled)
- parcel_id, courier, order_placed_date
- total, subtotal, shipping_charge

**ORDER_ITEM**
- order_item_id (PK)
- order_id (FK), product_id (FK), variant_id (FK)
- quantity, unit_price

**PAYMENT**
- payment_id (PK)
- order_id (FK)
- method ("bKash")
- sender_mobile, transaction_id (optional), screenshot_url (optional)
- status

**SHIPPING_METHOD**
- method_id (PK)
- name, charge

**COUPON** (TBD)
- coupon_id (PK)
- code, discount, rules (TBD)

**ADMIN_USER**
- user_id (PK)
- role (super_admin | manager)
- email, password (hashed)
- full_name, profile_pic, contact, address

**REVIEW** (TBD)
- review_id (PK)
- customer_id (FK), product_id (FK)
- rating, comment, status (pending moderation)

**NOTIFICATION** (TBD)
- notification_id (PK)
- recipient (admin/customer)
- type, message, is_read

**ACTIVITY_LOG** (TBD)
- log_id (PK)
- user_id (FK), action, timestamp

---

## 5. Order Lifecycle (State Machine)

### Explicit States (Specified)
- **Pending**: Order placed, payment awaiting verification
- **Confirmed**: Payment verified, Parcel ID assigned
- **Cancelled**: Order cancelled by manager/admin or customer

### Implied States (Inferred)
- **Shipped**: Courier assigned, parcel in transit
- **Delivered**: Parcel delivered to customer
- **Completed**: Order fulfilled and closed

**State Transitions**:
```
[Start] → Pending → Confirmed → Shipped → Delivered → Completed
              ↓          ↓
           Cancelled  Cancelled
```

---

## 6. Customer Purchase Flow

1. **Browse**: Home → Shop → Product Details
2. **Add to Cart or Wishlist**: Product Details → Cart or Wishlist
3. **Review**: Cart (view items, apply coupon, update quantities)
4. **Checkout**: Enter/confirm customer info, shipping address, billing address (optional)
5. **Email Verification**: ⚠ **Placement TBD** (see DECISIONS.md)
   - Option A: At registration (before purchase)
   - Option B: At checkout (before payment)
   - Option C: Both
6. **Payment**: 
   - Display store's bKash number
   - Customer sends money manually
   - Customer enters sender mobile (required), transaction ID (optional), screenshot (optional)
7. **Submit**: Order created in Pending status
8. **Success**: Order confirmation page with Order ID and estimated delivery
9. **Tracking**: Customer can track via My Orders → Order Tracking
10. **Fulfillment** (Admin):
    - Manager verifies payment
    - Manager enters Parcel ID
    - Manager confirms order → Status = Confirmed
    - Courier assigned → Status = Shipped
    - Customer sees updates in tracking

---

## 7. Payment & Fulfilment Model

### Customer Side
1. Initiates purchase, proceeds to checkout
2. Selects bKash payment method
3. Shown store's bKash mobile number
4. Manually transfers money using bKash "Send Money" feature
5. Submits payment details:
   - **Required**: Sender mobile number
   - **Optional**: Transaction ID, Screenshot of receipt
6. Order created in **Pending** status
7. Dashboard notification fires for admin/manager

### Manager Side
1. Receives new order notification
2. Verifies payment:
   - Checks bKash mobile inbox (manually)
   - May use Transaction ID / Screenshot as proof
3. Enters **Parcel ID** (manually assigned by store)
4. Clicks **Confirm**
5. Order moves to **Confirmed** status
6. Optionally assigns courier
7. Order moves to **Shipped** status
8. Customer tracks via Parcel ID

### ⚠ Verification Weakness
**Issue**: Transaction ID and screenshot are optional. Pending orders may have **no verifiable proof of payment**.

**Must Decide** (see DECISIONS.md):
- Require at least one proof (txn ID or screenshot)?
- Or accept this trade-off and justify in thesis defense?

---

## 8. Non-Functional Requirements

### Performance
- Page load time < 3 seconds
- Search results < 1 second
- API response time < 500ms
- Support 1000+ concurrent users

### Security
- Passwords hashed with bcrypt
- JWT authentication for admin/manager
- All user input validated and sanitized
- HTTPS required
- Sensitive data never logged
- CSRF protection
- Rate limiting on payment endpoints

### Scalability
- Horizontal scaling for backend
- Database indexing for high-traffic queries
- CDN for static assets
- Lazy loading for product images

### Availability
- 99.5% uptime target
- Graceful error handling
- User-friendly error messages

### Accessibility
- WCAG 2.1 AA compliance (storefront)
- Responsive design: Mobile, Tablet, Desktop, Large Desktop
- Keyboard navigation
- Screen reader support

### Reliability
- Data backup strategy (daily)
- Error logging and monitoring
- Graceful degradation on service failures

---

## 9. Technology Stack

**Frontend**:
- React, Vite, Tailwind CSS, shadcn/ui
- Redux Toolkit (global state)
- React Router (routing)
- React Hook Form (forms)
- Axios (HTTP client)
- Framer Motion (animations)
- GSAP (complex animations)
- React Three Fiber (3D experiences)

**Backend**:
- Node.js, Express.js
- MongoDB, Mongoose ODM
- JWT, Bcrypt (authentication/security)
- Nodemailer (email/OTP)
- Cloudinary (image storage)
- Multer (file uploads)

**Deployment**:
- Frontend: Render
- Backend: Render
- Database: MongoDB Atlas
- Storage: Cloudinary

---

## 10. API Design Principles

### RESTful Endpoints
- Use proper HTTP methods: GET, POST, PUT, PATCH, DELETE
- Meaningful endpoint names
- Consistent response format

### Response Format
**Success**:
```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {}
}
```

**Error**:
```json
{
  "success": false,
  "message": "Something went wrong.",
  "errors": []
}
```

### Validation
- All request data validated
- Appropriate HTTP status codes
- Clear error messages

---

## 11. Coding Standards

### General
- Clean, readable, maintainable code
- DRY principle (Don't Repeat Yourself)
- Small, focused functions and components
- Composition over inheritance
- Single Responsibility Principle
- Meaningful names for all identifiers
- Validate all user input
- Handle errors gracefully
- No hardcoded configuration or secrets

### Comments
- Add short descriptive comment for every function/controller
- One-line comments maximum (where needed)
- Update comments when code changes
- No unnecessary comments

### Components
- Single responsibility per component
- Small, reusable components
- Split large components
- Extract reusable logic to custom hooks
- Keep business logic separate from UI

### State Management
- Redux Toolkit for global state
- React Hooks for local UI state
- No state duplication
- Keep state close to usage

### Styling
- Tailwind CSS only
- No inline CSS or other frameworks
- Mobile-first approach
- Responsive design
- Consistent spacing, typography, colors
- Reusable, maintainable styles

### Environment Variables
- Store all secrets in `.env`
- Never hardcode secrets
- Never commit `.env` to Git
- Keep `.env.example` updated
- Validate required variables on startup

---

## 12. Definition of Done

A task is complete only if ALL of the following are true:

- ✓ Requirements fully implemented
- ✓ Feature works as expected
- ✓ No lint errors
- ✓ No console errors/warnings
- ✓ API endpoints work correctly
- ✓ Validation and error handling implemented
- ✓ Responsive: Mobile, Tablet, Desktop, Large Desktop
- ✓ Accessible (where applicable)
- ✓ Performance not negatively impacted
- ✓ Code follows architecture and standards
- ✓ Code is clean, reusable, well-commented
- ✓ No unrelated files modified
- ✓ Ready to commit
- ✓ No unresolved TODOs or placeholder code

---

## 13. Approval Gates

Implementation requires approval if:
- Requirements are missing or ambiguous
- Requirements conflict with spec
- Major architectural change required
- Breaking change required
- New dependency/technology introduced

Otherwise, proceed per specification.
