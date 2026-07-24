import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function StaffManagement() {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.adminAuth)
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'manager' })
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Only a super admin may access staff management
    if (user?.role !== 'super_admin') {
      navigate('/admin/dashboard')
      return
    }
    fetchStaff()
  }, [user])

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
  })

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/admin/staff`, authHeaders())
      setStaff(response.data.data || [])
    } catch (err) {
      console.error('Error fetching staff:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStaff = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await axios.post(`${API_BASE}/admin/create-staff`, formData, authHeaders())
      setFormData({ fullName: '', email: '', password: '', role: 'manager' })
      fetchStaff()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff account')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleStatus = async (member) => {
    try {
      await axios.put(
        `${API_BASE}/admin/staff/${member._id}/status`,
        { isActive: !member.isActive },
        authHeaders()
      )
      fetchStaff()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update staff status')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Staff Management</h1>
      <p className="text-gray-500 mb-6 text-sm">Only super admins can create or manage staff accounts.</p>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-4">Create Staff Account</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border px-3 py-2 pr-10 rounded"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="manager">Manager</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? 'Creating...' : 'Create Staff Account'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Last Login</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : staff.length > 0 ? (
              staff.map((member) => (
                <tr key={member._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{member.fullName}</td>
                  <td className="px-6 py-4 text-sm">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${member.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {member.lastLogin ? new Date(member.lastLogin).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {member._id !== user?._id && (
                      <button
                        onClick={() => toggleStatus(member)}
                        className={`font-semibold ${member.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                      >
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No staff accounts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
