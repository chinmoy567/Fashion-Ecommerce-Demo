import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import StatCard from '../../components/charts/StatCard'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import OrderStatusChart from '../../components/charts/OrderStatusChart'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(state => state.adminAuth)
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [statusBreakdown, setStatusBreakdown] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'manager' && user?.role !== 'super_admin')) {
      navigate('/staff-login')
      return
    }
    fetchDashboard()
  }, [isAuthenticated, user])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')

      const [dashboardRes, statusRes, ordersRes, inventoryRes] = await Promise.all([
        axios.get(`${API_BASE}/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/analytics/orders/status-breakdown`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/admin/orders?limit=5&page=1`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setMetrics(dashboardRes.data.data)
      setStatusBreakdown(statusRes.data.data || [])
      setRecentOrders(ordersRes.data.data?.items || [])
      setLowStockProducts(inventoryRes.data.data?.lowStockProducts || [])
    } catch (error) {
      console.error('Error fetching manager dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderAction = async (orderId, action) => {
    try {
      const token = localStorage.getItem('admin_token')
      const endpoint = action === 'confirm'
        ? `/admin/orders/${orderId}/confirm`
        : `/admin/orders/${orderId}/cancel`

      await axios.put(`${API_BASE}${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })

      fetchDashboard()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading manager dashboard...</p>
        </div>
      </div>
    )
  }

  const monthly = metrics?.monthly || {}

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Operational Overview & Quick Actions</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Orders"
          value={monthly.pendingOrders || '0'}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          label="Confirmed Orders"
          value={monthly.confirmedOrders || '0'}
          icon="✓"
          color="blue"
        />
        <StatCard
          label="Shipped"
          value={monthly.shippedOrders || '0'}
          icon="📦"
          color="purple"
        />
        <StatCard
          label="Delivered"
          value={monthly.deliveredOrders || '0'}
          icon="✅"
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={statusBreakdown} />
        <RevenueTrendChart
          dailyData={metrics?.dailyTrend || []}
          monthlyData={metrics?.monthlyTrend || []}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">📋 Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Order #</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      {order.customerId?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 font-semibold">৳{order.total?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleOrderAction(order._id, 'confirm')}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-xs mr-2"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                          onClick={() => handleOrderAction(order._id, 'cancel')}
                          className="text-red-600 hover:text-red-700 font-semibold text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No recent orders</p>
        )}
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">⚠️ Low Stock Alerts</h3>
          <Link
            to="/admin/inventory"
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            Manage Inventory →
          </Link>
        </div>

        {lowStockProducts && lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Product</th>
                  <th className="text-left py-3 px-4 font-semibold">SKU</th>
                  <th className="text-center py-3 px-4 font-semibold">Stock</th>
                  <th className="text-center py-3 px-4 font-semibold">Alert Level</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-red-50">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 font-mono text-xs">{product.sku}</td>
                    <td className="py-3 px-4 text-center font-bold text-red-600">{product.stock}</td>
                    <td className="py-3 px-4 text-center">
                      {product.stock < 5 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                          Critical
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                          Low
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">All products in stock ✓</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/orders"
            className="p-4 border rounded-lg hover:bg-blue-50 transition text-center"
          >
            <p className="text-2xl mb-2">📋</p>
            <p className="font-semibold text-sm">View Orders</p>
          </Link>
          <Link
            to="/admin/inventory"
            className="p-4 border rounded-lg hover:bg-green-50 transition text-center"
          >
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold text-sm">Inventory</p>
          </Link>
          <Link
            to="/admin/products"
            className="p-4 border rounded-lg hover:bg-purple-50 transition text-center"
          >
            <p className="text-2xl mb-2">🏷️</p>
            <p className="font-semibold text-sm">Products</p>
          </Link>
          <Link
            to="/admin/reviews"
            className="p-4 border rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <p className="text-2xl mb-2">⭐</p>
            <p className="font-semibold text-sm">Reviews</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
