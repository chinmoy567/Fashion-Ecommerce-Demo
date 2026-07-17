import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById } from '../api/product'
import { addToCart } from '../api/cart'
import { setSelectedProduct } from '../store/slices/productSlice'
import { addItem } from '../store/slices/cartSlice'
import ReviewSection from '../components/ReviewSection'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { selectedProduct } = useSelector(state => state.products)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id)
      dispatch(setSelectedProduct(response.data.data))
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      await addToCart({ productId: id, quantity })
      dispatch(addItem({
        productId: id,
        quantity,
        price: selectedProduct.discountPrice || selectedProduct.price,
      }))
      alert('Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!selectedProduct) return <div className="text-center py-12">Product not found</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => window.history.back()}
        className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="sticky top-4 h-fit">
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            {selectedProduct.image ? (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-96 text-gray-400"><span>Image not available</span></div>'
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-200 text-gray-400">
                <span>No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{selectedProduct.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{selectedProduct.brand || 'DeerFit'}</p>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <span className="text-4xl font-bold text-blue-600">৳{selectedProduct.price}</span>
            {selectedProduct.discountPrice && (
              <span className="text-lg text-red-600 line-through">৳{selectedProduct.discountPrice}</span>
            )}
            {selectedProduct.stock > 0 ? (
              <span className="text-green-600 font-semibold text-lg">In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold text-lg">Out of Stock</span>
            )}
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed">{selectedProduct.description}</p>

          <div className="mb-8 pb-8 border-b">
            <label className="block text-sm font-semibold mb-2">Quantity</label>
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                max={selectedProduct.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="border border-gray-300 px-4 py-2 w-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stock === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><strong className="text-gray-700">Available Stock:</strong> <span className="text-green-600 font-semibold">{selectedProduct.stock}</span></p>
              <p className="mb-2"><strong className="text-gray-700">SKU:</strong> <span className="text-gray-600">{selectedProduct.sku}</span></p>
              <p className="mb-2"><strong className="text-gray-700">Material:</strong> <span className="text-gray-600">{selectedProduct.material || 'N/A'}</span></p>
              <p><strong className="text-gray-700">Brand:</strong> <span className="text-gray-600">{selectedProduct.brand || 'DeerFit'}</span></p>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection />
    </div>
  )
}
