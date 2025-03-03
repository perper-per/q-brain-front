<template>
  <q-page class="dashboard-page">
    <!-- 添加調試組件 -->
    <!-- <DebugInfo /> -->

    <div class="dashboard-container q-pa-md">
      <div class="row q-col-gutter-md">
        <!-- 用戶資訊卡片 -->
        <div class="col-12 col-md-4">
          <q-card class="user-info-card">
            <q-card-section>
              <div class="text-h6">{{ $t('dashboard.welcome') }}</div>
              <div class="text-subtitle2">{{ user.username }}</div>
            </q-card-section>
            <q-card-section>
              <div class="text-body2">
                <div class="q-mb-sm">{{ $t('user.email') }}: {{ user.email }}</div>
                <div>{{ $t('dashboard.joinDate') }}: {{ formatDate(user.createdAt || new Date()) }}</div>
                <!-- 顯示當前角色 -->
                <div>角色: {{ user.role === 1 ? '管理員' : '普通用戶' }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 統計資訊 -->
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-4">
              <q-card class="stats-card" clickable @click="$router.push('/site/notes')">
                <q-card-section>
                  <div class="text-h6">{{ $t('dashboard.notes') }}</div>
                  <div class="text-h4">
                    <template v-if="noteStore.loading">
                      <q-spinner color="white" size="1.5em" /> 載入中...
                    </template>
                    <template v-else>
                      {{ Array.isArray(noteStore.notes) ? noteStore.notes.length : 0 }}
                    </template>
                  </div>
                </q-card-section>
                <q-card-section class="text-right">
                  <q-icon name="arrow_forward" />
                </q-card-section>
              </q-card>
            </div>

            <!-- 硬編碼條件: 如果用戶名符合管理員就顯示 -->
            <div class="col-6 col-md-8 admin-button-container"
                v-if="['admin', 'asdf', 'aaaa'].includes(user.username) || user.role === 1">
              <q-btn
                to="/admin"
                color="secondary"
                icon="admin_panel_settings"
                label="管理後台"
                class="admin-btn"
                no-caps
                unelevated
              />
            </div>
          </div>
        </div>

        <!-- 波浪編輯器 -->
        <div class="col-12 col-md-4">
          <WaveEditor @update-wave="updateWave" />
        </div>
      </div>
    </div>

    <!-- 背景 SVG -->
    <div class="background-wave">
      <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 590" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150">
        <defs>
          <linearGradient id="gradient" x1="96%" y1="30%" x2="4%" y2="70%">
            <stop offset="5%" :stop-color="waveSettings.color1"></stop>
            <stop offset="95%" :stop-color="waveSettings.color2"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,600 L 0,112 C 69.88291605301914,117.09517673048602 139.7658321060383,122.19035346097203 194,139 C 248.2341678939617,155.80964653902797 286.819587628866,184.33376288659795 349,165 C 411.180412371134,145.66623711340205 496.95581737849784,78.47459499263621 563,71 C 629.0441826215022,63.52540500736378 675.3571428571429,115.76785714285714 726,128 C 776.6428571428571,140.23214285714286 831.6156111929308,112.4539764359352 890,107 C 948.3843888070692,101.5460235640648 1010.180412371134,118.41623711340208 1066,126 C 1121.819587628866,133.58376288659792 1171.662739322533,131.88107511045655 1233,128 C 1294.337260677467,124.11892488954344 1367.1686303387335,118.05946244477173 1440,112 L 1440,600 L 0,600 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          :fill-opacity="waveSettings.opacity / 100"
          class="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
        <path
          d="M 0,600 L 0,262 C 66.81664212076585,260.9931885125184 133.6332842415317,259.9863770250368 193,269 C 252.3667157584683,278.0136229749632 304.2835051546391,297.0476804123711 362,291 C 419.7164948453609,284.9523195876289 483.2326951399117,253.82290132547865 547,259 C 610.7673048600883,264.17709867452135 674.7857142857143,305.66071428571433 737,316 C 799.2142857142857,326.33928571428567 859.6244477172311,305.5342415316642 919,288 C 978.3755522827689,270.4657584683358 1036.7164948453608,256.20231958762884 1090,265 C 1143.2835051546392,273.79768041237116 1191.5095729013256,305.6564801178203 1249,309 C 1306.4904270986744,312.3435198821797 1373.2452135493372,287.1717599410898 1440,262 L 1440,600 L 0,600 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          :fill-opacity="(waveSettings.opacity + 13) / 100"
          class="transition-all duration-300 ease-in-out delay-150 path-1"
        ></path>
        <path
          d="M 0,600 L 0,412 C 78.58394698085422,402.3028350515464 157.16789396170844,392.60567010309285 211,376 C 264.83210603829156,359.39432989690715 293.9123711340206,335.8801546391752 348,359 C 402.0876288659794,382.1198453608248 481.18262150220926,451.87371134020617 543,461 C 604.8173784977907,470.12628865979383 649.3571428571428,418.625 705,393 C 760.6428571428572,367.375 827.3888070692195,367.62628865979383 891,384 C 954.6111929307805,400.37371134020617 1015.0876288659792,432.86984536082474 1082,427 C 1148.9123711340208,421.13015463917526 1222.2606774668632,376.8943298969072 1283,368 C 1343.7393225331368,359.1056701030928 1391.8696612665685,385.55283505154637 1440,412 L 1440,600 L 0,600 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          :fill-opacity="(waveSettings.opacity + 60) / 100"
          class="transition-all duration-300 ease-in-out delay-150 path-2"
        ></path>
      </svg>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useNoteStore } from '../stores/noteStore'
import { useI18n } from 'vue-i18n'
import { date } from 'quasar'
import WaveEditor from '../components/WaveEditor.vue'
// import DebugInfo from '../components/DebugInfo.vue'
import UserRole from '../enums/UserRole'

const { t: $t } = useI18n()
const user = useUserStore()
const noteStore = useNoteStore()

const waveSettings = ref({
  color1: '#f78da7',
  color2: '#fcb900',
  opacity: 40
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return date.formatDate(dateString, 'YYYY/MM/DD')
  } catch (error) {
    console.error('Date formatting error:', error)
    return '-'
  }
}

onMounted(async () => {
  console.log('DashBoard mounted, user role:', user.role, typeof user.role)
  console.log('UserRole.ADMIN:', UserRole.ADMIN, typeof UserRole.ADMIN)

  // 從 localStorage 加載波浪設置
  const savedSettings = localStorage.getItem('waveSettings')
  if (savedSettings) {
    waveSettings.value = JSON.parse(savedSettings)
  }

  // 載入便條數據
  try {
    if (user.isLoggedIn) {  // 確保用戶已登入
      console.log('準備載入便條...')
      await noteStore.loadNotes()
      console.log('便條載入完成:', noteStore.notes ? noteStore.notes.length : 'undefined')
    }
  } catch (error) {
    console.error('載入便條失敗:', error)
  }
})

const updateWave = (settings) => {
  waveSettings.value = settings
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.background-wave {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 0;
  pointer-events: none;
}

.user-info-card,
.stats-card {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.user-info-card:hover,
.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.stats-card {
  background: linear-gradient(135deg, var(--color-primary) 50%, var(--color-primary-dark) 70%);
  color: white;
}

// 深色模式下的顏色調整
.dark {
  --wave-color-1: #2c3e50;
  --wave-color-2: #3498db;

  .user-info-card,
  .stats-card {
    background: rgba(30, 30, 30, 0.8);
  }
}

.admin-button-container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.admin-btn {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
}
</style>
