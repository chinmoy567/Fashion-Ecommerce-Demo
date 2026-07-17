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

export default function TopProductsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">🏆 Top Products by Revenue</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  const chartData = data.slice(0, 8).map((item) => ({
    name: item.product?.[0]?.name || 'Unknown',
    revenue: item.revenue || 0,
    sold: item.totalSold || 0,
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">🏆 Top Products by Revenue</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          Top {chartData.length}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            width={190}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
            }}
            formatter={(value) => [`৳${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-gray-600">
        Total Revenue: ৳{chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()} | Total
        Sold: {chartData.reduce((sum, d) => sum + d.sold, 0)} units
      </div>
    </div>
  )
}
