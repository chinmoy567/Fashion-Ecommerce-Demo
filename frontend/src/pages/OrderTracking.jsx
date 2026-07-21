import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { getOrderById } from '../api/order'

export default function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(id)
      setOrder(response.data.data)
    } catch (error) {
      console.error('Error fetching order:', error)
      navigate('/my-orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-24 text-muted-foreground">Loading...</div>
  if (!order) return <div className="text-center py-24 text-muted-foreground">Order not found</div>

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'completed']
  const currentStatusIndex = statuses.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-10">Order Tracking</h1>

      <div className="bg-card ring-1 ring-white/10 p-6 rounded-xl mb-8 space-y-2 text-sm">
        <p><span className="text-muted-foreground">Order Number:</span> {order.orderNumber}</p>
        <p><span className="text-muted-foreground">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><span className="text-muted-foreground">Total Amount:</span> <span className="text-gold font-medium">৳{order.total}</span></p>
        {order.parcelId && <p><span className="text-muted-foreground">Parcel ID:</span> {order.parcelId}</p>}
      </div>

      {/* Timeline */}
      <div className="bg-card ring-1 ring-white/10 p-6 rounded-xl">
        <h2 className="font-display font-semibold text-lg mb-6">Delivery Timeline</h2>
        <div className="space-y-0">
          {statuses.map((status, index) => (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStatusIndex ? 'bg-gold text-black' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {index < currentStatusIndex ? <Check className="h-4 w-4" /> : index === currentStatusIndex ? <span className="h-2 w-2 rounded-full bg-black" /> : ''}
                </motion.div>
                {index < statuses.length - 1 && (
                  <div className={`w-0.5 h-12 ${index < currentStatusIndex ? 'bg-gold' : 'bg-white/10'}`}></div>
                )}
              </div>
              <div className="pb-6">
                <p className="font-medium capitalize">{status}</p>
                <p className="text-muted-foreground text-sm">
                  {index <= currentStatusIndex ? `${status.charAt(0).toUpperCase() + status.slice(1)} - Order is on the way` : 'Upcoming'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/my-orders')}
          className="text-gold hover:text-gold-light transition-colors"
        >
          Back to Orders
        </button>
      </div>
    </div>
  )
}
