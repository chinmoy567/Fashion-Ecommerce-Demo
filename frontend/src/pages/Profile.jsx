import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Profile() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '', email: user.email || '' })
    }
  }, [isAuthenticated, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement profile update API
    alert('Profile update not yet implemented')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  )
}
