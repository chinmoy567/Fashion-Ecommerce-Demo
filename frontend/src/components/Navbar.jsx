import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            FashionHub
          </Link>

          <div className="flex gap-6 items-center">
            <Link to="/shop" className="hover:text-gray-300">
              Shop
            </Link>
            <Link to="/wishlist" className="hover:text-gray-300">
              Wishlist
            </Link>

            <Link to="/cart" className="relative hover:text-gray-300">
              Cart
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-orders" className="hover:text-gray-300">
                  Orders
                </Link>
                <Link to="/profile" className="hover:text-gray-300">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
