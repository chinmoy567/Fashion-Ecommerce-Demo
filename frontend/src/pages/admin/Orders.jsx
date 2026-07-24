import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [parcelId, setParcelId] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const query = new URLSearchParams({ page, limit: 10 })
      if (statusFilter) query.set('status', statusFilter)

      const response = await axios.get(`${API_BASE}/admin/orders?${query}`, authHeaders())
      setOrders(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update order status via the shared order status endpoint
  const updateStatus = async (orderId, status, extraParcelId) => {
    try {
      await axios.put(
        `${API_BASE}/orders/${orderId}/status`,
        { status, parcelId: extraParcelId },
        authHeaders()
      )
      setSelectedOrder(null)
      setParcelId('')
      fetchOrders()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order')
    }
  }

  const cancelOrder = async (order) => {
    if (!window.confirm(`Cancel order ${order.orderNumber}? Stock will be restored.`)) return
    try {
      await axios.put(`${API_BASE}/admin/orders/${order._id}/cancel`, {}, authHeaders())
      fetchOrders()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => { setStatusFilter(''); setPage(1) }}
          className={`px-4 py-2 rounded ${statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1) }}
            className={`px-4 py-2 rounded capitalize ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total (৳)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Placed</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">{order.customerId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{order.total?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View
                    </button>
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button
                        onClick={() => cancelOrder(order)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Order {selectedOrder.orderNumber}</h3>
              <button
                onClick={() => { setSelectedOrder(null); setParcelId('') }}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Customer</p>
                <p>{selectedOrder.customerId?.name} ({selectedOrder.customerId?.email})</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Shipping Address</p>
                <p>
                  {selectedOrder.shippingAddress?.line1}, {selectedOrder.shippingAddress?.upazila},{' '}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.division}{' '}
                  {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Items</p>
                <ul className="divide-y border rounded">
                  {selectedOrder.items?.map((item, idx) => (
                    <li key={idx} className="px-3 py-2 flex justify-between">
                      <span>{item.productId?.name || 'Product'} × {item.quantity}</span>
                      <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>৳{selectedOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{selectedOrder.shippingCharge?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>৳{selectedOrder.total?.toLocaleString()}</span>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-1">Update Status</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                    className="border px-3 py-2 rounded"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'shipped') && (
                    <input
                      type="text"
                      value={parcelId}
                      onChange={(e) => setParcelId(e.target.value)}
                      placeholder="Parcel / tracking ID"
                      className="border px-3 py-2 rounded flex-1 min-w-[150px]"
                    />
                  )}
                  <button
                    onClick={() => updateStatus(selectedOrder._id, selectedOrder.status, parcelId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
