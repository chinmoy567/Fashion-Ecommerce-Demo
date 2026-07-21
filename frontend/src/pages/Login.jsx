import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginCustomer } from '../api/auth'
import { setUser, setToken } from '../store/slices/authSlice'
import AuthCard from '../components/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await loginCustomer(formData)
      dispatch(setToken(response.data.data.token))
      dispatch(setUser(response.data.data.customer))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Welcome Back" subtitle="Login to continue to DeerFit">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 text-destructive text-sm p-3 mb-4 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="mb-2">Email</Label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-2">Password</Label>
          <Input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gold hover:text-gold-light transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-gold text-black hover:bg-gold-light h-11">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="text-gold hover:text-gold-light transition-colors">
          Register
        </Link>
      </p>
    </AuthCard>
  )
}
