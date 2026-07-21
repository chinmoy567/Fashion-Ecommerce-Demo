import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { getCart } from '../api/cart'
import { setCart, updateQuantity, removeItem } from '../store/slices/cartSlice'
import { updateCartItem, removeFromCart } from '../api/cart'
import { Button } from '@/components/ui/button'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector(state => state.cart)
  const { isAuthenticated } = useSelector(state => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      const response = await getCart()
      dispatch(setCart(response.data.data))
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const handleUpdateQuantity = async (productId, variantId, quantity) => {
    if (quantity <= 0) return
    dispatch(updateQuantity({ productId, variantId, quantity }))
    await updateCartItem(productId, { quantity, variantId })
  }

  const handleRemove = async (productId, variantId) => {
    dispatch(removeItem({ productId, variantId }))
    await removeFromCart(productId, variantId)
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="mb-6 text-muted-foreground">Please login to view your cart</p>
        <Button className="bg-gold text-black hover:bg-gold-light" render={<Link to="/login" />} nativeButton={false}>
          Login
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-10">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="mb-6 text-muted-foreground">Your cart is empty</p>
          <Button className="bg-gold text-black hover:bg-gold-light" render={<Link to="/shop" />} nativeButton={false}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card ring-1 ring-white/10 rounded-xl overflow-hidden">
              <AnimatePresence initial={false}>
                {items.map(item => {
                  const productId = item.productId?._id || item.productId
                  const variant = item.variantId
                  return (
                    <motion.div
                      key={`${productId}-${variant?._id || variant || 'base'}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-4 p-4 border-b border-white/10 last:border-b-0"
                    >
                      <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-muted-foreground text-xs">No Image</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productId?.name}</h3>
                        {(variant?.size || variant?.color) && (
                          <p className="text-sm text-muted-foreground">
                            {variant.size && `Size: ${variant.size}`}{variant.size && variant.color && ' · '}{variant.color && `Color: ${variant.color}`}
                          </p>
                        )}
                        <p className="text-muted-foreground text-sm">৳{item.price} each</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(productId, variant?._id || variant, item.quantity - 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-white/5 transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(productId, variant?._id || variant, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-white/5 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(productId, variant?._id || variant)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gold">৳{item.price * item.quantity}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-secondary/50 p-6 rounded-xl h-fit sticky top-24">
            <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>৳{total}</span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-white/10 text-sm">
              <span className="text-muted-foreground">Shipping:</span>
              <span>৳60</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total:</span>
              <span className="text-gold">৳{total + 60}</span>
            </div>
            <Button onClick={() => navigate('/checkout')} className="w-full bg-gold text-black hover:bg-gold-light">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
