import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { setProducts, setFilter, setPage } from '../store/slices/productSlice'
import { getProducts } from '../api/product'

const CATEGORIES = [
  { id: '', name: 'All Products' },
  { id: 'mens-clothing', name: 'Men\'s Clothing' },
  { id: 'womens-clothing', name: 'Women\'s Clothing' },
  { id: 'kids-clothing', name: 'Kids\' Clothing' },
  { id: 'accessories', name: 'Accessories' },
]

export default function Shop() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { products, filters, pagination } = useSelector(state => state.products)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await getProducts(filters)
      if (response?.data?.data?.items && response.data.data.items.length > 0) {
        dispatch(setProducts(response.data.data))
      } else {
        dispatch(setProducts({
          items: [],
          pagination: { page: 1, limit: 12, total: 0, pages: 0 }
        }))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      dispatch(setProducts({
        items: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 }
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    dispatch(setFilter({ category: categoryId || undefined }))
    dispatch(setPage(1))
  }

  const handleSearch = (searchTerm) => {
    dispatch(setFilter({ search: searchTerm }))
    dispatch(setPage(1))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">DeerFit Store</h1>
      <p className="text-gray-600 mb-8">Explore our premium collection of clothing and accessories</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-6">Filters</h3>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold mb-3">Category</label>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map(product => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    <div className="relative bg-gray-200 h-64 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><span>No Image</span></div>'
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.brand || 'DeerFit'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-blue-600">৳{product.price}</span>
                        {product.stock > 0 ? (
                          <span className="text-green-600 text-sm font-semibold">In Stock</span>
                        ) : (
                          <span className="text-red-600 text-sm font-semibold">Out of Stock</span>
                        )}
                      </div>
                      {product.stock > 0 && (
                        <p className="text-xs text-gray-500 mt-2">{product.stock} available</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8 mb-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => dispatch(setPage(page))}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        filters.page === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found. Try different filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
