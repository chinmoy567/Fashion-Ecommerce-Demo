import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'

// Customer Pages
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import AdminCustomers from './pages/admin/Customers'
import AdminReviews from './pages/admin/Reviews'
import AdminCoupons from './pages/admin/Coupons'
import AdminInventory from './pages/admin/Inventory'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'my-orders', element: <MyOrders /> },
      { path: 'orders/:id/tracking', element: <OrderTracking /> },
      { path: 'profile', element: <Profile /> },
      { path: 'wishlist', element: <Wishlist /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'coupons', element: <AdminCoupons /> },
      { path: 'inventory', element: <AdminInventory /> },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
