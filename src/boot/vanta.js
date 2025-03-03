import { boot } from 'quasar/wrappers'
import PrefacePage from '../pages/PrefacePage.vue'
// 移除未使用的導入
// import * as THREE from 'three'
// import BIRDS from 'vanta/dist/vanta.birds.min'

export default boot(async ({ app }) => {
  // 將來如果需要全局配置可以在這裡添加
  app.component('PrefacePage', PrefacePage)
})
