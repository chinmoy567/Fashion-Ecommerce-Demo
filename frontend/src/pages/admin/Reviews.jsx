import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function Reviews() {
  const { user } = useSelector(state => state.adminAuth)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      alert('Access denied')
      return
    }
    fetchReviews()
  }, [page, filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/reviews?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      })
      setReviews(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reviews Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Comment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{review.customerId?.name || 'Anonymous'}</td>
                  <td className="px-6 py-4 text-sm">{review.productId?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{renderStars(review.rating)}</td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">{review.comment || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        review.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : review.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
