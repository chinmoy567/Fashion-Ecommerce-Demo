import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Skeleton } from '@/components/ui/skeleton'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const revealRef = useScrollReveal()

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/blog?page=${page}&limit=9`)
      setPosts(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">Stories</p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold mb-10">The Journal</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No blog posts yet.</div>
      ) : (
        <div ref={revealRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              data-reveal
              to={`/blog/${post.slug}`}
              className="group bg-card ring-1 ring-white/10 hover:ring-gold/40 rounded-xl transition-colors overflow-hidden flex flex-col"
            >
              {post.featuredImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                {post.category && (
                  <span className="text-xs font-semibold text-gold uppercase mb-2 tracking-wide">
                    {post.category}
                  </span>
                )}
                <h2 className="font-display text-lg font-semibold mb-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-muted-foreground text-sm flex-1">{post.excerpt}</p>
                )}
                <p className="text-xs text-muted-foreground/70 mt-4">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                  {post.author?.fullName ? ` · ${post.author.fullName}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
