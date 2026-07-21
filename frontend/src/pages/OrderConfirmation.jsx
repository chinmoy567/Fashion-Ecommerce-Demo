import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Phone } from 'lucide-react'
import { getOrderById } from '../api/order'
import { Button } from '@/components/ui/button'

// Shown after a Cash on Delivery order is placed; no online payment gateway is involved
export default function OrderConfirmation() {
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card ring-1 ring-white/10 p-8 rounded-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/15 flex items-center justify-center"
        >
          <CheckCircle2 className="h-8 w-8 text-success" />
        </motion.div>

        <h1 className="font-display text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-6">
          Our customer service agent will contact you shortly to confirm your order.
        </p>

        <div className="bg-secondary/50 rounded-xl p-4 text-left space-y-2 mb-6 text-sm">
          <p><span className="text-muted-foreground">Order Number:</span> {order.orderNumber}</p>
          <p><span className="text-muted-foreground">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><span className="text-muted-foreground">Total Amount:</span> <span className="text-gold font-medium">৳{order.total}</span></p>
          <p><span className="text-muted-foreground">Payment Method:</span> Cash on Delivery</p>
        </div>

        <p className="text-muted-foreground mb-3 text-sm">Need help now? Reach us directly:</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <a
            href="tel:+8801234567890"
            className="flex items-center justify-center gap-2 border border-white/10 px-6 py-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Phone className="h-4 w-4" /> Call +880 1234 567890
          </a>
          <a
            href="https://wa.me/8801234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-success text-white px-6 py-3 rounded-lg hover:bg-success/90 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="bg-gold text-black hover:bg-gold-light" render={<Link to={`/orders/${order._id}/tracking`} />} nativeButton={false}>
            Track Order
          </Button>
          <Button variant="outline" render={<Link to="/shop" />} nativeButton={false}>
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
