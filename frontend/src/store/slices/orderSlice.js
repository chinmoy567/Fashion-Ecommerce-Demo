import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload)
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(order => order._id === action.payload._id)
      if (index !== -1) {
        state.orders[index] = action.payload
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setOrders, setSelectedOrder, addOrder, updateOrder, setLoading } = orderSlice.actions
export default orderSlice.reducer
