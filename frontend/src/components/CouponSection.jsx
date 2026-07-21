import { useState } from 'react'
import axios from 'axios'

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
    <div className="p-4 bg-gray-50 rounded mb-4">
      {!appliedCoupon ? (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Have a coupon code?</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter coupon code"
              className="flex-1 border px-4 py-2 rounded"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {message && (
            <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 p-3 bg-green-50 border border-green-200 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-green-800">Coupon Applied: {appliedCoupon.code}</p>
              <p className="text-sm text-green-700">
                Discount: ৳{appliedCoupon.discountAmount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
