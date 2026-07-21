import api from './axiosInstance'

export const getProducts = (params) => api.get('/products', { params })
export const getProductById = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)
export const getFilterMetadata = () => api.get('/products/filters/metadata')
export const getRelatedProducts = (id, limit) => api.get(`/products/${id}/related`, { params: limit ? { limit } : undefined })

export const getProductVariants = (productId) => api.get(`/products/${productId}/variants`)
export const createProductVariant = (productId, data) => api.post(`/products/${productId}/variants`, data)
export const updateProductVariant = (productId, variantId, data) => api.put(`/products/${productId}/variants/${variantId}`, data)
export const deleteProductVariant = (productId, variantId) => api.delete(`/products/${productId}/variants/${variantId}`)

export const exportProductsCsv = () => api.get('/products/export/csv', { responseType: 'blob' })
export const importProductsCsv = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/products/import/csv', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
