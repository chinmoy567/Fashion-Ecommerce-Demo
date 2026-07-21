import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resetPassword } from '../api/auth'
import AuthCard from '../components/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Reset Password">
      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 text-destructive text-sm p-3 mb-4 rounded-lg">
          {error}
        </motion.div>
      )}

      {success ? (
        <div className="bg-success/10 text-success text-sm p-3 rounded-lg">
          Password reset successfully. Redirecting to login...
        </div>
      ) : (
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
            <Label className="mb-2">Reset Code</Label>
            <Input
              type="text"
              required
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              maxLength={6}
            />
          </div>

          <div>
            <Label className="mb-2">New Password</Label>
            <Input
              type="password"
              required
              minLength={6}
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>

          <div>
            <Label className="mb-2">Confirm New Password</Label>
            <Input
              type="password"
              required
              minLength={6}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gold text-black hover:bg-gold-light h-11">
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link to="/forgot-password" className="text-gold hover:text-gold-light transition-colors">
          Request a new code
        </Link>
      </p>
    </AuthCard>
  )
}
