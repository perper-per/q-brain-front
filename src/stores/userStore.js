import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import UserRole from '../enums/UserRole.js'
import { api } from '../boot/axios'

export const useUserStore = defineStore(
  'user',
  () => {
    // 從 localStorage 初始化狀態
    const token = ref(localStorage.getItem('token') || '')
    const username = ref(localStorage.getItem('username') || '')
    const email = ref(localStorage.getItem('email') || '')
    const role = ref(Number(localStorage.getItem('role')) || UserRole.USER) // 確保是數字
    const isLoggingIn = ref(false)
    const id = ref(null)
    const createdAt = ref(null)
    const isLoggedIn = computed(() => token.value !== '')
    const isAdmin = computed(() => role.value === UserRole.ADMIN) // 使用枚舉值

    // 監聽狀態變化，自動更新 localStorage
    watch(token, (newToken) => {
      if (newToken) {
        localStorage.setItem('token', newToken)
      } else {
        localStorage.removeItem('token')
      }
    })

    watch(username, (newUsername) => {
      if (newUsername) {
        localStorage.setItem('username', newUsername)
      } else {
        localStorage.removeItem('username')
      }
    })

    watch(email, (newEmail) => {
      if (newEmail) {
        localStorage.setItem('email', newEmail)
      } else {
        localStorage.removeItem('email')
      }
    })

    watch(role, (newRole) => {
      if (newRole !== null && newRole !== undefined) {
        localStorage.setItem('role', newRole.toString())
      } else {
        localStorage.removeItem('role')
      }
    })

    // 方法
    const login = async (loginData) => {
      try {
        isLoggingIn.value = true
        const { data } = await api.post('/api/auth/login', {
          username: loginData.username,
          password: loginData.password,
        })

        console.log('登入響應數據:', data) // 添加調試日誌

        if (data.result) {
          token.value = data.result.token
          username.value = data.result.username.toLowerCase()
          email.value = data.result.email || ''

          // 強制轉換為數字並輸出日誌
          if (data.result.role !== undefined) {
            role.value = Number(data.result.role)
            console.log(`設置角色: ${role.value} (${typeof role.value})`)
          } else {
            // 從後端響應中找不到角色信息，嘗試基於用戶名設置
            if (['admin', 'asdf', 'aaaa'].includes(data.result.username.toLowerCase())) {
              role.value = 1 // 設置為管理員
              console.log(`基於用戶名 ${data.result.username} 設置為管理員`)
            } else {
              role.value = 0 // 設置為普通用戶
            }
          }

          id.value = data.result.id
          createdAt.value = data.result.createdAt
          isLoggedIn.value = true

          // 調試輸出
          console.log('登入後的用戶角色:', role.value, typeof role.value)
          console.log('是否管理員:', role.value === UserRole.ADMIN)
        }
      } catch (error) {
        console.error('登入錯誤:', error)
        throw error
      } finally {
        isLoggingIn.value = false
      }
    }

    const logout = () => {
      token.value = ''
      username.value = ''
      email.value = ''
      role.value = UserRole.USER // 使用枚舉值
    }

    const restoreUserSession = () => {
      try {
        // 先嘗試從獨立存儲中獲取角色
        const storedRole = localStorage.getItem('role')
        if (storedRole) {
          role.value = Number(storedRole)
          console.log(`從 localStorage 恢復角色: ${role.value}`)
        }

        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            id.value = userData.id
            username.value = userData.username
            email.value = userData.email

            // 如果 userData 有角色，則優先使用
            if (userData.role !== undefined) {
              role.value = Number(userData.role)
              console.log(`從 user 對象恢復角色: ${role.value}`)
            }
            // 如果依然沒有角色，基於用戶名設置
            else if (['admin', 'asdf', 'aaaa'].includes(username.value.toLowerCase())) {
              role.value = 1
              console.log(`基於用戶名 ${username.value} 設置為管理員`)
            }

            createdAt.value = userData.createdAt
            token.value = localStorage.getItem('token')
            isLoggedIn.value = !!token.value

            // 確保角色被正確存儲到 localStorage
            localStorage.setItem('role', role.value.toString())

            // 調試輸出
            console.log('已恢復的用戶數據:', {
              username: username.value,
              role: role.value,
              roleType: typeof role.value,
              isAdmin: role.value === UserRole.ADMIN,
            })
          } catch (error) {
            console.error('恢復用戶數據時出錯:', error)
            logout()
          }
        }
      } catch (error) {
        console.error('恢復用戶會話錯誤:', error)
      }
    }

    return {
      // 狀態
      token,
      username,
      email,
      role,
      isLoggingIn,
      // 計算屬性
      isLoggedIn,
      isAdmin,
      // 方法
      login,
      logout,
      restoreUserSession,
    }
  },
  {
    persist: true,
  },
)
