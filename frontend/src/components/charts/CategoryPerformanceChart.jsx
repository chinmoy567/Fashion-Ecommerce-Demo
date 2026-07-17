import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function CategoryPerformanceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">📂 Category Performance</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.category?.[0]?.name || 'Unknown',
    revenue: item.revenue || 0,
    orders: item.orders || 0,
    sales: item.totalSales || 0,
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">📂 Category Performance</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
          {chartData.length} Categories
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
            }}
            formatter={(value) => [`৳${value.toLocaleString()}`, 'Revenue']}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-gray-600">
        Total Revenue: ৳{chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()} | Total
        Orders: {chartData.reduce((sum, d) => sum + d.orders, 0)}
      </div>
    </div>
  )
}
