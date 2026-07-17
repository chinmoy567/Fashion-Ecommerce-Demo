import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import MyOrders from './pages/MyOrders'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminCustomers from './pages/admin/Customers'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Customer routes */}
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/orders/:id/tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </Provider>
  )
}

export default App
