import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  toast: null,
  loading: false,
  modals: {
    isAuthModalOpen: false,
    isCartModalOpen: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload
    },
    hideToast: (state) => {
      state.toast = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false
    },
  },
})

export const { showToast, hideToast, setLoading, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer
