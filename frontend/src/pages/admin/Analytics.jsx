import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import StatCard from '../../components/charts/StatCard'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import OrderStatusChart from '../../components/charts/OrderStatusChart'
import TopProductsChart from '../../components/charts/TopProductsChart'
import CategoryPerformanceChart from '../../components/charts/CategoryPerformanceChart'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Escape a value for safe inclusion in a CSV cell
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

// Build and download a CSV file from rows of [label, value] pairs per section
const downloadCsv = (filename, sections) => {
  const lines = sections.flatMap(({ title, headers, rows }) => [
    csvCell(title),
    headers.map(csvCell).join(','),
    ...rows.map((row) => row.map(csvCell).join(',')),
    '',
  ])

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function Analytics() {
  const { user } = useSelector((state) => state.adminAuth)
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [dailyTrend, setDailyTrend] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [categoryPerformance, setCategoryPerformance] = useState([])
  const [reviewMetrics, setReviewMetrics] = useState(null)
  const [customerMetrics, setCustomerMetrics] = useState(null)
  const [statusBreakdown, setStatusBreakdown] = useState([])
  const [days, setDays] = useState(7)
  const [months, setMonths] = useState(6)
  const [customRange, setCustomRange] = useState({ startDate: '', endDate: '' })
  const [rangeMetrics, setRangeMetrics] = useState(null)
  const [rangeError, setRangeError] = useState('')

  const authHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } }
  const isAuthorized = user?.role === 'manager' || user?.role === 'super_admin'

  useEffect(() => {
    if (!isAuthorized) return
    fetchAnalytics()
  }, [])

  useEffect(() => {
    if (isAuthorized) fetchTrends()
  }, [days, months])

  if (!isAuthorized) {
    return <div className="p-6 text-center text-red-600">Access denied</div>
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [dashboard, products, reviews, category, customers, status] = await Promise.all([
        axios.get(`${API_BASE}/analytics/dashboard`, authHeaders),
        axios.get(`${API_BASE}/analytics/products`, authHeaders),
        axios.get(`${API_BASE}/analytics/reviews`, authHeaders),
        axios.get(`${API_BASE}/analytics/categories`, authHeaders),
        axios.get(
          `${API_BASE}/analytics/customers?startDate=${startOfMonth}&endDate=${now.toISOString()}`,
          authHeaders
        ),
        axios.get(`${API_BASE}/analytics/orders/status-breakdown`, authHeaders),
      ])

      setMetrics(dashboard.data.data)
      setDailyTrend(dashboard.data.data.dailyTrend || [])
      setMonthlyTrend(dashboard.data.data.monthlyTrend || [])
      setTopProducts(products.data.data.topProducts || [])
      setReviewMetrics(reviews.data.data)
      setCategoryPerformance(category.data.data || [])
      setCustomerMetrics(customers.data.data)
      setStatusBreakdown(status.data.data || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrends = async () => {
    try {
      const [daily, monthly] = await Promise.all([
        axios.get(`${API_BASE}/analytics/sales/daily?days=${days}`, authHeaders),
        axios.get(`${API_BASE}/analytics/sales/monthly?months=${months}`, authHeaders),
      ])

      setDailyTrend(daily.data.data || [])
      setMonthlyTrend(monthly.data.data || [])
    } catch (error) {
      console.error('Error fetching trends:', error)
    }
  }

  const fetchCustomRange = async () => {
    const { startDate, endDate } = customRange
    if (!startDate || !endDate) {
      setRangeError('Select both a start and end date')
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setRangeError('Start date must be before end date')
      return
    }

    setRangeError('')
    try {
      const res = await axios.get(
        `${API_BASE}/analytics/sales?startDate=${startDate}&endDate=${endDate}`,
        authHeaders
      )
      setRangeMetrics(res.data.data)
    } catch (error) {
      console.error('Error fetching custom range metrics:', error)
      setRangeError('Failed to load metrics for this range')
    }
  }

  const exportCsv = () => {
    downloadCsv(`analytics-${new Date().toISOString().slice(0, 10)}.csv`, [
      {
        title: 'Daily Sales Trend',
        headers: ['Date', 'Revenue', 'Orders'],
        rows: dailyTrend.map((d) => [d._id, d.revenue?.toFixed(2) ?? 0, d.orders]),
      },
      {
        title: 'Monthly Sales Trend',
        headers: ['Month', 'Revenue', 'Orders'],
        rows: monthlyTrend.map((m) => [m._id, m.revenue?.toFixed(2) ?? 0, m.orders]),
      },
      {
        title: 'Top Products',
        headers: ['Product', 'Revenue', 'Units Sold'],
        rows: topProducts.map((p) => [
          p.product?.[0]?.name || 'Unknown',
          p.revenue?.toFixed(2) ?? 0,
          p.totalSold,
        ]),
      },
      {
        title: 'Category Performance',
        headers: ['Category', 'Revenue', 'Orders'],
        rows: categoryPerformance.map((c) => [
          c.category?.[0]?.name || 'Unknown',
          c.revenue?.toFixed(2) ?? 0,
          c.orders,
        ]),
      },
    ])
  }

  if (loading) {
    return <div className="p-6 text-center">Loading analytics...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            ⬇ Export CSV
          </button>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics?.monthly && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Monthly Revenue"
            value={`৳${metrics.monthly.totalRevenue.toFixed(0)}`}
            icon="📈"
            color="blue"
            changeLabel={`${metrics.monthly.totalOrders} orders`}
          />
          <StatCard
            label="Avg Order Value"
            value={`৳${metrics.monthly.averageOrderValue.toFixed(0)}`}
            icon="💰"
            color="green"
          />
          <StatCard
            label="Conversion Rate"
            value={`${metrics.monthly.conversionRate.toFixed(1)}%`}
            icon="✅"
            color="purple"
            changeLabel={`${metrics.monthly.completedOrders} completed`}
          />
          <StatCard
            label="Pending Orders"
            value={metrics.monthly.pendingOrders}
            icon="⏳"
            color="yellow"
          />
          <StatCard
            label="Yearly Revenue"
            value={`৳${metrics.yearly.totalRevenue.toFixed(0)}`}
            icon="🎯"
            color="red"
            changeLabel={`${metrics.yearly.totalOrders} orders`}
          />
        </div>
      )}

      {/* Customer Metrics */}
      {customerMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Customers" value={customerMetrics.totalCustomers} icon="👥" color="indigo" />
          <StatCard label="New This Month" value={customerMetrics.newCustomers} icon="🆕" color="green" />
          <StatCard label="Active This Month" value={customerMetrics.returningCustomers} icon="🔁" color="blue" />
          <StatCard
            label="Customer Growth"
            value={`${customerMetrics.growthRate.toFixed(1)}%`}
            icon="📊"
            color="purple"
          />
        </div>
      )}

      {/* Order Status & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={statusBreakdown} />
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Trend Range</h3>
            <div className="flex gap-2">
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
              </select>
              <select
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={12}>Last 12 months</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Controls the Revenue Trend chart below. Switch between daily and monthly views there.
          </p>
        </div>
      </div>

      <RevenueTrendChart dailyData={dailyTrend} monthlyData={monthlyTrend} />

      {/* Custom Date Range Report */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Custom Date Range Report</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start date</label>
            <input
              type="date"
              value={customRange.startDate}
              onChange={(e) => setCustomRange((r) => ({ ...r, startDate: e.target.value }))}
              className="border px-2 py-1 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End date</label>
            <input
              type="date"
              value={customRange.endDate}
              onChange={(e) => setCustomRange((r) => ({ ...r, endDate: e.target.value }))}
              className="border px-2 py-1 rounded text-sm"
            />
          </div>
          <button
            onClick={fetchCustomRange}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            Run Report
          </button>
        </div>

        {rangeError && <p className="text-sm text-red-600 mt-3">{rangeError}</p>}

        {rangeMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-blue-700 text-sm font-medium">Revenue</p>
              <p className="text-xl font-bold text-blue-600 mt-1">৳{rangeMetrics.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded border border-purple-200">
              <p className="text-purple-700 text-sm font-medium">Orders</p>
              <p className="text-xl font-bold text-purple-600 mt-1">{rangeMetrics.totalOrders}</p>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-green-700 text-sm font-medium">Avg Order Value</p>
              <p className="text-xl font-bold text-green-600 mt-1">৳{rangeMetrics.averageOrderValue.toFixed(0)}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
              <p className="text-indigo-700 text-sm font-medium">Conversion Rate</p>
              <p className="text-xl font-bold text-indigo-600 mt-1">{rangeMetrics.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Review Metrics */}
      {reviewMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-gray-600 text-sm">Total Reviews</p>
            <p className="text-2xl font-bold">{reviewMetrics.totalReviews}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-gray-600 text-sm">Approved</p>
            <p className="text-2xl font-bold text-green-600">{reviewMetrics.approvedReviews}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{reviewMetrics.pendingReviews}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-gray-600 text-sm">Avg Rating</p>
            <p className="text-2xl font-bold">⭐ {reviewMetrics.averageRating.toFixed(1)}</p>
          </div>
        </div>
      )}

      {/* Top Products & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart data={topProducts} />
        <CategoryPerformanceChart data={categoryPerformance} />
      </div>
    </div>
  )
}
