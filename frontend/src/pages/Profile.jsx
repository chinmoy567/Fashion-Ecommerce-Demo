import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    toast.info('Profile update not yet implemented')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-10">My Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card ring-1 ring-white/10 p-6 rounded-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="opacity-60"
            />
          </div>

          <div>
            <Label className="mb-2">Phone</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full bg-gold text-black hover:bg-gold-light h-11">
            Update Profile
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
