import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

// Shared product tile used on Home, Shop, Wishlist, and RelatedProducts
export default function ProductCard({ product, onToggleWishlist, isWishlisted = false }) {
  return (
    <motion.div
      data-reveal
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative rounded-xl overflow-hidden bg-card ring-1 ring-white/10 hover:ring-gold/40 transition-shadow hover:shadow-xl hover:shadow-black/30"
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
          {product.discountPrice && (
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full">
              Sale
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium truncate">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.brand}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-gold">৳{product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <span className="text-muted-foreground line-through text-sm">৳{product.price}</span>
            )}
          </div>
        </div>
      </Link>

      {onToggleWishlist && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.preventDefault()
            onToggleWishlist(product)
          }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full glass flex items-center justify-center"
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-gold text-gold' : 'text-foreground'}`} />
        </motion.button>
      )}
    </motion.div>
  )
}
