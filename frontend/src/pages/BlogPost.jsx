import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setNotFound(false)
      const response = await axios.get(`${API_BASE}/blog/slug/${slug}`)
      setPost(response.data.data)
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true)
      } else {
        console.error('Error fetching blog post:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-muted-foreground">Loading...</div>
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-gold hover:text-gold-light transition-colors">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-12"
    >
      <Link to="/blog" className="text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1.5 w-fit">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
      </Link>

      {post.category && (
        <span className="block text-xs font-semibold text-gold uppercase mt-6 tracking-wide">
          {post.category}
        </span>
      )}

      <h1 className="font-display text-4xl font-bold mt-2 mb-4 text-balance">{post.title}</h1>

      <p className="text-sm text-muted-foreground mb-6">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
        {post.author?.fullName ? ` · ${post.author.fullName}` : ''}
      </p>

      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full rounded-xl mb-8 max-h-96 object-cover ring-1 ring-white/10"
        />
      )}

      <div
        className="max-w-none text-foreground/90 leading-relaxed space-y-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_a]:text-gold [&_a]:underline [&_img]:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  )
}
