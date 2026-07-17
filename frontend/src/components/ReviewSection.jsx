import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ReviewSection() {
  const { id } = useParams()
  const { isAuthenticated } = useSelector(state => state.auth)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [id])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/reviews/product/${id}`)
      setReviews(response.data.data.items)
      setAverageRating(response.data.data.averageRating)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('Please login to write a review')
      return
    }

    try {
      setSubmitting(true)
      await axios.post(
        `${API_BASE}/reviews`,
        {
          productId: id,
          rating: formData.rating,
          comment: formData.comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      alert('Review submitted successfully! It will be visible after approval.')
      setFormData({ rating: 5, comment: '' })
      setShowReviewForm(false)
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
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

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  return (
    <div className="mt-12 border-t pt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl font-bold">{averageRating}</span>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {isAuthenticated && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Write a Review
          </button>
        )}

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Very Poor</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Comment (optional)</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                maxLength={500}
                className="w-full border px-3 py-2 rounded h-24"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/500</p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="p-4 border rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{review.customerId?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {renderStars(review.rating)}
              </div>
              {review.comment && <p className="text-gray-700">{review.comment}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  )
}
