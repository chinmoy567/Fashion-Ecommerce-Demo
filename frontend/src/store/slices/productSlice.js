import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  filters: {
    category: null,
    search: '',
    page: 1,
    limit: 12,
  },
  pagination: {
    total: 0,
    pages: 0,
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.items
      state.pagination = action.payload.pagination
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },
    setPage: (state, action) => {
      state.filters.page = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setProducts, setSelectedProduct, setFilter, setPage, setLoading } = productSlice.actions
export default productSlice.reducer
