import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import StatCard from '../../components/charts/StatCard'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import OrderStatusChart from '../../components/charts/OrderStatusChart'
import TopProductsChart from '../../components/charts/TopProductsChart'
import CategoryPerformanceChart from '../../components/charts/CategoryPerformanceChart'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(state => state.adminAuth)
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [statusBreakdown, setStatusBreakdown] = useState([])

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
      const [dashboardRes, statusRes] = await Promise.all([
        axios.get(`${API_BASE}/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/analytics/orders/status-breakdown`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setMetrics(dashboardRes.data.data)
      setStatusBreakdown(statusRes.data.data || [])
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const monthly = metrics?.monthly || {}
  const yearly = metrics?.yearly || {}
  const customers = metrics?.customers || {}

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ↻ Refresh
          </button>
          {user?.role === 'super_admin' && (
            <Link
              to="/admin/analytics"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              📊 Deep Dive
            </Link>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Monthly Revenue"
          value={`৳${monthly.totalRevenue?.toFixed(0) || '0'}`}
          icon="📈"
          color="blue"
        />
        <StatCard
          label="Total Orders"
          value={monthly.totalOrders || '0'}
          icon="🛒"
          color="purple"
        />
        <StatCard
          label="Avg Order Value"
          value={`৳${monthly.averageOrderValue?.toFixed(0) || '0'}`}
          icon="💰"
          color="green"
        />
        <StatCard
          label="Conversion Rate"
          value={`${monthly.conversionRate?.toFixed(1) || '0'}%`}
          icon="✅"
          color="indigo"
        />
        <StatCard
          label="Yearly Revenue"
          value={`৳${yearly.totalRevenue?.toFixed(0) || '0'}`}
          icon="🎯"
          color="red"
        />
      </div>

      {/* Order Status & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={statusBreakdown} />
        <RevenueTrendChart
          dailyData={metrics?.dailyTrend || []}
          monthlyData={metrics?.monthlyTrend || []}
        />
      </div>

      {/* Product & Category Performance */}
      {user?.role === 'super_admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProductsChart data={metrics?.products?.topProducts || []} />
          <CategoryPerformanceChart data={metrics?.products?.categoryPerformance || []} />
        </div>
      )}

      {/* Order Status Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Order Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <p className="text-yellow-700 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{monthly.pendingOrders || 0}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-blue-700 text-sm font-medium">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{monthly.confirmedOrders || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <p className="text-purple-700 text-sm font-medium">Shipped</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{monthly.shippedOrders || 0}</p>
          </div>
          <div className="bg-cyan-50 p-4 rounded border border-cyan-200">
            <p className="text-cyan-700 text-sm font-medium">Delivered</p>
            <p className="text-2xl font-bold text-cyan-600 mt-2">{monthly.deliveredOrders || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <p className="text-green-700 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{monthly.completedOrders || 0}</p>
          </div>
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <p className="text-red-700 text-sm font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{monthly.cancelledOrders || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'super_admin' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/orders"
              className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              <p className="text-2xl mb-2">📋</p>
              <p className="font-semibold text-sm">Manage Orders</p>
            </Link>
            <Link
              to="/admin/products"
              className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              <p className="text-2xl mb-2">📦</p>
              <p className="font-semibold text-sm">Products</p>
            </Link>
            <Link
              to="/admin/inventory"
              className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              <p className="text-2xl mb-2">📊</p>
              <p className="font-semibold text-sm">Inventory</p>
            </Link>
            <Link
              to="/admin/customers"
              className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              <p className="text-2xl mb-2">👥</p>
              <p className="font-semibold text-sm">Customers</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
