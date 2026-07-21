import api from './axiosInstance'

export const getCart = () => api.get('/cart')
export const addToCart = (data) => api.post('/cart/add', data)
export const updateCartItem = (productId, data) => api.put(`/cart/update/${productId}`, data)
export const removeFromCart = (productId, variantId) => api.delete(`/cart/remove/${productId}`, { params: variantId ? { variantId } : undefined })
