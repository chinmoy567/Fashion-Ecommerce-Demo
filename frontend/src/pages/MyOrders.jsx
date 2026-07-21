import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrders } from '../api/order'
import { setOrders } from '../store/slices/orderSlice'
import { Button } from '@/components/ui/button'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const STATUS_STYLES = {
  pending: 'bg-warning/15 text-warning',
  confirmed: 'bg-blue-500/15 text-blue-400',
  shipped: 'bg-purple-500/15 text-purple-400',
  delivered: 'bg-success/15 text-success',
  completed: 'bg-secondary text-secondary-foreground',
  cancelled: 'bg-destructive/15 text-destructive',
}

export default function MyOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { orders } = useSelector(state => state.orders)
  const revealRef = useScrollReveal()

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

  const getStatusBadgeColor = (status) => STATUS_STYLES[status] || 'bg-secondary text-secondary-foreground'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-10">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="mb-6 text-muted-foreground">No orders yet</p>
          <Button className="bg-gold text-black hover:bg-gold-light" render={<Link to="/shop" />} nativeButton={false}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div ref={revealRef} className="space-y-4">
          {orders.map(order => (
            <motion.div
              key={order._id}
              data-reveal
              whileHover={{ y: -2 }}
              className="bg-card ring-1 ring-white/10 hover:ring-gold/30 p-6 rounded-xl transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg">{order.orderNumber}</p>
                  <p className="text-muted-foreground text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-muted-foreground text-xs">Items</p>
                  <p className="font-medium">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Total</p>
                  <p className="font-medium text-gold">৳{order.total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Shipping</p>
                  <p className="font-medium">৳{order.shippingCharge}</p>
                </div>
                {order.parcelId && (
                  <div>
                    <p className="text-muted-foreground text-xs">Parcel ID</p>
                    <p className="font-medium">{order.parcelId}</p>
                  </div>
                )}
              </div>

              <Link
                to={`/orders/${order._id}/tracking`}
                className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
              >
                Track Order
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
