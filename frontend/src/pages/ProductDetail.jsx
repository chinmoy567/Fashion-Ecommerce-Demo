import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById } from '../api/product'
import { addToCart } from '../api/cart'
import { setSelectedProduct } from '../store/slices/productSlice'
import { addItem } from '../store/slices/cartSlice'

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-gray-200 h-96 rounded flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{selectedProduct.name}</h1>
          <p className="text-gray-600 mb-4">{selectedProduct.brand}</p>

          <div className="flex gap-4 mb-4">
            <span className="text-2xl font-bold">৳{selectedProduct.price}</span>
            {selectedProduct.discountPrice && (
              <span className="text-red-600 line-through">৳{selectedProduct.discountPrice}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{selectedProduct.description}</p>

          <div className="flex gap-4 mb-6">
            <input
              type="number"
              min="1"
              max={selectedProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border px-4 py-2 w-20"
            />
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add to Cart
            </button>
          </div>

          <div className="border-t pt-4">
            <p className="mb-2"><strong>Stock:</strong> {selectedProduct.stock}</p>
            <p className="mb-2"><strong>SKU:</strong> {selectedProduct.sku}</p>
            <p className="mb-2"><strong>Category:</strong> {selectedProduct.category}</p>
            {selectedProduct.material && <p><strong>Material:</strong> {selectedProduct.material}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
