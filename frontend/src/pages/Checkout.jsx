import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { createOrder } from '../api/order'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total } = useSelector(state => state.cart)
  const { isAuthenticated } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    shippingAddress: { line1: '', city: '', upazila: '', division: '', postalCode: '' },
    billingAddress: { line1: '', city: '', upazila: '', division: '', postalCode: '' },
    shippingMethodId: 'standard',
  })
  const [loading, setLoading] = useState(false)

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await createOrder(formData)
      navigate(`/orders/${response.data.data._id}/payment`)
    } catch (error) {
      console.error('Error creating order:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, line1: e.target.value }
                  })}
                  className="col-span-2 border px-4 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                  })}
                  className="border px-4 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Upazila"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, upazila: e.target.value }
                  })}
                  className="border px-4 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Division"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, division: e.target.value }
                  })}
                  className="border px-4 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  required
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, postalCode: e.target.value }
                  })}
                  className="border px-4 py-2 rounded"
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" value="standard" defaultChecked />
                Standard Shipping (৳60) - 3-5 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.productId} className="flex justify-between">
                <span>{item.quantity}x {item.productId?.name}</span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>৳{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>৳60</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>৳{total + 60}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
