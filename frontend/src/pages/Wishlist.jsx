import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Wishlist() {
  // TODO: Implement wishlist functionality
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-10">My Wishlist</h1>
      <div className="text-center py-24">
        <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <p className="mb-6 text-muted-foreground">Wishlist feature coming soon</p>
        <Button className="bg-gold text-black hover:bg-gold-light" render={<Link to="/shop" />} nativeButton={false}>
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}
