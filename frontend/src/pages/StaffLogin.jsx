import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginStaff } from '../api/auth'
import { setUser, setToken } from '../store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StaffLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await loginStaff(formData)
      const { token, adminUser } = response.data.data
      // Save token to localStorage first (before any dispatch or navigation)
      localStorage.setItem('token', token)
      // Update Redux state (setUser persists the user to localStorage too)
      dispatch(setToken(token))
      dispatch(setUser(adminUser))
      // Navigate after state and storage are updated
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Staff login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gold-glow bg-background flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card ring-1 ring-white/10 rounded-2xl p-8"
      >
        <div className="mb-8">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Internal Access</p>
          <h1 className="font-display text-3xl font-bold">Staff Portal</h1>
          <p className="text-muted-foreground mt-2">Admin &amp; Manager Login</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="staff@example.com"
            />
          </div>

          <div>
            <Label className="mb-2">Password</Label>
            <Input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gold text-black hover:bg-gold-light h-11">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-muted-foreground text-sm mb-4">
            Customer?{' '}
            <Link to="/login" className="text-gold hover:text-gold-light font-medium transition-colors">
              Customer Login
            </Link>
          </p>
          <Link to="/" className="block text-center text-muted-foreground hover:text-foreground text-sm transition-colors">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
