import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'manager' && user?.role !== 'super_admin') {
      navigate('/login')
    }
    // TODO: Fetch dashboard metrics from API
  }, [isAuthenticated, user])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-100 p-6 rounded">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{metrics.totalOrders}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold">{metrics.pendingOrders}</p>
        </div>
        <div className="bg-blue-100 p-6 rounded">
          <p className="text-gray-600 text-sm">Confirmed</p>
          <p className="text-2xl font-bold">{metrics.confirmedOrders}</p>
        </div>
        <div className="bg-green-100 p-6 rounded">
          <p className="text-gray-600 text-sm">Delivered</p>
          <p className="text-2xl font-bold">{metrics.deliveredOrders}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold">৳{metrics.totalRevenue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <a href="/admin/orders" className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer">
          <h3 className="font-bold mb-2">Manage Orders</h3>
          <p className="text-gray-600">View and manage customer orders</p>
        </a>
        <a href="/admin/products" className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer">
          <h3 className="font-bold mb-2">Manage Products</h3>
          <p className="text-gray-600">Add, edit, and remove products</p>
        </a>
        <a href="/admin/customers" className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer">
          <h3 className="font-bold mb-2">View Customers</h3>
          <p className="text-gray-600">View customer information</p>
        </a>
        <a href="/admin/reviews" className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer">
          <h3 className="font-bold mb-2">Manage Reviews</h3>
          <p className="text-gray-600">Approve or reject customer reviews</p>
        </a>
        <a href="/admin/coupons" className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer">
          <h3 className="font-bold mb-2">Manage Coupons</h3>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </a>
        <a href="/admin/inventory" className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer">
          <h3 className="font-bold mb-2">Manage Inventory</h3>
          <p className="text-gray-600">Track and adjust product stock</p>
        </a>
      </div>
    </div>
  )
}
