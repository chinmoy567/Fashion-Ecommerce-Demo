import { useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function RevenueTrendChart({ dailyData = [], monthlyData = [] }) {
  const [timeframe, setTimeframe] = useState('daily')

  const data = timeframe === 'daily' ? dailyData : monthlyData
  const label = timeframe === 'daily' ? 'Daily Sales Trend' : 'Monthly Sales Trend'

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">{label}</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">📈 Revenue Trend</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              timeframe === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              timeframe === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="_id" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value) => [
              value ? `৳${value.toLocaleString()}` : '০',
              'Revenue',
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-gray-600">
        Total Revenue: ৳{data.reduce((sum, d) => sum + (d.revenue || 0), 0).toLocaleString()} | Orders:{' '}
        {data.reduce((sum, d) => sum + (d.orders || 0), 0)}
      </div>
    </div>
  )
}
