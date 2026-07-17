import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setProducts, setLoading } from '../store/slices/productSlice'
import { getProducts } from '../api/product'

export default function Home() {
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.products)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    dispatch(setLoading(true))
    try {
      const response = await getProducts({ featured: 'true', limit: 8 })
      dispatch(setProducts(response.data.data))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to FashionHub</h1>
          <p className="text-xl mb-8">Discover the latest trends in Bangladesh clothing</p>
          <Link
            to="/shop"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Men', 'Women', 'Kids', 'Accessories', 'Shoes', 'Winter', 'Summer', 'Sale'].map(cat => (
            <Link
              key={cat}
              to={`/shop?category=${cat.toLowerCase()}`}
              className="bg-gray-100 p-6 rounded text-center hover:bg-gray-200"
            >
              <h3 className="font-bold text-lg">{cat}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="bg-white rounded shadow hover:shadow-lg transition"
            >
              <div className="bg-gray-200 h-48 rounded-t flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.brand}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold">৳{product.price}</span>
                  {product.discountPrice && (
                    <span className="text-red-600 line-through text-sm">৳{product.discountPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
