import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Analytics() {
  const { user } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [dailyTrend, setDailyTrend] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [categoryPerformance, setCategoryPerformance] = useState([])
  const [reviewMetrics, setReviewMetrics] = useState(null)
  const [days, setDays] = useState(7)
  const [months, setMonths] = useState(6)

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      alert('Access denied')
      return
    }
    fetchAnalytics()
  }, [])

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      fetchTrends()
    }
  }, [days, months])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [dashboard, products, reviews, category] = await Promise.all([
        axios.get(`${API_BASE}/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`${API_BASE}/analytics/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`${API_BASE}/analytics/reviews`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`${API_BASE}/analytics/categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ])

      setMetrics(dashboard.data.data)
      setDailyTrend(dashboard.data.data.dailyTrend || [])
      setMonthlyTrend(dashboard.data.data.monthlyTrend || [])
      setTopProducts(products.data.data.topProducts || [])
      setReviewMetrics(reviews.data.data)
      setCategoryPerformance(category.data.data || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrends = async () => {
    try {
      const [daily, monthly] = await Promise.all([
        axios.get(`${API_BASE}/analytics/sales/daily?days=${days}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`${API_BASE}/analytics/sales/monthly?months=${months}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ])

      setDailyTrend(daily.data.data || [])
      setMonthlyTrend(monthly.data.data || [])
    } catch (error) {
      console.error('Error fetching trends:', error)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading analytics...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      {metrics?.monthly && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-gray-600 text-sm">Monthly Revenue</p>
            <p className="text-2xl font-bold text-blue-600">৳{metrics.monthly.totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">{metrics.monthly.totalOrders} orders</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-gray-600 text-sm">Avg Order Value</p>
            <p className="text-2xl font-bold text-green-600">৳{metrics.monthly.averageOrderValue.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-gray-600 text-sm">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-600">{metrics.monthly.conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">{metrics.monthly.completedOrders} completed</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-gray-600 text-sm">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-600">{metrics.monthly.pendingOrders}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-gray-600 text-sm">Yearly Revenue</p>
            <p className="text-2xl font-bold text-red-600">৳{metrics.yearly.totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">{metrics.yearly.totalOrders} orders</p>
          </div>
        </div>
      )}

      {/* Review Metrics */}
      {reviewMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Daily Sales Trend</h3>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>

          <div className="h-64 overflow-x-auto">
            {dailyTrend.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Revenue</th>
                    <th className="text-right py-2">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyTrend.map((day) => (
                    <tr key={day._id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{day._id}</td>
                      <td className="text-right">৳{day.revenue.toFixed(0)}</td>
                      <td className="text-right">{day.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Monthly Sales Trend</h3>
            <select
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </div>

          <div className="h-64 overflow-x-auto">
            {monthlyTrend.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Month</th>
                    <th className="text-right py-2">Revenue</th>
                    <th className="text-right py-2">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyTrend.map((month) => (
                    <tr key={month._id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{month._id}</td>
                      <td className="text-right">৳{month.revenue.toFixed(0)}</td>
                      <td className="text-right">{month.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Top 10 Products</h3>
          <div className="overflow-x-auto">
            {topProducts.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Revenue</th>
                    <th className="text-right py-2">Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 truncate">
                        {product.product?.[0]?.name || 'Unknown'}
                      </td>
                      <td className="text-right">৳{product.revenue.toFixed(0)}</td>
                      <td className="text-right">{product.totalSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-8">No sales data</p>
            )}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Category Performance</h3>
          <div className="overflow-x-auto">
            {categoryPerformance.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Category</th>
                    <th className="text-right py-2">Revenue</th>
                    <th className="text-right py-2">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerformance.map((category) => (
                    <tr key={category._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 truncate">
                        {category.category?.[0]?.name || 'Unknown'}
                      </td>
                      <td className="text-right">৳{category.revenue.toFixed(0)}</td>
                      <td className="text-right">{category.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-8">No category data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
