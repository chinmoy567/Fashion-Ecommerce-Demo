import { useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function CouponSection({ subtotal, onCouponApply }) {
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await axios.post(`${API_BASE}/coupons/validate`, {
        code: couponCode,
        subtotal: subtotal || 0,
      })

      const couponData = response.data.data
      setAppliedCoupon(couponData)
      setMessage('Coupon applied successfully!')
      setCouponCode('')

      onCouponApply({
        couponId: couponData.couponId,
        code: couponData.code,
        discountAmount: couponData.discountAmount,
        finalAmount: couponData.finalAmount,
      })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to apply coupon')
      setAppliedCoupon(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setMessage('')
    onCouponApply(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyCoupon()
    }
  }

  return (
    <div className="p-4 bg-secondary/50 rounded-xl mb-4">
      <AnimatePresence mode="wait">
        {!appliedCoupon ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <h3 className="font-medium flex items-center gap-2"><Tag className="h-4 w-4 text-gold" /> Have a coupon code?</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter coupon code"
                className="flex-1"
              />
              <Button onClick={handleApplyCoupon} disabled={loading} className="bg-gold text-black hover:bg-gold-light">
                {loading ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            {message && (
              <p className={`text-sm ${message.includes('successfully') ? 'text-success' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2 p-3 bg-success/10 border border-success/30 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-success">Coupon Applied: {appliedCoupon.code}</p>
                <p className="text-sm text-success/80">
                  Discount: ৳{appliedCoupon.discountAmount.toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                aria-label="Remove coupon"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
