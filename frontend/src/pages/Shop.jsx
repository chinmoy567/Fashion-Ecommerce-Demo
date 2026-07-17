import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { setProducts, setFilter, setPage } from '../store/slices/productSlice'
import { getProducts, getFilterMetadata } from '../api/product'

const CATEGORIES = [
  { id: '', name: 'All Products', level: 0 },
  // Men's Clothing
  { id: 'mens-clothing', name: "Men's Clothing", level: 1 },
  { id: 'mens-upper', name: "Men's Upper Wear", level: 2, parent: 'mens-clothing' },
  { id: 'mens-shirt', name: 'Shirts', level: 3, parent: 'mens-upper' },
  { id: 'mens-tshirt', name: 'T-Shirts', level: 3, parent: 'mens-upper' },
  { id: 'mens-jacket', name: 'Jackets', level: 3, parent: 'mens-upper' },
  { id: 'mens-sweater', name: 'Sweaters', level: 3, parent: 'mens-upper' },
  { id: 'mens-lower', name: "Men's Lower Wear", level: 2, parent: 'mens-clothing' },
  { id: 'mens-pants', name: 'Pants', level: 3, parent: 'mens-lower' },
  { id: 'mens-jeans', name: 'Jeans', level: 3, parent: 'mens-lower' },
  { id: 'mens-shorts', name: 'Shorts', level: 3, parent: 'mens-lower' },
  { id: 'mens-activewear', name: 'Activewear', level: 3, parent: 'mens-lower' },

  // Women's Clothing
  { id: 'womens-clothing', name: "Women's Clothing", level: 1 },
  { id: 'womens-upper', name: "Women's Upper Wear", level: 2, parent: 'womens-clothing' },
  { id: 'womens-shirt', name: 'Shirts', level: 3, parent: 'womens-upper' },
  { id: 'womens-tshirt', name: 'T-Shirts', level: 3, parent: 'womens-upper' },
  { id: 'womens-blouse', name: 'Blouses', level: 3, parent: 'womens-upper' },
  { id: 'womens-jacket', name: 'Jackets', level: 3, parent: 'womens-upper' },
  { id: 'womens-top', name: 'Tops', level: 3, parent: 'womens-upper' },
  { id: 'womens-lower', name: "Women's Lower Wear", level: 2, parent: 'womens-clothing' },
  { id: 'womens-pants', name: 'Pants', level: 3, parent: 'womens-lower' },
  { id: 'womens-jeans', name: 'Jeans', level: 3, parent: 'womens-lower' },
  { id: 'womens-skirt', name: 'Skirts', level: 3, parent: 'womens-lower' },
  { id: 'womens-leggings', name: 'Leggings', level: 3, parent: 'womens-lower' },
  { id: 'womens-fullbody', name: "Women's Full Body", level: 2, parent: 'womens-clothing' },
  { id: 'womens-dress', name: 'Dresses', level: 3, parent: 'womens-fullbody' },
  { id: 'womens-saree', name: 'Sarees', level: 3, parent: 'womens-fullbody' },
  { id: 'womens-gown', name: 'Gowns', level: 3, parent: 'womens-fullbody' },

  // Kids' Clothing
  { id: 'kids-clothing', name: "Kids' Clothing", level: 1 },
  { id: 'kids-boys', name: "Boys' Clothing", level: 2, parent: 'kids-clothing' },
  { id: 'kids-girls', name: "Girls' Clothing", level: 2, parent: 'kids-clothing' },

  // Accessories
  { id: 'accessories', name: 'Accessories', level: 1 },
  { id: 'headwear', name: 'Headwear', level: 2, parent: 'accessories' },
  { id: 'footwear', name: 'Footwear', level: 2, parent: 'accessories' },
  { id: 'belts', name: 'Belts', level: 2, parent: 'accessories' },
  { id: 'scarves', name: 'Scarves', level: 2, parent: 'accessories' },
]

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'top-rated', label: 'Top Rated' },
]

export default function Shop() {
  const dispatch = useDispatch()
  const { products, filters, pagination } = useSelector(state => state.products)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({})
  const [filterMetadata, setFilterMetadata] = useState({ colors: [], sizes: [], priceRange: { min: 0, max: 10000 } })
  const [localFilters, setLocalFilters] = useState({
    search: '',
    minPrice: filterMetadata.priceRange.min,
    maxPrice: filterMetadata.priceRange.max,
    color: '',
    size: '',
    sort: 'newest',
    inStock: false
  })

  // Get main categories (level 1)
  const mainCategories = CATEGORIES.filter(cat => cat.level === 1)

  // Get subcategories for a parent
  const getSubcategories = (parentId) => {
    return CATEGORIES.filter(cat => cat.parent === parentId)
  }

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  // Load filter metadata on mount
  useEffect(() => {
    loadFilterMetadata()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [filters])

  const loadFilterMetadata = async () => {
    try {
      const response = await getFilterMetadata()
      if (response?.data?.data) {
        setFilterMetadata(response.data.data)
        setLocalFilters(prev => ({
          ...prev,
          minPrice: response.data.data.priceRange.min,
          maxPrice: response.data.data.priceRange.max
        }))
      }
    } catch (error) {
      console.error('Error loading filter metadata:', error)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = {
        page: filters.page || 1,
        limit: 12,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.color && { color: filters.color }),
        ...(filters.size && { size: filters.size }),
        ...(filters.sort && { sort: filters.sort }),
        ...(filters.inStock && { inStock: filters.inStock }),
      }

      const response = await getProducts(params)
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

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    dispatch(setFilter({
      search: localFilters.search || undefined,
      minPrice: localFilters.minPrice || undefined,
      maxPrice: localFilters.maxPrice || undefined,
      color: localFilters.color || undefined,
      size: localFilters.size || undefined,
      sort: localFilters.sort || undefined,
      inStock: localFilters.inStock ? 'true' : undefined
    }))
    dispatch(setPage(1))
  }

  const resetFilters = () => {
    setLocalFilters({
      search: '',
      minPrice: filterMetadata.priceRange.min,
      maxPrice: filterMetadata.priceRange.max,
      color: '',
      size: '',
      sort: 'newest',
      inStock: false
    })
    setSelectedCategory('')
    dispatch(setFilter({}))
    dispatch(setPage(1))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">DeerFit Store</h1>
        <p className="text-gray-600">Explore our premium collection of clothing and accessories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div className="mb-6 pb-6 border-b">
              <label className="block text-sm font-semibold mb-3">Category</label>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {/* All Products */}
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                    selectedCategory === ''
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All Products
                </button>

                {/* Main Categories */}
                {mainCategories.map(mainCat => {
                  const subCategories = getSubcategories(mainCat.id)
                  const isExpanded = expandedCategories[mainCat.id]

                  return (
                    <div key={mainCat.id}>
                      <div className="flex items-center gap-1">
                        {subCategories.length > 0 && (
                          <button
                            onClick={() => toggleCategory(mainCat.id)}
                            className="text-gray-600 hover:text-gray-800 p-1 text-xs"
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        )}
                        <button
                          onClick={() => handleCategoryChange(mainCat.id)}
                          className={`flex-1 text-left px-2 py-2 rounded-lg transition text-sm font-medium ${
                            selectedCategory === mainCat.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {mainCat.name}
                        </button>
                      </div>

                      {/* Subcategories */}
                      {isExpanded && subCategories.length > 0 && (
                        <div className="ml-4 space-y-1 mt-1">
                          {subCategories.map(subCat => (
                            <button
                              key={subCat.id}
                              onClick={() => handleCategoryChange(subCat.id)}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs transition ${
                                selectedCategory === subCat.id
                                  ? 'bg-blue-500 text-white font-semibold'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {subCat.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b">
              <label className="block text-sm font-semibold mb-3">Price Range</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600">Min Price</label>
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Max Price</label>
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || filterMetadata.priceRange.max)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            {filterMetadata.colors.length > 0 && (
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-semibold mb-3">Color</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filterMetadata.colors.map(color => (
                    <label key={color} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        checked={localFilters.color === color}
                        onChange={(e) => handleFilterChange('color', e.target.value)}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 capitalize">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="mb-6 pb-6 border-b">
              <label className="block text-sm font-semibold mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map(size => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange('size', localFilters.size === size ? '' : size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      localFilters.size === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6 pb-6 border-b">
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                value={localFilters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="mr-2 w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={applyFilters}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
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
              <div className="mb-4 text-sm text-gray-600">
                Showing {products.length} of {pagination.total} products
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map(product => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    <div className="relative bg-gray-200 h-64 overflow-hidden flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="40" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3E📸%3C/text%3E%3C/svg%3E'
                          }}
                          loading="lazy"
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

                      {/* Product Details */}
                      {product.colors && product.colors.length > 0 && (
                        <p className="text-xs text-gray-500 mb-2">Colors: {product.colors.join(', ')}</p>
                      )}
                      {product.sizes && product.sizes.length > 0 && (
                        <p className="text-xs text-gray-500 mb-2">Sizes: {product.sizes.join(', ')}</p>
                      )}

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
                <div className="flex justify-center gap-2 mt-8 mb-8 flex-wrap">
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
              <button
                onClick={resetFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
