import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  exportProductsCsv,
  importProductsCsv,
} from '../../api/product'
import api from '../../api/axiosInstance'

const EMPTY_FORM = {
  name: '',
  description: '',
  categoryId: '',
  price: '',
  discountPrice: '',
  stock: '',
  sku: '',
  material: '',
  sizes: '',
  colors: '',
}

export default function AdminProducts() {
  const { user } = useSelector(state => state.auth)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [variantProduct, setVariantProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [variantForm, setVariantForm] = useState({ size: '', color: '', stock: 0 })
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'manager'

  useEffect(() => {
    if (!isAdmin) return
    fetchProducts()
    fetchCategories()
  }, [page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts({ page, limit: 20 })
      setProducts(response.data.data.items || [])
      setTotalPages(response.data.data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const resetForm = () => {
    setFormData(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      categoryId: product.categoryId?._id || product.categoryId || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      stock: product.stock ?? '',
      sku: product.sku || '',
      material: product.material || '',
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      stock: parseInt(formData.stock, 10) || 0,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      resetForm()
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product')
    }
  }

  const openVariants = async (product) => {
    setVariantProduct(product)
    setVariantForm({ size: '', color: '', stock: 0 })
    try {
      const response = await getProductVariants(product._id)
      setVariants(response.data.data || [])
    } catch (error) {
      console.error('Error fetching variants:', error)
    }
  }

  const closeVariants = () => {
    setVariantProduct(null)
    setVariants([])
  }

  const handleCreateVariant = async (e) => {
    e.preventDefault()
    try {
      await createProductVariant(variantProduct._id, {
        size: variantForm.size || undefined,
        color: variantForm.color || undefined,
        stock: parseInt(variantForm.stock, 10) || 0,
      })
      setVariantForm({ size: '', color: '', stock: 0 })
      const response = await getProductVariants(variantProduct._id)
      setVariants(response.data.data || [])
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create variant')
    }
  }

  const handleUpdateVariantStock = async (variant, stock) => {
    try {
      await updateProductVariant(variantProduct._id, variant._id, { stock })
      const response = await getProductVariants(variantProduct._id)
      setVariants(response.data.data || [])
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update variant')
    }
  }

  const handleDeleteVariant = async (variant) => {
    if (!confirm('Delete this variant?')) return
    try {
      await deleteProductVariant(variantProduct._id, variant._id)
      const response = await getProductVariants(variantProduct._id)
      setVariants(response.data.data || [])
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete variant')
    }
  }

  const handleExport = async () => {
    try {
      const response = await exportProductsCsv()
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `products-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to export products')
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setImporting(true)
      setImportResult(null)
      const response = await importProductsCsv(file)
      setImportResult(response.data.data)
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to import products')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  if (!isAdmin) {
    return <div className="p-6 text-red-600 font-semibold">Access denied</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            ⬇ Export CSV
          </button>
          <label className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
            {importing ? 'Importing...' : '⬆ Import CSV'}
            <input type="file" accept=".csv" onChange={handleImport} disabled={importing} className="hidden" />
          </label>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {importResult && (
        <div className={`mb-6 p-4 rounded-lg ${importResult.failed > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
          <p className="font-semibold">
            Import complete: {importResult.created} created, {importResult.updated} updated, {importResult.failed} failed
          </p>
          {importResult.errors.length > 0 && (
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {importResult.errors.map((err, idx) => (
                <li key={idx}>Line {err.line}: {err.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  disabled={!!editingId}
                  className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Price (৳)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Discount Price (৳)</label>
                <input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  min="0"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Base Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  min="0"
                  className="w-full border px-3 py-2 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Ignored once size/color variants are added below.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="S, M, L, XL"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Colors (comma separated)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Black, Navy"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded h-20"
                />
              </div>
            </div>

            <button type="submit" className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {editingId ? 'Save Changes' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      {variantProduct && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Variants: {variantProduct.name}</h3>
            <button onClick={closeVariants} className="text-gray-500 hover:text-gray-800">Close</button>
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="py-2">Size</th>
                <th className="py-2">Color</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.length === 0 ? (
                <tr><td colSpan="4" className="py-4 text-gray-500 text-sm">No variants yet.</td></tr>
              ) : (
                variants.map((v) => (
                  <tr key={v._id} className="border-b text-sm">
                    <td className="py-2">{v.size || '-'}</td>
                    <td className="py-2">{v.color || '-'}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={v.stock}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value, 10)
                          if (!Number.isNaN(val) && val !== v.stock) handleUpdateVariantStock(v, val)
                        }}
                        className="w-20 border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="py-2">
                      <button onClick={() => handleDeleteVariant(v)} className="text-red-600 hover:text-red-800 font-semibold">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <form onSubmit={handleCreateVariant} className="flex gap-2 items-end">
            <div>
              <label className="block text-xs font-semibold mb-1">Size</label>
              <input
                type="text"
                value={variantForm.size}
                onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
                className="border px-2 py-1 rounded w-24"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Color</label>
              <input
                type="text"
                value={variantForm.color}
                onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                className="border px-2 py-1 rounded w-24"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={variantForm.stock}
                onChange={(e) => setVariantForm({ ...variantForm, stock: e.target.value })}
                required
                className="border px-2 py-1 rounded w-20"
              />
            </div>
            <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add Variant
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price (৳)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm">{product.sku}</td>
                  <td className="px-6 py-4 text-sm">{product.price}</td>
                  <td className="px-6 py-4 text-sm">
                    {product.trackVariantStock ? (
                      <span className="text-gray-500 italic">per variant</span>
                    ) : product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 font-semibold">
                      Edit
                    </button>
                    <button onClick={() => openVariants(product)} className="text-purple-600 hover:text-purple-800 font-semibold">
                      Variants
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 font-semibold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found</td></tr>
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
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
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
