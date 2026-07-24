import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
})

// Add customer token to requests, unless the caller already set an Authorization
// header explicitly (e.g. admin-only product mutations use the admin token instead)
api.interceptors.request.use((config) => {
  if (config.headers.Authorization) {
    return config
  }
  const token = localStorage.getItem('customer_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only force a re-login when the customer's own token was rejected on an
    // authenticated request — not for public endpoints like /auth/login returning
    // 401 for bad credentials, and not for admin-scoped calls using admin_token.
    const authHeader = error.config?.headers?.Authorization
    const customerToken = localStorage.getItem('customer_token')
    const usedCustomerToken = Boolean(authHeader) && authHeader === `Bearer ${customerToken}`
    if (error.response?.status === 401 && usedCustomerToken) {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
