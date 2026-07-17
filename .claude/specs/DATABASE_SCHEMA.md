# E-Commerce Platform — Database Schema

**Database**: MongoDB  
**Version**: 1.0  
**Last Updated**: 2026-07-17

---

## Collections Overview

```
├── customers
├── addresses
├── products
├── categories
├── brands
├── product_images
├── product_variants
├── product_tags
├── tags
├── carts
├── cart_items
├── wishlist_items
├── orders
├── order_items
├── payments
├── shipping_methods
├── coupons
├── admin_users
├── reviews
├── notifications
├── activity_logs
├── cms_content
└── settings
```

---

## Collection Schemas

### customers

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  password: String (required, hashed),
  profilePic: String (optional),
  emailVerified: Boolean (default: false),
  emailVerifiedAt: Date (optional),
  createdAt: Date,
  updatedAt: Date,
  
  // Derived fields (calculated)
  totalOrders: Number,
  totalSpending: Number,
  
  // Metadata
  isActive: Boolean (default: true),
  lastLogin: Date (optional),
  preferences: {
    newsletter: Boolean,
    notifications: Boolean
  }
}
```

**Indexes**:
- `{ email: 1 }` (unique)
- `{ createdAt: 1 }`
- `{ isActive: 1, createdAt: -1 }`

---

### addresses

```javascript
{
  _id: ObjectId,
  customerId: ObjectId (required, ref: customers),
  line1: String (required),
  line2: String (optional),
  city: String (required),
  upazila: String (required),
  union: String (optional),
  division: String (required),
  postalCode: String (required),
  phone: String (optional),
  isDefault: Boolean (default: false),
  label: String (optional, e.g., "Home", "Office"),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ customerId: 1 }`
- `{ customerId: 1, isDefault: 1 }`

---

### products

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (optional),
  categoryId: ObjectId (required, ref: categories),
  brandId: ObjectId (required, ref: brands),
  price: Number (required, min: 0),
  discountPrice: Number (optional, min: 0),
  stock: Number (required, min: 0),
  sku: String (required, unique),
  material: String (optional),
  weight: Number (optional, in grams),
  status: String (enum: ["active", "inactive", "discontinued"], default: "active"),
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date,
  
  // Metadata
  viewCount: Number (default: 0),
  averageRating: Number (default: 0),
  reviewCount: Number (default: 0),
  saleCount: Number (default: 0)
}
```

**Indexes**:
- `{ sku: 1 }` (unique)
- `{ categoryId: 1 }`
- `{ brandId: 1 }`
- `{ status: 1 }`
- `{ isFeatured: 1, createdAt: -1 }`
- `{ name: "text", description: "text" }` (full-text search)

---

### product_variants

```javascript
{
  _id: ObjectId,
  productId: ObjectId (required, ref: products),
  size: String (optional),
  color: String (optional),
  stock: Number (required, min: 0),
  sku: String (optional, unique),
  price: Number (optional, if different from product),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ productId: 1 }`
- `{ productId: 1, size: 1, color: 1 }` (unique compound)

---

### product_images

```javascript
{
  _id: ObjectId,
  productId: ObjectId (required, ref: products),
  url: String (required),
  altText: String (optional),
  isPrimary: Boolean (default: false),
  sortOrder: Number (default: 0),
  createdAt: Date
}
```

**Indexes**:
- `{ productId: 1, sortOrder: 1 }`

---

### categories

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique),
  description: String (optional),
  parentId: ObjectId (optional, ref: categories, self-referential),
  image: String (optional),
  isActive: Boolean (default: true),
  sortOrder: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ slug: 1 }` (unique)
- `{ parentId: 1 }`
- `{ isActive: 1, sortOrder: 1 }`

---

### brands

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique),
  logo: String (optional),
  description: String (optional),
  website: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ slug: 1 }` (unique)
- `{ isActive: 1 }`

---

### tags

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique),
  description: String (optional),
  createdAt: Date
}
```

**Indexes**:
- `{ slug: 1 }` (unique)

---

### product_tags

```javascript
{
  _id: ObjectId,
  productId: ObjectId (required, ref: products),
  tagId: ObjectId (required, ref: tags),
  createdAt: Date
}
```

**Indexes**:
- `{ productId: 1 }`
- `{ tagId: 1 }`
- `{ productId: 1, tagId: 1 }` (unique compound)

---

### carts

```javascript
{
  _id: ObjectId,
  customerId: ObjectId (required, ref: customers, unique),
  couponId: ObjectId (optional, ref: coupons),
  subtotal: Number (default: 0),
  shippingCharge: Number (default: 0),
  couponDiscount: Number (default: 0),
  total: Number (default: 0),
  lastUpdated: Date,
  createdAt: Date
}
```

**Indexes**:
- `{ customerId: 1 }` (unique)

---

### cart_items

```javascript
{
  _id: ObjectId,
  cartId: ObjectId (required, ref: carts),
  productId: ObjectId (required, ref: products),
  variantId: ObjectId (optional, ref: product_variants),
  quantity: Number (required, min: 1),
  price: Number (required, at time of addition),
  addedAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ cartId: 1 }`
- `{ cartId: 1, productId: 1 }` (unique compound)

---

### wishlist_items

```javascript
{
  _id: ObjectId,
  customerId: ObjectId (required, ref: customers),
  productId: ObjectId (required, ref: products),
  addedAt: Date
}
```

**Indexes**:
- `{ customerId: 1 }`
- `{ customerId: 1, productId: 1 }` (unique compound)

---

### orders

```javascript
{
  _id: ObjectId,
  orderId: String (required, unique, format: ORD-TIMESTAMP-RANDOM),
  customerId: ObjectId (required, ref: customers),
  shippingAddressId: ObjectId (required, snapshot of address),
  billingAddressId: ObjectId (optional),
  couponId: ObjectId (optional, ref: coupons),
  shippingMethodId: ObjectId (required, ref: shipping_methods),
  status: String (enum: ["pending", "confirmed", "shipped", "delivered", "completed", "cancelled"], default: "pending"),
  parcelId: String (optional, entered by manager),
  courier: String (optional),
  
  // Pricing
  subtotal: Number (required),
  shippingCharge: Number (required),
  couponDiscount: Number (optional),
  total: Number (required),
  
  // Dates
  orderPlacedDate: Date (required),
  confirmedDate: Date (optional),
  shippedDate: Date (optional),
  deliveredDate: Date (optional),
  completedDate: Date (optional),
  cancelledDate: Date (optional),
  
  estimatedDelivery: Date (optional),
  
  // Customer info snapshot
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  
  // Metadata
  notes: String (optional),
  cancellationReason: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ orderId: 1 }` (unique)
- `{ customerId: 1, orderPlacedDate: -1 }`
- `{ status: 1, orderPlacedDate: -1 }`
- `{ parcelId: 1 }` (sparse, only if parcelId exists)

---

### order_items

```javascript
{
  _id: ObjectId,
  orderId: ObjectId (required, ref: orders),
  productId: ObjectId (required, ref: products),
  variantId: ObjectId (optional, ref: product_variants),
  quantity: Number (required, min: 1),
  unitPrice: Number (required, at time of order),
  productName: String (snapshot),
  createdAt: Date
}
```

**Indexes**:
- `{ orderId: 1 }`

---

### payments

```javascript
{
  _id: ObjectId,
  paymentId: String (required, unique, format: PAY-TIMESTAMP-RANDOM),
  orderId: ObjectId (required, ref: orders, unique),
  method: String (enum: ["bkash"], default: "bkash"),
  senderMobile: String (required),
  transactionId: String (optional),
  screenshotUrl: String (optional),
  verifiedBy: ObjectId (optional, ref: admin_users),
  verifiedAt: Date (optional),
  status: String (enum: ["pending", "verified", "failed"], default: "pending"),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ paymentId: 1 }` (unique)
- `{ orderId: 1 }` (unique)
- `{ status: 1, createdAt: -1 }`

---

### shipping_methods

```javascript
{
  _id: ObjectId,
  name: String (required, e.g., "Standard Shipping", "Express"),
  charge: Number (required, min: 0),
  estimatedDays: Number (optional),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ isActive: 1 }`

---

### coupons (TBD - Phase 2)

```javascript
{
  _id: ObjectId,
  code: String (required, unique, uppercase),
  discountType: String (enum: ["percentage", "fixed", "freeShipping"], required),
  discountValue: Number (required, min: 0),
  minPurchaseAmount: Number (optional),
  maxUsageCount: Number (optional),
  usageCount: Number (default: 0),
  usagePerCustomer: Number (default: 1),
  validFrom: Date (required),
  validUntil: Date (required),
  isActive: Boolean (default: true),
  applicableCategories: [ObjectId] (optional, ref: categories),
  applicableProducts: [ObjectId] (optional, ref: products),
  createdBy: ObjectId (ref: admin_users),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ code: 1 }` (unique)
- `{ isActive: 1, validFrom: 1, validUntil: 1 }`

---

### admin_users

```javascript
{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["super_admin", "manager"], required),
  phone: String (optional),
  profilePic: String (optional),
  
  // Address
  address: {
    line1: String (required),
    line2: String (optional),
    city: String (required),
    upazila: String (required),
    division: String (required),
    postalCode: String (required)
  },
  
  // Account
  isActive: Boolean (default: true),
  lastLogin: Date (optional),
  createdBy: ObjectId (ref: admin_users),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ email: 1 }` (unique)
- `{ role: 1, isActive: 1 }`

---

### reviews (TBD - Phase 2)

```javascript
{
  _id: ObjectId,
  productId: ObjectId (required, ref: products),
  customerId: ObjectId (required, ref: customers),
  rating: Number (required, min: 1, max: 5),
  title: String (optional),
  comment: String (optional),
  status: String (enum: ["pending", "approved", "rejected"], default: "pending"),
  approvedBy: ObjectId (optional, ref: admin_users),
  approvedAt: Date (optional),
  helpful: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ productId: 1, status: 1 }`
- `{ customerId: 1 }`
- `{ status: 1, createdAt: -1 }`

---

### notifications (TBD - Phase 2)

```javascript
{
  _id: ObjectId,
  recipientId: ObjectId (required, ref: customers or admin_users),
  recipientType: String (enum: ["customer", "admin"], required),
  type: String (enum: ["order", "payment", "shipping", "promotion", "system"], required),
  title: String (required),
  message: String (required),
  relatedEntityId: ObjectId (optional, e.g., orderId),
  isRead: Boolean (default: false),
  readAt: Date (optional),
  channels: [String] (enum: ["in_app", "email", "sms"], default: ["in_app"]),
  createdAt: Date
}
```

**Indexes**:
- `{ recipientId: 1, createdAt: -1 }`
- `{ recipientId: 1, isRead: 1 }`

---

### activity_logs (TBD - Phase 2)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: admin_users),
  action: String (required, e.g., "product.created", "order.confirmed"),
  entityType: String (enum: ["product", "order", "customer", "category", "manager"], required),
  entityId: ObjectId (required),
  changes: Object (optional, what changed),
  ipAddress: String (optional),
  userAgent: String (optional),
  createdAt: Date
}
```

**Indexes**:
- `{ userId: 1, createdAt: -1 }`
- `{ entityType: 1, entityId: 1 }`
- `{ action: 1, createdAt: -1 }`

---

### cms_content (TBD - Phase 2)

```javascript
{
  _id: ObjectId,
  section: String (required, enum: ["homepage_banner", "hero_slider", "featured_products", "latest_collection", "about_us", "contact_info", "social_links", "footer"]),
  title: String (optional),
  content: String (optional),
  imageUrl: String (optional),
  linkUrl: String (optional),
  sortOrder: Number (default: 0),
  isActive: Boolean (default: true),
  updatedBy: ObjectId (ref: admin_users),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ section: 1 }`
- `{ isActive: 1, sortOrder: 1 }`

---

### settings

```javascript
{
  _id: "store_settings",
  storeName: String,
  storeEmail: String,
  storePhone: String,
  bkashNumber: String (masked in responses),
  storeAddress: {
    line1: String,
    city: String,
    upazila: String,
    division: String,
    postalCode: String
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    tiktok: String
  },
  policies: {
    privacyPolicy: String,
    termsConditions: String,
    returnRefundPolicy: String,
    shippingPolicy: String
  },
  businessHours: {
    monday: { open: "09:00", close: "22:00" },
    // ... other days
  },
  updatedBy: ObjectId (ref: admin_users),
  updatedAt: Date
}
```

---

## Relationships Overview

### 1:N Relationships
- `Customer` → `Address` (customer has many addresses)
- `Customer` → `Cart` (customer has one active cart)
- `Customer` → `Order` (customer has many orders)
- `Category` → `Product` (category has many products)
- `Category` → `Category` (parent category has subcategories)
- `Brand` → `Product` (brand has many products)
- `Product` → `ProductImage` (product has many images)
- `Product` → `ProductVariant` (product has many variants)
- `Product` → `ProductTag` (product has many tags)
- `Tag` → `ProductTag` (tag applied to many products)
- `Cart` → `CartItem` (cart has many items)
- `Order` → `OrderItem` (order has many items)
- `AdminUser` → `ActivityLog` (admin generates many logs)

### M:N Relationships (Through Junction Tables)
- `Product` ↔ `Tag` (via `ProductTag`)
- `Product` ↔ `Category` (currently 1:N, could be M:N in future)

### 1:1 Relationships
- `Customer` → `Cart` (customer has exactly one cart)
- `Order` → `Payment` (order has one payment record)

---

## Data Validation Rules

### Customer
- Email: valid email format, unique, lowercase
- Phone: valid Bangladesh phone format (11 digits starting with 01)
- Password: min 8 chars, bcrypt hashed
- Name: min 2 chars, max 100 chars

### Product
- Price: must be ≥ 0, discount_price ≤ price
- Stock: non-negative integer
- SKU: unique, alphanumeric
- Name: min 3 chars, max 255 chars

### Order
- Status transitions: Pending → Confirmed → Shipped → Delivered → Completed (Cancelled from any state)
- Total: must equal sum of item prices + shipping - coupon discount
- No status changes after Completed or Cancelled

### Payment
- Sender Mobile: valid Bangladesh phone format
- Status: can only transition: Pending → Verified, or Pending → Failed
- Once Verified, cannot be changed

---

## Indexes Summary

**Critical Indexes** (must create immediately):
- `customers.email` (unique)
- `products.sku` (unique)
- `categories.slug` (unique)
- `tags.slug` (unique)
- `orders.orderId` (unique)
- `payments.paymentId` (unique)
- `carts.customerId` (unique)

**Search Indexes** (enable full-text search):
- `products` (text search on name and description)

**Performance Indexes** (for common queries):
- `orders` by customerId + date
- `orders` by status + date
- `products` by category
- `products` by status
- `cart_items` by cartId
- `wishlist_items` by customerId
- `order_items` by orderId

---

## Migration Strategy

1. **Phase 1**: Create core collections (customers, products, orders, payments)
2. **Phase 2**: Add optional collections (coupons, reviews, notifications, activity_logs)
3. **Phase 3**: Add CMS and settings collections

All migrations use Mongoose schema definitions with validation.
