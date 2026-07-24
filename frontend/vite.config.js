import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_API_URL = 'http://localhost:5001/api'

// Derives the proxy target origin from VITE_API_URL, which includes the /api path.
const resolveProxyTarget = (apiUrl) => {
  let parsed
  try {
    parsed = new URL(apiUrl)
  } catch {
    parsed = null
  }

  // Reject non-http(s) input; "localhost:5001" parses but yields a null origin.
  if (!parsed || (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')) {
    throw new Error(
      `Invalid VITE_API_URL: "${apiUrl}". Expected an absolute http(s) URL, e.g. ${DEFAULT_API_URL}`
    )
  }

  return parsed.origin
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: resolveProxyTarget(env.VITE_API_URL || DEFAULT_API_URL),
          changeOrigin: true,
        }
      }
    }
  }
})
