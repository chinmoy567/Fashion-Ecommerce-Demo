import api from './axiosInstance'

export const registerCustomer = (data) => api.post('/auth/register', data)
export const verifyEmail = (data) => api.post('/auth/verify-email', data)
export const loginCustomer = (data) => api.post('/auth/login', data)
export const loginStaff = (data) => api.post('/auth/staff-login', data)
export const refreshToken = () => api.post('/auth/refresh')
export const logoutCustomer = () => api.post('/auth/logout')
