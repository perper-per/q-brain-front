import { route } from 'quasar/wrappers'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '../stores/userStore'
import { i18n } from '../boot/i18n.js'

export default route(() => {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory(process.env.VUE_ROUTER_BASE),
  })

  // View Transition API
  if (document.startViewTransition) {
    Router.beforeResolve((to, from) => {
      if (to.path === from.path) return

      return new Promise((resolve) => {
        // 獲取滑鼠位置
        const x = window.mouseX || window.innerWidth / 2
        const y = window.mouseY || window.innerHeight / 2

        // 設置 CSS 變量
        document.documentElement.style.setProperty('--pointerX', `${x}px`)
        document.documentElement.style.setProperty('--pointerY', `${y}px`)

        document.startViewTransition(async () => {
          resolve()
        })
      })
    })
  }

  // 路由前置守衛 - 更新重定向
  Router.beforeEach((to, from, next) => {
    const user = useUserStore()

    // 需要登入的頁面
    if (to.meta.requiresAuth) {
      if (!user.isLoggedIn) {
        next({
          name: 'login',
          query: { redirect: to.fullPath }, // 添加重定向信息
        })
      } else {
        next()
      }
    }
    // 管理員頁面
    else if (to.meta.requiresAdmin) {
      if (!user.isAdmin) {
        next({ name: 'home' })
      } else {
        next()
      }
    }
    // 登入頁面的特殊處理
    else if (to.name === 'login' && user.isLoggedIn) {
      // 如果已登入且訪問登入頁，重定向到首頁或指定的重定向頁面
      next(to.query.redirect || { name: 'home' })
    }
    // 公開頁面直接放行
    else {
      next()
    }
  })

  // 路由後置守衛 - 處理頁面標題
  Router.afterEach((to) => {
    // 確保 to.meta.title 存在
    const title = to.meta.title ? i18n.global.t(to.meta.title) : i18n.global.t('nav.home')
    document.title = title
  })

  return Router
})
