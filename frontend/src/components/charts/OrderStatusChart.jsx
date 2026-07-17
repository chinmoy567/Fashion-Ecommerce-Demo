import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const statusColors = {
  pending: '#fbbf24',
  confirmed: '#60a5fa',
  shipped: '#8b5cf6',
  delivered: '#34d399',
  completed: '#10b981',
  cancelled: '#ef4444',
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function OrderStatusChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">📊 Order Status Distribution</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: statusLabels[item._id] || item._id,
    value: item.count,
    revenue: item.revenue,
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">📊 Order Status Distribution</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  statusColors[data[index]?._id] || Object.values(statusColors)[index % 6]
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [value, 'Orders']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  statusColors[data[idx]?._id] || Object.values(statusColors)[idx % 6],
              }}
            ></div>
            <span className="text-gray-600">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
