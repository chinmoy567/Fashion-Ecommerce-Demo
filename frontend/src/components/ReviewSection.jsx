import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function ReviewSection() {
  const { id } = useParams()
  const { isAuthenticated } = useSelector(state => state.customerAuth)
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
      toast.warning('Please login to write a review')
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
          headers: { Authorization: `Bearer ${localStorage.getItem('customer_token')}` },
        }
      )
      toast.success('Review submitted! It will be visible after approval.')
      setFormData({ rating: 5, comment: '' })
      setShowReviewForm(false)
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />
      ))}
    </div>
  )

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
  }

  return (
    <div className="mt-16 border-t border-white/10 pt-10">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold mb-4">Customer Reviews</h2>

        <div className="mb-6 p-5 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-display font-bold">{averageRating}</span>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {isAuthenticated && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)} className="mb-6 bg-gold text-black hover:bg-gold-light">
            Write a Review
          </Button>
        )}

        <AnimatePresence>
          {showReviewForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmitReview}
              className="mb-6 p-5 bg-secondary/50 rounded-xl overflow-hidden"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full bg-secondary border border-white/10 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Very Poor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment (optional)</label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  maxLength={500}
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.comment.length}/500</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="bg-gold text-black hover:bg-gold-light">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="p-4 border border-white/10 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.customerId?.name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {renderStars(review.rating)}
              </div>
              {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  )
}
