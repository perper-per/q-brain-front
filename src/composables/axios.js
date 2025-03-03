import axios from 'axios'

// baseURL = http://localhost:4000
// axios.post('/user')
// axios.post('/user/login')
// ===============
// baseURL = x
// axios.post('http://localhost:4000/user')
// axios.post('http://localhost:4000/user/login')

// 創建基礎 API 實例
const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:4000',
  withCredentials: true,
})

// 創建認證 API 實例
const apiAuth = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:4000',
  withCredentials: true,
})

// 為 apiAuth 添加令牌攔截器
apiAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 錯誤處理攔截器
apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 錯誤:', error.response?.data || error.message || error)
    return Promise.reject(error)
  },
)

// 導出 axios 實例，避免使用 Vue 相關函數
export { api, apiAuth }

// 為兼容現有代碼，也提供 composable 函數
export function useAxios() {
  return { api, apiAuth }
}
