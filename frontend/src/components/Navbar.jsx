import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag, Heart } from 'lucide-react'
import { logout } from '../store/slices/authSlice'
import NotificationBell from './NotificationBell'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/blog', label: 'Journal' },
]

// Animated underline nav link shared by desktop and mobile menus
function NavLink({ to, children, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} onClick={onClick} className="relative py-1 text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors">
      {children}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px bg-gold"
        initial={false}
        animate={{ width: isActive ? '100%' : 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </Link>
  )
}

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">
            Deer<span className="text-gold">Fit</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
            ))}
            <NavLink to="/wishlist">
              <span className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> Wishlist</span>
            </NavLink>

            <Link to="/cart" className="relative p-2 text-foreground/80 hover:text-gold transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.span
                    key={items.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {items.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <NotificationBell />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NavLink to="/my-orders">Orders</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login">Login</NavLink>
                <Button
                  size="sm"
                  className="bg-gold text-black hover:bg-gold-light"
                  render={<Link to="/register" />} nativeButton={false}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2">
              <ShoppingBag className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-3/4 sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-display text-xl">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-5 px-4">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>{link.label}</NavLink>
            ))}
            <NavLink to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/my-orders" onClick={() => setMobileOpen(false)}>Orders</NavLink>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)}>Profile</NavLink>
                <Button variant="outline" onClick={() => { setMobileOpen(false); handleLogout() }}>Logout</Button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMobileOpen(false)}>Login</NavLink>
                <Button
                  className="bg-gold text-black hover:bg-gold-light"
                  render={<Link to="/register" onClick={() => setMobileOpen(false)} />}
                  nativeButton={false}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
