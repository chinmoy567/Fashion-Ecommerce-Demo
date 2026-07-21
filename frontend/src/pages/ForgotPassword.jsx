import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { forgotPassword } from '../api/auth'
import AuthCard from '../components/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Forgot Password">
      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 text-destructive text-sm p-3 mb-4 rounded-lg">
          {error}
        </motion.div>
      )}

      {sent ? (
        <div className="space-y-4">
          <div className="bg-success/10 text-success text-sm p-3 rounded-lg">
            If an account exists for that email, a reset code has been sent. Please check your inbox.
          </div>
          <Button
            onClick={() => navigate('/reset-password', { state: { email } })}
            className="w-full bg-gold text-black hover:bg-gold-light h-11"
          >
            I have a code
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gold text-black hover:bg-gold-light h-11">
            {loading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered your password?{' '}
        <Link to="/login" className="text-gold hover:text-gold-light transition-colors">
          Login
        </Link>
      </p>
    </AuthCard>
  )
}
