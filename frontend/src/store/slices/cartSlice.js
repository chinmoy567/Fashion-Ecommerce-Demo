import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
  loading: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.productId === action.payload.productId)
      if (item) {
        item.quantity = action.payload.quantity
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
    setCart: (state, action) => {
      state.items = action.payload.items || []
      state.total = action.payload.total || 0
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, setCart } = cartSlice.actions
export default cartSlice.reducer
