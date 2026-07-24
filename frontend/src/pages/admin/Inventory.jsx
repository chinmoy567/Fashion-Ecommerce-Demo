import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function Inventory() {
  const { user } = useSelector(state => state.adminAuth)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('available')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adjustmentData, setAdjustmentData] = useState({
    quantity: 0,
    reason: 'restock',
  })

  useEffect(() => {
    if (user?.role !== 'manager' && user?.role !== 'super_admin') {
      alert('Access denied')
      return
    }
    fetchCategories()
    fetchSummary()
  }, [])

  useEffect(() => {
    if (user?.role !== 'manager' && user?.role !== 'super_admin') return
    const debounce = setTimeout(fetchInventory, 300)
    return () => clearTimeout(debounce)
  }, [page, filter, search, categoryId])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20, status: filter })
      if (search) params.set('search', search)
      if (categoryId) params.set('categoryId', categoryId)

      const response = await axios.get(`${API_BASE}/inventory?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      })
      setProducts(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`)
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE}/inventory/summary`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      })
      setSummary(response.data.data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const handleAdjustStock = async (e) => {
    e.preventDefault()
    if (!selectedProduct) return

    try {
      await axios.post(
        `${API_BASE}/inventory/adjust`,
        {
          productId: selectedProduct._id,
          quantity: parseInt(adjustmentData.quantity),
          reason: adjustmentData.reason,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
        }
      )
      alert('Stock adjusted successfully')
      setAdjustmentData({ quantity: 0, reason: 'restock' })
      setSelectedProduct(null)
      fetchInventory()
      fetchSummary()
    } catch (error) {
      alert('Failed to adjust stock')
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of Stock'
    if (stock < 10) return 'Low Stock'
    return 'Available'
  }

  const getStatusColor = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-800'
    if (stock < 10) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-blue-600">{summary.totalProducts}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-2xl font-bold text-green-600">{summary.availableProducts}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">{summary.lowStockProducts}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{summary.outOfStockProducts}</p>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => { setFilter('available'); setPage(1); }}
          className={`px-4 py-2 rounded ${filter === 'available' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => { setFilter('low'); setPage(1); }}
          className={`px-4 py-2 rounded ${filter === 'low' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
        >
          Low Stock
        </button>
        <button
          onClick={() => { setFilter('outofstock'); setPage(1); }}
          className={`px-4 py-2 rounded ${filter === 'outofstock' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          Out of Stock
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or SKU..."
          className="border px-4 py-2 rounded flex-1 min-w-[220px] max-w-sm"
        />
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Adjust Stock: {selectedProduct.name}</h3>
          <form onSubmit={handleAdjustStock} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Adjustment Quantity</label>
                <input
                  type="number"
                  value={adjustmentData.quantity}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                  placeholder="e.g., +10 or -5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Reason</label>
                <select
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="restock">Restock</option>
                  <option value="damage">Damage</option>
                  <option value="return">Return</option>
                  <option value="correction">Correction</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply Adjustment
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null)
                  setAdjustmentData({ quantity: 0, reason: 'restock' })
                }}
                className="px-6 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price (৳)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.categoryId?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm">{product.sku}</td>
                  <td className="px-6 py-4 text-sm">{product.price}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(product.stock)}`}>
                      {getStockStatus(product.stock)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No products found
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
