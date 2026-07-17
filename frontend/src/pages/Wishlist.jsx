import { Link } from 'react-router-dom'

export default function Wishlist() {
  // TODO: Implement wishlist functionality
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="text-center py-12">
        <p className="mb-4">Wishlist feature coming soon</p>
        <Link to="/shop" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
