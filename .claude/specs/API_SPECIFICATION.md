# E-Commerce Platform — API Specification

**Version**: 1.0  
**Base URL**: `http://localhost:5000/api` (dev) / `https://api.example.com/api` (prod)  
**Authentication**: JWT Bearer Token

---

## Table of Contents

1. [Response Format](#response-format)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Product Endpoints](#product-endpoints)
4. [Category Endpoints](#category-endpoints)
5. [Cart Endpoints](#cart-endpoints)
6. [Order Endpoints](#order-endpoints)
7. [Payment Endpoints](#payment-endpoints)
8. [Customer Endpoints](#customer-endpoints)
9. [Admin Endpoints](#admin-endpoints)
10. [Error Handling](#error-handling)

---

## Response Format

### Success Response (2xx)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Pagination Response

```json
{
  "success": true,
  "message": "Products retrieved",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

## Authentication Endpoints

### POST /auth/register

Register a new customer account.

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01712345678",
  "password": "SecurePassword123!"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "customerId": "cust_123",
    "email": "john@example.com"
  }
}
```

**Errors**:
- 400: Email already registered
- 400: Invalid email format
- 400: Password too weak

---

### POST /auth/verify-email

Verify customer email with OTP.

**Request**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "verified": true,
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Errors**:
- 400: Invalid OTP
- 400: OTP expired
- 404: Email not found

---

### POST /auth/login

Customer or admin login.

**Request**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "cust_123",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

**Errors**:
- 401: Invalid credentials
- 403: Email not verified

---

### POST /auth/refresh-token

Refresh expired JWT token.

**Request**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### POST /auth/logout

Logout and invalidate token.

**Request**: None (uses Authorization header)

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /auth/forgot-password

Request password reset.

**Request**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Reset link sent to email"
}
```

---

### POST /auth/reset-password

Reset password with token.

**Request**:
```json
{
  "token": "reset_token_123",
  "password": "NewPassword123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Product Endpoints

### GET /products

List all products with filters and pagination.

**Query Parameters**:
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)
- `search` (string, optional)
- `category` (string, optional)
- `brand` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `size` (string, optional)
- `color` (string, optional)
- `sort` (string: "newest" | "price_asc" | "price_desc" | "rating", default: "newest")

**Response** (200):
```json
{
  "success": true,
  "message": "Products retrieved",
  "data": {
    "items": [
      {
        "productId": "prod_123",
        "name": "Blue Cotton Shirt",
        "price": 1200,
        "discountPrice": 900,
        "category": "Men",
        "brand": "BrandX",
        "images": ["url1", "url2"],
        "rating": 4.5,
        "stock": 50,
        "isFeatured": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### GET /products/:id

Get single product details.

**Response** (200):
```json
{
  "success": true,
  "message": "Product retrieved",
  "data": {
    "productId": "prod_123",
    "name": "Blue Cotton Shirt",
    "description": "Premium quality cotton shirt...",
    "price": 1200,
    "discountPrice": 900,
    "category": {
      "categoryId": "cat_1",
      "name": "Men"
    },
    "brand": {
      "brandId": "brand_1",
      "name": "BrandX"
    },
    "sku": "SKU123",
    "material": "100% Cotton",
    "weight": 500,
    "images": [
      {
        "imageId": "img_1",
        "url": "url1",
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "variantId": "var_1",
        "size": "M",
        "color": "Blue",
        "stock": 10
      }
    ],
    "tags": ["casual", "shirt", "summer"],
    "status": "active",
    "isFeatured": true,
    "reviews": [
      {
        "reviewId": "rev_1",
        "customerName": "John",
        "rating": 5,
        "comment": "Great product!"
      }
    ],
    "relatedProducts": [
      { "productId": "prod_124", "name": "Red Cotton Shirt" }
    ]
  }
}
```

---

### POST /products (Admin/Manager)

Create a new product.

**Request**:
```json
{
  "name": "Blue Cotton Shirt",
  "description": "Premium quality...",
  "categoryId": "cat_1",
  "brandId": "brand_1",
  "price": 1200,
  "discountPrice": 900,
  "stock": 50,
  "sku": "SKU123",
  "material": "100% Cotton",
  "weight": 500,
  "images": ["url1", "url2"],
  "variants": [
    { "size": "S", "color": "Blue", "stock": 20 },
    { "size": "M", "color": "Blue", "stock": 30 }
  ],
  "tags": ["casual", "shirt"],
  "isFeatured": true
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "productId": "prod_123" }
}
```

---

### PUT /products/:id (Admin/Manager)

Update product.

**Request**: Same as POST /products

**Response** (200):
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

---

### DELETE /products/:id (Admin)

Delete product.

**Response** (200):
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Category Endpoints

### GET /categories

List all categories.

**Response** (200):
```json
{
  "success": true,
  "message": "Categories retrieved",
  "data": [
    {
      "categoryId": "cat_1",
      "name": "Men",
      "parentId": null,
      "children": [
        { "categoryId": "cat_1_1", "name": "Shirts" }
      ]
    }
  ]
}
```

---

### POST /categories (Admin)

Create category.

**Request**:
```json
{
  "name": "Accessories",
  "parentId": null
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Category created",
  "data": { "categoryId": "cat_9" }
}
```

---

## Cart Endpoints

### GET /cart

Get customer's cart.

**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "message": "Cart retrieved",
  "data": {
    "cartId": "cart_123",
    "items": [
      {
        "cartItemId": "ci_1",
        "product": {
          "productId": "prod_123",
          "name": "Blue Shirt"
        },
        "variant": {
          "variantId": "var_1",
          "size": "M",
          "color": "Blue"
        },
        "quantity": 2,
        "price": 900
      }
    ],
    "subtotal": 1800,
    "shippingCharge": 100,
    "couponDiscount": 100,
    "total": 1800
  }
}
```

---

### POST /cart/items

Add item to cart.

**Request**:
```json
{
  "productId": "prod_123",
  "variantId": "var_1",
  "quantity": 2
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { "cartItemId": "ci_1" }
}
```

---

### PUT /cart/items/:cartItemId

Update cart item quantity.

**Request**:
```json
{
  "quantity": 3
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Cart item updated"
}
```

---

### DELETE /cart/items/:cartItemId

Remove item from cart.

**Response** (200):
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## Order Endpoints

### POST /orders

Create a new order from cart.

**Request**:
```json
{
  "shippingAddressId": "addr_123",
  "billingAddressId": "addr_124",
  "shippingMethodId": "ship_1",
  "couponCode": "SAVE10"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ord_123",
    "status": "pending",
    "total": 1900,
    "estimatedDelivery": "2026-07-24"
  }
}
```

---

### GET /orders

Get customer's orders.

**Query Parameters**:
- `status` (pending | completed | cancelled)
- `page`, `limit`

**Response** (200):
```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": {
    "items": [
      {
        "orderId": "ord_123",
        "date": "2026-07-17",
        "status": "pending",
        "total": 1900,
        "items": 2
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 5, "pages": 1 }
  }
}
```

---

### GET /orders/:orderId

Get order details.

**Response** (200):
```json
{
  "success": true,
  "message": "Order retrieved",
  "data": {
    "orderId": "ord_123",
    "status": "pending",
    "items": [
      {
        "productId": "prod_123",
        "name": "Blue Shirt",
        "quantity": 2,
        "unitPrice": 900
      }
    ],
    "shippingAddress": {
      "line1": "123 Main St",
      "city": "Dhaka",
      "upazila": "Dhaka",
      "division": "Dhaka",
      "postalCode": "1000"
    },
    "payment": { "status": "pending", "method": "bkash" },
    "total": 1900,
    "orderDate": "2026-07-17",
    "estimatedDelivery": "2026-07-24"
  }
}
```

---

## Payment Endpoints

### POST /payments

Submit bKash payment details.

**Request**:
```json
{
  "orderId": "ord_123",
  "senderMobile": "01712345678",
  "transactionId": "txn_123456",
  "screenshotUrl": "https://..."
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Payment submitted for verification",
  "data": {
    "paymentId": "pay_123",
    "status": "pending"
  }
}
```

---

### POST /payments/:paymentId/verify (Admin/Manager)

Verify bKash payment and confirm order.

**Request**:
```json
{
  "verified": true,
  "parcelId": "PARCEL123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Payment verified, order confirmed",
  "data": {
    "orderId": "ord_123",
    "status": "confirmed",
    "parcelId": "PARCEL123456"
  }
}
```

---

## Customer Endpoints

### GET /customer/profile

Get customer profile.

**Headers**: Authorization: Bearer {token}

**Response** (200):
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "customerId": "cust_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "profilePic": "url",
    "emailVerified": true,
    "totalOrders": 5,
    "totalSpending": 25000
  }
}
```

---

### PUT /customer/profile

Update customer profile.

**Request**:
```json
{
  "name": "John Doe",
  "phone": "01712345678",
  "profilePic": "url"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### GET /customer/addresses

Get customer's saved addresses.

**Response** (200):
```json
{
  "success": true,
  "message": "Addresses retrieved",
  "data": [
    {
      "addressId": "addr_123",
      "line1": "123 Main St",
      "city": "Dhaka",
      "upazila": "Dhaka",
      "division": "Dhaka",
      "postalCode": "1000",
      "isDefault": true
    }
  ]
}
```

---

### POST /customer/addresses

Add new address.

**Request**:
```json
{
  "line1": "123 Main St",
  "line2": "Apt 4",
  "city": "Dhaka",
  "upazila": "Dhaka",
  "union": "Motijheel",
  "division": "Dhaka",
  "postalCode": "1000",
  "isDefault": false
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Address added",
  "data": { "addressId": "addr_124" }
}
```

---

### PUT /customer/addresses/:addressId

Update address.

**Request**: Same as POST

**Response** (200):
```json
{
  "success": true,
  "message": "Address updated"
}
```

---

### DELETE /customer/addresses/:addressId

Delete address.

**Response** (200):
```json
{
  "success": true,
  "message": "Address deleted"
}
```

---

## Admin Endpoints

### GET /admin/dashboard

Get admin dashboard data.

**Headers**: Authorization: Bearer {token}, Role: admin|manager

**Response** (200):
```json
{
  "success": true,
  "message": "Dashboard data retrieved",
  "data": {
    "revenue": {
      "total": 500000,
      "today": 12000,
      "monthly": 450000
    },
    "orders": {
      "total": 250,
      "pending": 30,
      "confirmed": 180,
      "delivered": 40,
      "cancelled": 0
    },
    "customers": {
      "total": 150
    },
    "products": {
      "total": 500
    },
    "recentOrders": [
      {
        "orderId": "ord_123",
        "customer": "John Doe",
        "total": 1900,
        "status": "pending",
        "date": "2026-07-17"
      }
    ]
  }
}
```

---

### GET /admin/orders

List orders for admin (with all statuses).

**Query Parameters**:
- `status` (pending | confirmed | shipped | delivered | completed | cancelled)
- `page`, `limit`

**Response** (200): Same pagination format as GET /orders

---

### GET /admin/orders/:orderId

Get order details for admin.

**Response** (200): Same as GET /orders/:orderId but with payment details visible

---

### PUT /admin/orders/:orderId/confirm

Confirm order after payment verification.

**Request**:
```json
{
  "parcelId": "PARCEL123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Order confirmed",
  "data": { "orderId": "ord_123", "status": "confirmed" }
}
```

---

### PUT /admin/orders/:orderId/cancel

Cancel order.

**Request**:
```json
{
  "reason": "Out of stock"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Order cancelled"
}
```

---

### GET /admin/customers

List customers.

**Query Parameters**: `page`, `limit`, `search`

**Response** (200):
```json
{
  "success": true,
  "message": "Customers retrieved",
  "data": {
    "items": [
      {
        "customerId": "cust_123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "01712345678",
        "totalOrders": 5,
        "totalSpending": 25000,
        "joinDate": "2026-06-01"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 150, "pages": 8 }
  }
}
```

---

### GET /admin/analytics

Get sales analytics.

**Query Parameters**:
- `period` (daily | weekly | monthly)
- `startDate`, `endDate`

**Response** (200):
```json
{
  "success": true,
  "message": "Analytics retrieved",
  "data": {
    "revenue": [
      { "date": "2026-07-17", "amount": 12000 }
    ],
    "orders": [
      { "date": "2026-07-17", "count": 15 }
    ],
    "topProducts": [
      { "productId": "prod_1", "name": "Blue Shirt", "sold": 45 }
    ],
    "topCategories": [
      { "categoryId": "cat_1", "name": "Men", "sold": 120 }
    ]
  }
}
```

---

### POST /admin/managers (Super Admin)

Create manager account.

**Request**:
```json
{
  "fullName": "Jane Manager",
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Manager created",
  "data": { "managerId": "mgr_123" }
}
```

---

## Error Handling

### Standard HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK — Request successful |
| 201 | Created — Resource created |
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Missing/invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource not found |
| 409 | Conflict — Resource conflict (e.g., duplicate email) |
| 422 | Unprocessable Entity — Validation failed |
| 500 | Internal Server Error |

### Error Response Examples

**Validation Error (400)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

**Authorization Error (401)**:
```json
{
  "success": false,
  "message": "Unauthorized: Invalid or expired token"
}
```

**Permission Error (403)**:
```json
{
  "success": false,
  "message": "Forbidden: You do not have permission to perform this action"
}
```

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer {jwt_token}
```

Admin/Manager endpoints additionally require:
```
Authorization: Bearer {jwt_token}
Role: admin|manager
```

---

## Rate Limiting

- **Auth endpoints**: 5 requests per minute per IP
- **Product endpoints**: 100 requests per minute per IP
- **Order endpoints**: 50 requests per minute per user
- **Payment endpoints**: 10 requests per minute per user

---

## Versioning

Current API version: **v1**  
Future versions will use: `/api/v2`, `/api/v3`, etc.

---

## Documentation Format

This specification will be auto-generated from code comments using OpenAPI/Swagger.
Developers must keep this specification in sync with implementation.
