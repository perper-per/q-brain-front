import { boot } from 'quasar/wrappers'
import axios from 'axios'

// 設置 API 基本 URL
const api = axios.create({
  baseURL: import.meta.env.API_URL,
  withCredentials: true,
})

// 請求攔截器 - 添加認證令牌
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 響應攔截器 - 處理常見錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 可以在這裡處理認證失敗，例如重定向到登入頁面
      localStorage.removeItem('token')
      // 如果使用 router，可以重定向：
      // router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default boot(({ app }) => {
  // 將 axios 實例掛載到全局 Vue 上
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
