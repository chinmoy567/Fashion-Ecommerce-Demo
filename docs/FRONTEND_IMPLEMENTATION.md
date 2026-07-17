# Frontend Implementation Guide

## React + Vite + Tailwind CSS Architecture

### Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── api/                      # API client
│   │   ├── client.js             # Axios instance
│   │   ├── auth.js               # Auth endpoints
│   │   ├── products.js           # Product endpoints
│   │   ├── cart.js               # Cart endpoints
│   │   ├── orders.js             # Order endpoints
│   │   ├── customers.js          # Customer endpoints
│   │   └── admin.js              # Admin endpoints
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/               # Reusable components
│   │   ├── common/               # Global components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Error.jsx
│   │   │   └── Pagination.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGallery.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   └── ProductVariantSelector.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── CouponInput.jsx
│   │   ├── order/
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   ├── OrderStatus.jsx
│   │   │   └── ParcelTracking.jsx
│   │   └── admin/
│   │       ├── Dashboard Card.jsx
│   │       ├── OrderTable.jsx
│   │       ├── ProductForm.jsx
│   │       └── ManagerForm.jsx
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.js            # Auth logic
│   │   ├── useCart.js            # Cart logic
│   │   ├── useProduct.js         # Product logic
│   │   ├── useOrder.js           # Order logic
│   │   ├── useAsync.js           # Async handling
│   │   └── useFetch.js           # Data fetching
│   │
│   ├── layouts/                  # Layout components
│   │   ├── CustomerLayout.jsx    # Customer side
│   │   ├── AdminLayout.jsx       # Admin side
│   │   └── AuthLayout.jsx        # Auth pages
│   │
│   ├── pages/                    # Page components
│   │   ├── customer/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Categories.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── static/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── Terms.jsx
│   │   │   ├── ReturnPolicy.jsx
│   │   │   └── ShippingPolicy.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Products.jsx
│   │       ├── ProductForm.jsx
│   │       ├── Categories.jsx
│   │       ├── Orders.jsx
│   │       ├── OrderDetails.jsx
│   │       ├── Customers.jsx
│   │       ├── Managers.jsx
│   │       ├── Analytics.jsx
│   │       ├── CMS.jsx
│   │       └── Settings.jsx
│   │
│   ├── routes/                   # Route definitions
│   │   ├── customerRoutes.jsx
│   │   ├── adminRoutes.jsx
│   │   ├── ProtectedRoute.jsx    # Auth guard
│   │   └── index.jsx
│   │
│   ├── services/                 # Business logic
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── analyticsService.js
│   │
│   ├── store/                    # Redux state
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── productSlice.js
│   │   │   ├── orderSlice.js
│   │   │   ├── uiSlice.js
│   │   │   └── adminSlice.js
│   │   ├── store.js              # Redux store config
│   │   └── hooks.js              # Redux hooks
│   │
│   ├── styles/                   # Global styles
│   │   ├── globals.css
│   │   ├── tailwind.css
│   │   └── animations.css
│   │
│   ├── utils/                    # Utilities
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   ├── localStorage.js
│   │   └── errorHandling.js
│   │
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
│
├── .env.local                    # Environment variables
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Key Features Implementation

### 1. Authentication

**Auth Slice (Redux)**:
```javascript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => { state.user = action.payload },
    setTokens: (state, action) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    }
  }
})
```

**useAuth Hook**:
```javascript
const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  
  const register = async (data) => {
    // Call /auth/register
    // Save to localStorage
  }
  
  const login = async (email, password) => {
    // Call /auth/login
    // Save token to localStorage
    // Redirect to dashboard
  }
  
  const logout = () => {
    // Clear state
    // Clear localStorage
    // Redirect to home
  }
  
  return { auth, register, login, logout }
}
```

### 2. Product Catalog

**Product Service**:
```javascript
export const productService = {
  getProducts: (filters, pagination) => 
    client.get('/products', { params: { ...filters, ...pagination } }),
  
  getProduct: (id) => 
    client.get(`/products/${id}`),
  
  searchProducts: (query) => 
    client.get('/products', { params: { search: query } }),
  
  filterProducts: (filters) => 
    client.get('/products', { params: filters })
}
```

**Product Slice (Redux)**:
```javascript
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    filters: {},
    pagination: { page: 1, limit: 20, total: 0 },
    isLoading: false,
    error: null
  }
})
```

### 3. Shopping Cart

**Cart Slice**:
```javascript
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    shippingCharge: 0,
    couponDiscount: 0,
    total: 0
  },
  reducers: {
    addToCart: (state, action) => {
      // Add or update item
      // Recalculate totals
    },
    removeFromCart: (state, action) => {
      // Remove item
      // Recalculate totals
    },
    updateQuantity: (state, action) => {
      // Update item quantity
      // Recalculate totals
    },
    applyCoupon: (state, action) => {
      // Apply discount
      // Recalculate totals
    },
    clearCart: (state) => {
      // Clear all items
    }
  }
})
```

### 4. Checkout & Payment

**Checkout Flow**:
```javascript
// 1. Shipping Address Selection
<CheckoutStep1_Address />

// 2. Billing Address (Optional)
<CheckoutStep2_Billing />

// 3. Shipping Method Selection
<CheckoutStep3_Shipping />

// 4. Order Review
<CheckoutStep4_Review />

// 5. Payment Method (bKash)
<CheckoutStep5_Payment />

// 6. Order Confirmation
<OrderSuccess />
```

**Payment Form**:
```javascript
const PaymentForm = ({ orderId }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p>Transfer to bKash: {storeNumber}</p>
        <p>Amount: {amount}</p>
      </div>
      <input name="senderMobile" placeholder="Your bKash number" required />
      <input name="transactionId" placeholder="Transaction ID (optional)" />
      <input type="file" name="screenshot" placeholder="Screenshot (optional)" />
      <button type="submit">Submit Payment</button>
    </form>
  )
}
```

### 5. Order Tracking

**Order Tracking Component**:
```javascript
const OrderTracking = ({ orderId }) => {
  const [order, setOrder] = useState(null)
  
  useEffect(() => {
    // Fetch order details
    // Fetch payment status
    // Fetch parcel tracking info
  }, [orderId])
  
  return (
    <div>
      <OrderTimeline status={order.status} />
      <ParcelInfo parcelId={order.parcelId} />
      <OrderDetails order={order} />
    </div>
  )
}
```

### 6. Admin Dashboard

**Dashboard Slice**:
```javascript
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: {
      totalRevenue: 0,
      todayRevenue: 0,
      monthlyRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalCustomers: 0,
      totalProducts: 0
    },
    recentOrders: [],
    isLoading: false
  }
})
```

---

## State Management

### Redux Structure

**Store Configuration**:
```javascript
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    products: productSlice.reducer,
    orders: orderSlice.reducer,
    admin: adminSlice.reducer,
    ui: uiSlice.reducer
  }
})
```

**Custom Hooks**:
```javascript
import { useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
```

---

## Component Architecture

### Reusable Component Examples

**Button Component** (shadcn/ui):
```javascript
const Button = ({
  variant = 'default',  // default, secondary, danger, ghost
  size = 'md',         // sm, md, lg
  disabled = false,
  loading = false,
  onClick,
  children
}) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium',
        variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
        size === 'sm' && 'text-sm px-3 py-1',
        size === 'lg' && 'text-lg px-6 py-3'
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

**Form Input Component**:
```javascript
const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block font-medium mb-1">{label}</label>}
      <input
        className={cn(
          'w-full px-3 py-2 border rounded',
          error ? 'border-red-500' : 'border-gray-300'
        )}
        {...props}
      />
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  )
}
```

---

## Form Handling

### React Hook Form Integration

**Checkout Form Example**:
```javascript
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const checkoutSchema = z.object({
  shippingAddress: z.object({
    line1: z.string().min(5, 'Required'),
    city: z.string().min(2, 'Required'),
    upazila: z.string().min(2, 'Required'),
    division: z.string().min(2, 'Required'),
    postalCode: z.string().min(4, 'Required')
  }),
  shippingMethod: z.string().min(1, 'Select shipping method'),
  agreeTerms: z.boolean().refine(val => val, 'You must agree')
})

const CheckoutForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(checkoutSchema)
  })
  
  const onSubmit = async (data) => {
    // Submit order
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Address Line 1"
        {...register('shippingAddress.line1')}
        error={errors.shippingAddress?.line1?.message}
      />
      {/* More fields */}
      <Button type="submit">Place Order</Button>
    </form>
  )
}
```

---

## Styling with Tailwind CSS

### Design System Tokens

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#3B82F6',      // Blue
      secondary: '#6B7280',    // Gray
      success: '#10B981',      // Green
      danger: '#EF4444',       // Red
      warning: '#F59E0B',      // Amber
      info: '#0EA5E9'          // Cyan
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    }
  }
}
```

### Responsive Breakpoints

```javascript
// Mobile First Approach
<div className="text-sm md:text-base lg:text-lg">
  Text that grows on larger screens
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Items that change columns responsively
</div>
```

---

## Performance Optimization

### Code Splitting

```javascript
// Route-based splitting
const Home = lazy(() => import('./pages/customer/Home'))
const Shop = lazy(() => import('./pages/customer/Shop'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/admin/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

### Image Optimization

```javascript
// Lazy load images
<img
  src={imageUrl}
  alt={alt}
  loading="lazy"
  className="max-w-full h-auto"
/>

// Cloudinary responsive images
<img
  src={`${cloudinaryUrl}?w=500&h=500&c=fill`}
  srcSet={`
    ${cloudinaryUrl}?w=300 300w,
    ${cloudinaryUrl}?w=500 500w,
    ${cloudinaryUrl}?w=800 800w
  `}
  sizes="(max-width: 600px) 300px, 500px"
  alt={alt}
/>
```

### Memoization

```javascript
// Prevent unnecessary re-renders
const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="border rounded p-4">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </Button>
    </div>
  )
}, (prev, next) => {
  return prev.product.id === next.product.id
})
```

---

## Testing Strategy

### Unit Tests

```javascript
// useCart.test.js
describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addToCart({ id: 1, name: 'Product', price: 100 })
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(100)
  })
})
```

### Component Tests

```javascript
// ProductCard.test.jsx
describe('ProductCard', () => {
  it('should render product and call onAddToCart', () => {
    const mockFn = jest.fn()
    const product = { id: 1, name: 'Shirt', price: 50 }
    
    render(<ProductCard product={product} onAddToCart={mockFn} />)
    
    fireEvent.click(screen.getByText('Add to Cart'))
    expect(mockFn).toHaveBeenCalledWith(1)
  })
})
```

---

## Environment Variables

**.env.local**:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ClothingStore
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_STORE_BKASH_NUMBER=01912345678
```

---

## Dependencies

**package.json key dependencies**:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "redux": "^4.2.x",
    "react-redux": "^8.x",
    "@reduxjs/toolkit": "^1.9.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "axios": "^1.x",
    "tailwindcss": "^3.x",
    "@headlessui/react": "^1.x",
    "framer-motion": "^10.x",
    "clsx": "^2.x"
  },
  "devDependencies": {
    "vite": "^4.x",
    "@vitejs/plugin-react": "^4.x",
    "eslint": "^8.x",
    "prettier": "^3.x",
    "jest": "^29.x",
    "@testing-library/react": "^14.x"
  }
}
```

---

## Next Steps

1. ✅ Frontend architecture designed
2. ➜ Run `/setup-project` to initialize
3. ➜ Create pages one by one using `/create-feature`
4. ➜ Connect to backend API endpoints
5. ➜ Test end-to-end
6. ➜ Deploy to Render
