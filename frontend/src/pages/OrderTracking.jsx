import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderById } from '../api/order'
import { useState } from 'react'

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

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!order) return <div className="text-center py-12">Order not found</div>

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'completed']
  const currentStatusIndex = statuses.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>

      <div className="bg-white p-6 rounded shadow mb-8">
        <p className="mb-2"><strong>Order Number:</strong> {order.orderNumber}</p>
        <p className="mb-2"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="mb-2"><strong>Total Amount:</strong> ৳{order.total}</p>
        {order.parcelId && <p><strong>Parcel ID:</strong> {order.parcelId}</p>}
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold text-lg mb-6">Delivery Timeline</h2>
        <div className="space-y-6">
          {statuses.map((status, index) => (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  index <= currentStatusIndex ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  {index < currentStatusIndex ? '✓' : index === currentStatusIndex ? '•' : ''}
                </div>
                {index < statuses.length - 1 && (
                  <div className={`w-1 h-12 ${index < currentStatusIndex ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                )}
              </div>
              <div>
                <p className="font-semibold capitalize">{status}</p>
                <p className="text-gray-600 text-sm">
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
          className="text-blue-600 hover:underline"
        >
          Back to Orders
        </button>
      </div>
    </div>
  )
}
