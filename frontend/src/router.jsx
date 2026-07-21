import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

// Customer Pages
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'

// Staff Pages
import StaffLogin from './pages/StaffLogin'
import AdminDashboard from './pages/admin/Dashboard'
import ManagerDashboard from './pages/admin/ManagerDashboard'
import AdminAnalytics from './pages/admin/Analytics'
import AdminOrders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import AdminCustomers from './pages/admin/Customers'
import AdminReviews from './pages/admin/Reviews'
import AdminCoupons from './pages/admin/Coupons'
import AdminInventory from './pages/admin/Inventory'
import AdminBlog from './pages/admin/Blog'
import StaffManagement from './pages/admin/StaffManagement'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'staff-login', element: <StaffLogin /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'my-orders', element: <MyOrders /> },
      { path: 'orders/:id/confirmation', element: <OrderConfirmation /> },
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
      { path: 'manager-dashboard', element: <ManagerDashboard /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'coupons', element: <AdminCoupons /> },
      { path: 'inventory', element: <AdminInventory /> },
      { path: 'blog', element: <AdminBlog /> },
      { path: 'staff', element: <StaffManagement /> },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
