import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerCustomer, verifyEmail } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState('register') // 'register' or 'verify'
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerCustomer(formData)
      setStep('verify')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await verifyEmail({ email: formData.email, otp })
      localStorage.setItem('token', response.data.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Verify Email</h1>
          <p className="text-gray-600 mb-4">Enter the OTP sent to {formData.email}</p>

          {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
