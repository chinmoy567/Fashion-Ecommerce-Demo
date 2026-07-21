import { useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const isStaff = isAuthenticated && (user?.role === 'manager' || user?.role === 'super_admin')

  // Redirect if not admin/manager (navigation must happen in an effect, not during render)
  useEffect(() => {
    if (!isStaff) navigate('/staff-login')
  }, [isStaff])

  if (!isStaff) return null

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">
            {user?.role === 'super_admin' ? '👑 Admin Panel' : '📊 Manager Panel'}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Welcome, {user?.fullName || user?.name}
          </p>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          <Link
            to={user?.role === 'super_admin' ? '/admin/dashboard' : '/admin/manager-dashboard'}
            className="block px-4 py-2 rounded hover:bg-gray-700 transition font-semibold"
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/orders"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            📋 Orders
          </Link>

          {user?.role === 'super_admin' && (
            <>
              <Link
                to="/admin/analytics"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                📈 Analytics
              </Link>
              <Link
                to="/admin/products"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                📦 Products
              </Link>
            </>
          )}

          <Link
            to="/admin/customers"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            👥 Customers
          </Link>

          <Link
            to="/admin/inventory"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            📊 Inventory
          </Link>

          <Link
            to="/admin/reviews"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            ⭐ Reviews
          </Link>

          {user?.role === 'super_admin' && (
            <>
              <Link
                to="/admin/coupons"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                🎟️ Coupons
              </Link>
              <Link
                to="/admin/blog"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                📝 Blog
              </Link>
              <Link
                to="/admin/staff"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                🛡️ Staff Management
              </Link>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Link
            to="/"
            className="block w-full text-center px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 mb-2"
          >
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 overflow-auto">
        <div className="bg-white shadow p-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
