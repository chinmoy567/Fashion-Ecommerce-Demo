import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getOrders } from '../api/order'
import { setOrders } from '../store/slices/orderSlice'

export default function MyOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { orders } = useSelector(state => state.orders)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await getOrders()
      dispatch(setOrders(response.data.data))
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4">No orders yet</p>
          <Link to="/shop" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">{order.orderNumber}</p>
                  <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded font-semibold ${getStatusBadgeColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Items</p>
                  <p className="font-semibold">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="font-semibold">৳{order.total}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Shipping</p>
                  <p className="font-semibold">৳{order.shippingCharge}</p>
                </div>
                {order.parcelId && (
                  <div>
                    <p className="text-gray-600 text-sm">Parcel ID</p>
                    <p className="font-semibold">{order.parcelId}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/orders/${order._id}/tracking`}
                  className="text-blue-600 hover:underline"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
