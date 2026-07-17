import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getCart } from '../api/cart'
import { setCart, updateQuantity, removeItem } from '../store/slices/cartSlice'
import { updateCartItem, removeFromCart } from '../api/cart'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector(state => state.cart)
  const { isAuthenticated } = useSelector(state => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      const response = await getCart()
      dispatch(setCart(response.data.data))
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return
    dispatch(updateQuantity({ productId, quantity }))
    await updateCartItem(productId, { quantity })
  }

  const handleRemove = async (productId) => {
    dispatch(removeItem(productId))
    await removeFromCart(productId)
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="mb-4">Please login to view your cart</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4">Your cart is empty</p>
          <Link to="/shop" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded shadow">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4 p-4 border-b">
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.productId?.name}</h3>
                    <p className="text-gray-600">৳{item.price} each</p>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                        className="border px-2 w-16"
                      />
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">৳{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-100 p-6 rounded h-fit">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>৳{total}</span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b">
              <span>Shipping:</span>
              <span>৳60</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total:</span>
              <span>৳{total + 60}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
