import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  tags: '',
  status: 'draft',
}

export default function Blog() {
  const { user } = useSelector((state) => state.adminAuth)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const authHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } }
  const isAuthorized = user?.role === 'super_admin'

  useEffect(() => {
    if (!isAuthorized) return
    fetchPosts()
  }, [page])

  if (!isAuthorized) {
    return <div className="p-6 text-center text-red-600">Access denied</div>
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/blog/admin/all?page=${page}&limit=10`, authHeaders)
      setPosts(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateForm = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setShowForm(true)
  }

  const openEditForm = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/blog/${id}`, authHeaders)
      const post = response.data.data
      setEditingId(id)
      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        featuredImage: post.featuredImage || '',
        category: post.category || '',
        tags: (post.tags || []).join(', '),
        status: post.status,
      })
      setShowForm(true)
    } catch (error) {
      alert('Failed to load post')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/blog/${editingId}`, payload, authHeaders)
        alert('Post updated')
      } else {
        await axios.post(`${API_BASE}/blog`, payload, authHeaders)
        alert('Post created')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData(emptyForm)
      fetchPosts()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save post')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      await axios.delete(`${API_BASE}/blog/${id}`, authHeaders)
      fetchPosts()
    } catch (error) {
      alert('Failed to delete post')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <button
          onClick={() => (showForm ? setShowForm(false) : openCreateForm())}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Style Tips"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Featured Image URL</label>
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full border px-3 py-2 rounded h-16"
                placeholder="Short summary shown on the blog list..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Content (HTML)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded h-64 font-mono text-sm"
                placeholder="<p>Post content...</p>"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="fashion, summer, trends"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Post' : 'Create Post'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Published</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-sm">{post.title}</td>
                  <td className="px-6 py-4 text-sm">{post.category || '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <button
                      onClick={() => openEditForm(post._id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No blog posts found
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
