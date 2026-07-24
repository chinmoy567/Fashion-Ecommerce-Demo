import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function Coupons() {
  const { user } = useSelector(state => state.adminAuth)
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchase: 0,
    maxUsage: null,
    expiryDate: '',
    description: '',
  })

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      alert('Access denied')
      return
    }
    fetchCoupons()
  }, [page])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/coupons?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      })
      setCoupons(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_BASE}/coupons`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      })
      alert('Coupon created successfully')
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minPurchase: 0,
        maxUsage: null,
        expiryDate: '',
        description: '',
      })
      setShowForm(false)
      fetchCoupons()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create coupon')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await axios.delete(`${API_BASE}/coupons/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      })
      fetchCoupons()
    } catch (error) {
      alert('Failed to delete coupon')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coupons Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Create Coupon'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full border px-3 py-2 rounded"
                  placeholder="SUMMER20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Discount Value</label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Min Purchase (৳)</label>
                <input
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Max Usage Count</label>
                <input
                  type="number"
                  value={formData.maxUsage || ''}
                  onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded h-20"
                  placeholder="Coupon description..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Coupon
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Value</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Usage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Expires</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-sm">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm capitalize">{coupon.discountType}</td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.currentUsage} {coupon.maxUsage ? `/ ${coupon.maxUsage}` : ''}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No coupons found
                </td>
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
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
