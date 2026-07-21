import { Provider } from 'react-redux'
import store from './store/store'
import { Router } from './router'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <Provider store={store}>
      <Router />
      <Toaster position="top-right" richColors />
    </Provider>
  )
}
