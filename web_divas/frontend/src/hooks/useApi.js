// useApi.js
// Returns an axios instance pre-configured with:
//   - base URL from env
//   - Firebase ID token in Authorization header (auto-refreshed)
// Why axios over fetch? Interceptors make token injection clean and DRY.

import axios from 'axios'
import { auth } from '../firebase'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
// Ensure the URL ends with /api
const FINAL_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`

export function useApi() {
  const instance = axios.create({ baseURL: FINAL_URL })

  // Request interceptor: attach fresh token before every call
  instance.interceptors.request.use(async (config) => {
    const currentUser = auth.currentUser
    if (currentUser) {
      // getIdToken(true) forces refresh if token is stale
      const token = await currentUser.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return instance
}
