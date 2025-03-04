<template>
  <q-layout>
    <!-- 桌面版和手機版通用的頂部導航欄 - 使用全局主題變量 -->
    <q-header class="main-header header-z-index fixed-header" bordered>
      <q-toolbar class="header-toolbar">
        <!-- 左側標題/LOGO -->
        <q-toolbar-title @click="goHome" class="cursor-pointer">
          <!-- 在小屏幕上隱藏完整標題 -->
          <span v-if="!$q.screen.lt.sm">{{ $t('nav.title') }}</span>
          <!-- 在小屏幕上顯示縮寫標題或LOGO -->
          <span v-else class="text-h6">
            {{ $t('nav.shortTitle') || $t('nav.title').substring(0, 3) }}
          </span>
        </q-toolbar-title>

        <q-space />

        <!-- 桌面版導航選項 (在手機版中隱藏) -->
        <div v-if="!$q.screen.lt.md" class="desktop-nav">
          <template v-if="!user.isLoggedIn">
            <q-btn
              flat
              :label="$t('nav.login')"
              :to="'/site/login'"
            />
          </template>
          <template v-else>
            <q-btn flat>
              <q-avatar size="sm" class="q-mr-sm">
                <Avatar :size="25" variant="beam" :name="user.username" :title="true" :colors="colors" />
              </q-avatar>
              {{ displayName }}
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable @click="handleLogout">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="logout" size="sm" class="q-mr-sm" />
                        {{ $t('nav.logout') }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    :to='"/site/dashboard"'
                  >
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="dashboard" size="sm" class="q-mr-sm" />
                        {{ $t('nav.dashboard') }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-if="user.role === 'admin'"
                    clickable
                    :to="{ name: 'admin' }"
                  >
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="admin_panel_settings" size="sm" class="q-mr-sm" />
                        {{ $t('nav.admin') }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>

          <!-- 語言選擇器 - 桌面版 -->
          <q-btn-dropdown flat icon="translate">
            <q-list>
              <q-item
                v-for="lang in langs"
                :key="lang.value"
                clickable
                v-close-popup
                @click="$i18n.locale = lang.value"
              >
                <q-item-section>
                  <q-item-label>{{ lang.text }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <ThemeToggle />
        </div>

        <!-- 手機版菜單按鈕 (僅在小屏幕上顯示) -->
        <div class="mobile-menu-btn">
          <q-btn
            v-if="$q.screen.lt.md"
            dense
            flat
            round
            icon="menu"
            @click="toggleRightDrawer"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- 右側抽屜導航 (僅用於手機版) -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      elevated
      :width="mobileDrawerWidth"
      class="mobile-drawer"
    >
      <!-- 手機抽屜標題 -->
      <q-toolbar class="drawer-header">
        <q-toolbar-title>
          {{ $t('nav.menu') }}
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          @click="rightDrawerOpen = false"
        />
      </q-toolbar>

      <!-- 抽屜導航內容 -->
      <q-list>
        <!-- 返回前言按鈕 (只在特定路由顯示) -->
        <q-item
          v-if="$route.path !== '/'"
          clickable
          @click="goToPreface"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon name="fas fa-dove" />
          </q-item-section>
          <q-item-section>
            {{ $t('preface.return') }}
          </q-item-section>
        </q-item>

        <q-separator v-if="$route.path !== '/'" />

        <!-- 未登入時顯示登入選項 -->
        <template v-if="!user.isLoggedIn">
          <q-item clickable :to="{ name: 'login' }" v-close-popup>
            <q-item-section avatar>
              <q-icon name="login" />
            </q-item-section>
            <q-item-section>
              {{ $t('nav.login') }}
            </q-item-section>
          </q-item>
        </template>

        <!-- 已登入用戶選項 -->
        <template v-else>
          <!-- 用戶訊息 -->
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <Avatar :size="40" variant="beam" :name="user.username" :title="true" :colors="colors" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ displayName }}</q-item-label>
              <q-item-label caption>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- 儀表板 -->
          <q-item clickable :to="{ name: 'dashboard' }" v-close-popup>
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              {{ $t('nav.dashboard') }}
            </q-item-section>
          </q-item>

          <!-- 僅管理員可見的菜單項 -->
          <q-item
            v-if="user.role === 'admin'"
            clickable
            :to="{ name: 'admin' }"
            v-close-popup
          >
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" />
            </q-item-section>
            <q-item-section>
              {{ $t('nav.admin') }}
            </q-item-section>
          </q-item>

          <!-- 登出選項 -->
          <q-item clickable @click="handleLogout" v-close-popup>
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              {{ $t('nav.logout') }}
            </q-item-section>
          </q-item>
        </template>

        <q-separator />

        <!-- 語言選擇 -->
        <q-item-label header>{{ $t('nav.language') }}</q-item-label>
        <q-item
          v-for="lang in langs"
          :key="lang.value"
          clickable
          @click="changeLanguage(lang.value)"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon name="translate" />
          </q-item-section>
          <q-item-section>
            {{ lang.text }}
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- 主題切換 -->
        <q-item>
          <q-item-section avatar>
            <q-icon name="brightness_medium" />
          </q-item-section>
          <q-item-section>
            {{ $t('nav.theme') }}
          </q-item-section>
          <q-item-section side>
            <ThemeToggle />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- 頁面容器 -->
    <q-page-container data-scroll-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import Avatar from "vue-boring-avatars"
import ThemeToggle from 'components/ThemeToggle.vue'
import { useLocomotiveScroll } from 'src/composables/useLocomotiveScroll'

const router = useRouter()
const { t, locale } = useI18n()
const user = useUserStore()
const $q = useQuasar()
const { initLocomotiveScroll, destroyLocomotiveScroll } = useLocomotiveScroll()

let locomotiveInstance = null

const displayName = computed(() => user.username?.toLowerCase())
const colors = ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]

const rightDrawerOpen = ref(false)

// 抽屜寬度 - 確保返回數字而非字串
const mobileDrawerWidth = computed(() => {
  // 返回數字，而不是帶單位的字串
  return $q.screen.lt.sm ? 280 : 280
})

function goHome() {
  router.push('/site')
  rightDrawerOpen.value = false // 導航後關閉側邊欄
}

const changeLanguage = (lang) => {
  locale.value = lang
}

const handleLogout = async () => {
  try {
    await user.logout()
    $q.notify({
      type: 'positive',
      message: t('logout.success'),
      position: 'top'
    })
    router.push('/site/login')
    rightDrawerOpen.value = false // 登出後關閉側邊欄
  } catch (error) {
    console.error('Logout error:', error)
    $q.notify({
      type: 'negative',
      message: t('logout.error'),
      position: 'top'
    })
  }
}

const langs = [
  {
    text: '繁體中文',
    value: 'zh-TW'
  },
  {
    text: 'English',
    value: 'en-US'
  }
]

// 確保當屏幕尺寸變大時關閉抽屜
watch(() => $q.screen.name, (newScreenSize) => {
  if (newScreenSize === 'md' || newScreenSize === 'lg' || newScreenSize === 'xl') {
    rightDrawerOpen.value = false
  }
})

// 導航變化時更新 Locomotive Scroll
router.afterEach(() => {
  // 小延遲確保 DOM 已更新
  setTimeout(() => {
    if (locomotiveInstance) {
      locomotiveInstance.update()
    }
    rightDrawerOpen.value = false // 路由變化後關閉側邊欄
  }, 100)
})

onMounted(() => {
  // 初始化 Locomotive Scroll
  locomotiveInstance = initLocomotiveScroll()

  // 將實例暴露到全局以便於調試
  window.locomotiveScroll = locomotiveInstance

  console.log('元件掛載，目前螢幕類型:', $q.screen.name)
  console.log('是否為行動裝置:', $q.screen.lt.md)

  // 監聽螢幕變化
  window.addEventListener('resize', () => {
    console.log('螢幕大小變化，目前螢幕類型:', $q.screen.name)
    console.log('是否為行動裝置:', $q.screen.lt.md)
  })

  // 添加全局樣式規則以覆蓋所有下拉選單
  const style = document.createElement('style')
  style.innerHTML = `
    body.body--dark .q-menu,
    body.body--dark .q-popover,
    body.body--dark .q-tooltip {
      background-color: #1d1d1d !important;
      color: #ffffff !important;
    }

    body.body--dark .q-menu *,
    body.body--dark .q-popover *,
    body.body--dark .q-tooltip * {
      background-color: #1d1d1d !important;
    }
  `
  document.head.appendChild(style)
})

onBeforeUnmount(() => {
  destroyLocomotiveScroll()
})

// 返回前言页面
const goToPreface = () => {
  router.push('/')
  rightDrawerOpen.value = false
}

// 切換右側抽屜（修復版本）
const toggleRightDrawer = () => {
  console.log('選單按鈕點擊，目前抽屜狀態:', rightDrawerOpen.value)
  // 直接切換狀態
  rightDrawerOpen.value = !rightDrawerOpen.value
  console.log('抽屜新狀態:', rightDrawerOpen.value)
}
</script>

<style lang="scss" scoped>

body .q-layout .q-page-container {
  padding-top: 0px !important;
  min-height: calc(100vh - 50px);
}

.fixed-header {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 7000 !important;
  width: 100% !important;
  height: 50px !important;
}

/* 使用全局變量的頂部導航欄樣式 */
.main-header {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.2) !important;
  color: var(--color-text);
  border: none !important;
  box-shadow: none !important;

  .q-btn {
    color: var(--color-text);
  }

  .q-toolbar__title {
    color: var(--color-text);
  }

  /* 確保沒有其他元素添加背景色 */
  .q-toolbar, .q-toolbar__content {
    background: transparent !important;
  }
}

/* 確保在暗模式下的樣式適配 */
body.body--dark {
  /* 下拉選單背景 - 加強選擇器和優先級 */
  .q-menu,
  .q-popover,
  .q-tooltip,
  .q-select__menu,
  .q-dropdown__menu,
  .q-btn-dropdown__menu {
    background-color: #1d1d1d !important;
    color: #ffffff !important;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3) !important;

    /* 確保所有子元素也使用正確的背景色 */
    .q-item,
    .q-list,
    .q-item__section,
    .q-list__container,
    .q-virtual-scroll__content,
    div, span {
      background-color: #1d1d1d !important;
      color: inherit !important;
    }

    /* 針對 hover 狀態 */
    .q-item:hover,
    .q-manual-focusable--focused {
      background-color: #333333 !important;
    }
  }

  /* 移動抽屜背景 */
  .mobile-drawer,
  .q-drawer__content,
  .q-list,
  .q-item {
    background-color: var(--q-dark) !important;
    color: var(--q-dark-text) !important;
  }

  /* 頂部菜單背景 - 降低不透明度 */
  .main-header {
    background: rgba(30, 30, 30, 0.2) !important;
    border: none !important;
    box-shadow: none !important;
  }
}

.header-toolbar {
  min-height: 50px;
  padding: 0 12px;

  /* 移動端標題調整 */
  .q-toolbar__title {
    font-size: 1.25rem;

    @media (max-width: 599px) {
      font-size: 1.1rem;
    }
  }
}

/* 抽屜導航樣式 */
.mobile-drawer {
  overflow: hidden !important;

  /* 隱藏所有滾動軸 */
  &::-webkit-scrollbar,
  & *::-webkit-scrollbar {
    display: none !important;
  }

  .q-drawer__content {
    overflow: hidden !important;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      display: none !important;
    }
  }

  .q-list {
    overflow-y: auto;
    max-height: calc(100vh - 50px);
    padding-bottom: 60px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      display: none !important;
    }
  }

  .q-item {
    overflow: hidden;
  }
}

/* 抽屜頂部標題欄 */
.drawer-header {
  background-color: var(--q-primary);
  color: white;
}

/* 右抽屜選項和列表樣式 */
.q-drawer .q-item {
  color: var(--color-text);
}

.q-drawer .q-item-label {
  color: var(--color-text);
}

.q-drawer .q-item-label--header {
  color: var(--color-primary);
}

.drawer-content {
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  padding-top: 50px; /* 為 header 預留空間 */
}

/* 確保菜單和對話框在最上層 */
.q-menu,
.q-dialog,
.q-popup-edit {
  z-index: 7001 !important; /* 高於 header */
}

/* 移除可能影響布局的樣式 */
:deep(.q-layout) {
  min-height: 100vh;
}

:deep(.q-drawer--left) {
  top: 0 !important;
  z-index: 6000 !important; /* 與 floating-drawer 一致 */
}

/* 手機版特定樣式 */
@media (max-width: 599px) {
  .header-toolbar {
    padding: 0 8px;
  }

  .q-btn {
    padding: 4px 6px;
  }
}

/* 手機版抽屜特定樣式 */
@media (min-width: 1024px) {
  /* 確保在桌面版上抽屜始終隱藏 */
  .mobile-drawer {
    display: none !important;
  }
}

/* 确保菜单按钮可见 */
.mobile-menu-btn {
  z-index: 8000 !important;
  position: relative;
}

/* 调试用的样式 - 突出显示抽屉边缘 */
.q-drawer {
  border-left: 2px solid var(--q-primary) !important;
}

/* 抽屉内容 */
.q-drawer__content {
  background: var(--color-background) !important;
}

/* 桌面導航樣式 */
.desktop-nav {
  display: flex;
  align-items: center;

  .q-btn {
    margin-left: 8px;
  }
}

/* 全局應用於所有下拉選單的樣式 */
.q-menu {
  overflow: hidden !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;

  &::-webkit-scrollbar,
  & *::-webkit-scrollbar {
    display: none !important;
  }
}

/* 添加一個微妙的邊框，以便在淺色背景上能夠看出導航欄 */
.main-header:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right,
    rgba(var(--color-primary-rgb), 0),
    rgba(var(--color-primary-rgb), 0.1),
    rgba(var(--color-primary-rgb), 0));
}
</style>
