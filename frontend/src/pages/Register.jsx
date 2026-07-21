import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { registerCustomer, verifyEmail } from '../api/auth'
import AuthCard from '../components/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  const ErrorBanner = () => error && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-destructive/10 text-destructive text-sm p-3 mb-4 rounded-lg"
    >
      {error}
    </motion.div>
  )

  if (step === 'verify') {
    return (
      <AuthCard title="Verify Email" subtitle={`Enter the OTP sent to ${formData.email}`}>
        <ErrorBanner />
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label className="mb-2">OTP</Label>
            <Input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gold text-black hover:bg-gold-light h-11">
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create Account" subtitle="Join DeerFit for premium style">
      <ErrorBanner />
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label className="mb-2">Name</Label>
          <Input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

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
          <Label className="mb-2">Phone</Label>
          <Input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

        <Button type="submit" disabled={loading} className="w-full bg-gold text-black hover:bg-gold-light h-11">
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-gold hover:text-gold-light transition-colors">
          Login
        </Link>
      </p>
    </AuthCard>
  )
}
