import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { createOrder } from '../api/order'
import CouponSection from '../components/CouponSection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total } = useSelector(state => state.cart)
  const { isAuthenticated } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    shippingAddress: { line1: '', city: '', upazila: '', division: '', postalCode: '' },
    billingAddress: { line1: '', city: '', upazila: '', division: '', postalCode: '' },
  })
  const [loading, setLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleCouponApply = (couponData) => {
    if (couponData) {
      setAppliedCoupon(couponData)
      setDiscountAmount(couponData.discountAmount)
      setFormData({
        ...formData,
        couponId: couponData.couponId,
      })
    } else {
      setAppliedCoupon(null)
      setDiscountAmount(0)
      const { couponId, ...rest } = formData
      setFormData(rest)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await createOrder(formData)
      navigate(`/orders/${response.data.data._id}/confirmation`)
    } catch (error) {
      console.error('Error creating order:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-card ring-1 ring-white/10 p-6 rounded-xl space-y-8"
          >
            {/* Shipping Address */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Street Address"
                  required
                  className="col-span-2"
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, line1: e.target.value }
                  })}
                />
                <Input
                  type="text"
                  placeholder="City"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                  })}
                />
                <Input
                  type="text"
                  placeholder="Upazila"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, upazila: e.target.value }
                  })}
                />
                <Input
                  type="text"
                  placeholder="Division"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, division: e.target.value }
                  })}
                />
                <Input
                  type="text"
                  placeholder="Postal Code"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, postalCode: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Shipping Method</h2>
              <label className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg cursor-pointer">
                <input type="radio" name="shipping" value="standard" defaultChecked className="accent-[#C9A24B]" />
                Standard Shipping (৳60) - 3-5 days
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gold text-black hover:bg-gold-light h-12">
              {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
            </Button>
          </motion.form>
        </div>

        {/* Order Summary */}
        <div className="bg-secondary/50 p-6 rounded-xl h-fit sticky top-24">
          <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 text-sm">
            {items.map(item => (
              <div key={item.productId} className="flex justify-between">
                <span className="text-muted-foreground">{item.quantity}x {item.productId?.name}</span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <CouponSection subtotal={total} onCouponApply={handleCouponApply} />

          <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>৳{total}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount:</span>
                <span>-৳{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping:</span>
              <span>৳60</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-white/10">
              <span>Total:</span>
              <span className="text-gold">৳{(total - discountAmount + 60).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
