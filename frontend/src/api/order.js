import api from './axiosInstance'

export const createOrder = (data) => api.post('/orders', data)
export const getOrders = () => api.get('/orders')
export const getOrderById = (id) => api.get(`/orders/${id}`)
export const submitPayment = (orderId, data) => api.post(`/orders/${orderId}/payment`, data)
