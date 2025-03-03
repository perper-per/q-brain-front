import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import zhTW from '../i18n/zh-TW'
import enUS from '../i18n/en-US'

// 創建 i18n 實例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en-US',
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    'zh-TW': zhTW,
    'en-US': enUS,
  },
  missing: (locale, key) => {
    console.warn(`Missing translation: ${locale} ${key}`)
    return key
  },
})

// 使用 boot 包裝
export default boot(({ app }) => {
  app.use(i18n)
})

// 導出 i18n 實例供其他地方使用
export { i18n }
