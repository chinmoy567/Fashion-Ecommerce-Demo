import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function NotificationBell() {
  const { isAuthenticated } = useSelector(state => state.customerAuth)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_BASE}/notifications/count`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('customer_token')}` },
      })
      setUnreadCount(response.data.data.unreadCount)
    } catch (error) {
      console.error('Error fetching notification count:', error)
    }
  }

  const fetchNotifications = async () => {
    if (!showDropdown) {
      setShowDropdown(true)
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE}/notifications?limit=5`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('customer_token')}` },
        })
        setNotifications(response.data.data.items)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    } else {
      setShowDropdown(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${API_BASE}/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('customer_token')}` },
        }
      )
      fetchUnreadCount()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative">
      <motion.button
        onClick={fetchNotifications}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative p-2 text-foreground/80 hover:text-gold transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 glass rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-display font-semibold text-base">Notifications</h3>
            </div>

            {loading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Loading...</div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => markAsRead(notification._id)}
                    className={`p-3 hover:bg-white/5 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-gold/5' : ''
                    }`}
                  >
                    <p className="font-medium text-sm capitalize">{notification.type?.replace(/_/g, ' ')}</p>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
