import { motion } from 'framer-motion'

// Shared glass-card shell for Login/Register/ForgotPassword/ResetPassword/StaffLogin
export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card ring-1 ring-white/10 p-8 rounded-2xl"
      >
        <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm mb-6">{subtitle}</p>}
        {children}
      </motion.div>
    </div>
  )
}
