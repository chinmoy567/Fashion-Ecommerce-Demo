import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { setProducts, setFilter, setPage } from '../store/slices/productSlice'
import { getProducts, getFilterMetadata } from '../api/product'
import ProductCard from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

// Renders a category and, if expanded, its children at any depth
function CategoryNode({ category, depth, selectedCategory, expandedCategories, getSubcategories, toggleCategory, handleCategoryChange }) {
  const children = getSubcategories(category.id)
  const isExpanded = expandedCategories[category.id]
  const isSelected = selectedCategory === category.id

  return (
    <div style={{ marginLeft: depth > 0 ? '1rem' : 0 }}>
      <div className="flex items-center gap-1">
        {children.length > 0 && (
          <button
            onClick={() => toggleCategory(category.id)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        )}
        <button
          onClick={() => handleCategoryChange(category.id)}
          className={`flex-1 text-left px-2 py-2 rounded-lg transition-colors ${depth > 0 ? 'text-xs' : 'text-sm font-medium'} ${
            isSelected
              ? 'bg-gold text-black'
              : 'bg-secondary text-secondary-foreground hover:bg-white/10'
          }`}
        >
          {category.name}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1 mt-1 overflow-hidden"
          >
            {children.map(child => (
              <CategoryNode
                key={child.id}
                category={child}
                depth={depth + 1}
                selectedCategory={selectedCategory}
                expandedCategories={expandedCategories}
                getSubcategories={getSubcategories}
                toggleCategory={toggleCategory}
                handleCategoryChange={handleCategoryChange}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Shop() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { products, filters, pagination } = useSelector(state => state.products)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initial = searchParams.get('category')
    const expanded = {}
    let current = CATEGORIES.find(cat => cat.id === initial)
    while (current?.parent) {
      expanded[current.parent] = true
      current = CATEGORIES.find(cat => cat.id === current.parent)
    }
    return expanded
  })
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

  // Get direct subcategories for a parent, at any depth
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

  // Apply category from the URL (e.g. links from the homepage) on mount
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) dispatch(setFilter({ category }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">Collection</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-2">The Store</h1>
        <p className="text-muted-foreground">Explore our premium collection of clothing and accessories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card ring-1 ring-white/10 rounded-xl p-6 sticky top-24 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gold" /> Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-gold hover:text-gold-light font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search products..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <label className="block text-sm font-medium mb-3">Category</label>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {/* All Products */}
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    selectedCategory === ''
                      ? 'bg-gold text-black font-semibold'
                      : 'bg-secondary text-secondary-foreground hover:bg-white/10'
                  }`}
                >
                  All Products
                </button>

                {/* Main Categories (rendered recursively so any depth of subcategories works) */}
                {mainCategories.map(mainCat => (
                  <CategoryNode
                    key={mainCat.id}
                    category={mainCat}
                    depth={0}
                    selectedCategory={selectedCategory}
                    expandedCategories={expandedCategories}
                    getSubcategories={getSubcategories}
                    toggleCategory={toggleCategory}
                    handleCategoryChange={handleCategoryChange}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <label className="block text-sm font-medium mb-3">Price Range</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Min Price</label>
                  <Input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max Price</label>
                  <Input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || filterMetadata.priceRange.max)}
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            {filterMetadata.colors.length > 0 && (
              <div className="mb-6 pb-6 border-b border-white/10">
                <label className="block text-sm font-medium mb-3">Color</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filterMetadata.colors.map(color => (
                    <label key={color} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        checked={localFilters.color === color}
                        onChange={(e) => handleFilterChange('color', e.target.value)}
                        className="mr-2 w-4 h-4 accent-[#C9A24B]"
                      />
                      <span className="text-sm text-muted-foreground capitalize">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <label className="block text-sm font-medium mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map(size => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange('size', localFilters.size === size ? '' : size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      localFilters.size === size
                        ? 'bg-gold text-black'
                        : 'bg-secondary text-secondary-foreground hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={localFilters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
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
                  className="mr-2 w-4 h-4 rounded accent-[#C9A24B]"
                />
                <span className="text-sm text-muted-foreground">In Stock Only</span>
              </label>
            </div>

            {/* Apply Filters Button */}
            <Button onClick={applyFilters} className="w-full bg-gold text-black hover:bg-gold-light">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {products.length} of {pagination.total} products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map(product => (
                  <ProductCard key={product._id} product={{ ...product, images: product.image ? [product.image] : [] }} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8 mb-8 flex-wrap">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => dispatch(setPage(page))}
                      className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                        filters.page === page
                          ? 'bg-gold text-black'
                          : 'bg-secondary text-secondary-foreground hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found. Try different filters.</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-gold hover:text-gold-light font-medium"
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
