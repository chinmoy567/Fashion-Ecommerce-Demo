import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRelatedProducts } from '../api/product'

export default function RelatedProducts() {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelated()
  }, [id])

  const fetchRelated = async () => {
    try {
      setLoading(true)
      const response = await getRelatedProducts(id, 4)
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || products.length === 0) return null

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="group block"
          >
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center mb-2">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
            <p className="font-semibold text-sm truncate">{product.name}</p>
            <p className="text-blue-600 font-bold">৳{product.discountPrice || product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
