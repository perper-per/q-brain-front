<template>
  <q-page class="page-container" data-scroll-container>
    <!-- <HalftoneWaves class="background-waves" /> -->
    <!-- Loading 遮罩 -->
    <div v-if="isLoading" class="loading-overlay">
      <h1 style="font-family: 'Dela Gothic One', cursive;">>>>>>>>>>>>>loading>>>>>>>>>>>>>>>>>>>>>>></h1>
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- 垂直導航列 -->
    <div v-show="!isLoading" class="vertical-nav">
      <div class="nav-links">
        <q-btn
          v-for="section in sections"
          :key="section.id"
          flat
          no-caps
          dense
          :label="section.title"
          @click="scrollToSection(section.id)"
          :class="{ 'active-nav': currentSection === sections.findIndex(s => s.id === section.id) }"
          :disable="isScrolling"
        />
      </div>
    </div>

    <!-- 主要內容 -->
    <div class="content-wrapper" :class="{ 'content-loaded': !isLoading }" data-scroll-section>
      <!-- 各個區塊 -->
      <section v-for="section in sections" :key="section.id"
              :id="section.id"
              class="section"
              :class="section.id + '-section'">
        <div class="section-content" data-scroll>
          <!-- 第一屏：大腦部分 -->
          <div v-if="section.id === 'brain'" class="brain-wrapper">
            <div class="eyes-container">
              <Eye
                ref="leftEyeRef"
                class="left-eye"
                :size="eyeSizes[currentSize]"
                :screen-size="currentSize"
              />
              <Eye
                ref="rightEyeRef"
                class="right-eye"
                :size="eyeSizes[currentSize]"
                :screen-size="currentSize"
              />
            </div>

            <div class="brain-container"
                @mouseover="showColorBrain = true"
                @mouseleave="showColorBrain = false"
                @click="goToLogin">

              <!-- 大標題文字 (僅在顯示變色腦時顯示) -->
              <div v-if="showColorBrain" class="brain-title">
                <h3 class="brain-main-title, Dela-gothic-one-stable">開始記錄腦</h3>
              </div>

              <!-- 變色版腦 (條件渲染) -->
              <img
                v-if="showColorBrain"
                src="/img/brain_rgb_gra.png"
                class="brain-img color-brain"
                :style="{ width: `${brainSizes[currentSize]}px` }"
              >

              <!-- 原始腦圖片 -->
              <img
                src="/img/brain_rgb_onlybrain.png"
                class="brain-img original-brain"
                :style="{ width: `${brainSizes[currentSize]}px`, opacity: showColorBrain ? 0 : 1 }"
                @load="handleImageLoad"
              >
            </div>

            <!-- 添加腦下方的大字標題 -->
            <div class="brain-status-title">
              <p class="Dela-gothic-one-text">&nbsp;腦有什麼狀況？</p>
            </div>
          </div>

          <!-- 第二屏：使用說明 -->
          <div v-else-if="section.id === 'guide'" class="guide-content">
            <h2>{{ $t('index.sections.guide.title') }}</h2>

            <!-- 功能卡片 -->
            <div class="function-cards-container">
              <q-card class="function-card" @click="goToBreathePage">
                <q-card-section>
                  <div class="text-h6">{{ $t('index.sections.guide.cards.breathe.title') }}</div>
                  <div class="text-subtitle2">{{ $t('index.sections.guide.cards.breathe.description') }}</div>
                </q-card-section>
              </q-card>

              <q-card class="function-card" @click="goToTodoPage">
                <q-card-section>
                  <div class="text-h6">organize</div>
                  <div class="text-subtitle2">條理化你的任務</div>
                </q-card-section>
              </q-card>

              <q-card class="function-card" @click="goToNoteBoard">
                <q-card-section>
                  <div class="text-h6">BrainStorm</div>
                  <div class="text-subtitle2">記錄你的靈感</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="guide-cards">
              <q-card v-for="(guide, index) in guides" :key="index" class="guide-card">
                <q-card-section>
                  <div class="text-h6">{{ guide.title }}</div>
                  <div class="text-subtitle2">{{ guide.description }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- 第三屏：最新公告 -->
          <div v-else-if="section.id === 'news'" class="news-content">
            <h2>最新公告</h2>
            <BulletinBoard class="expanded-bulletin" />
          </div>

          <!-- 第四屏：團隊介紹 -->
          <div v-else-if="section.id === 'team'" class="team-content">
            <h2>製作的腦</h2>
            <div class="team-cards">
              <q-card v-for="(member, index) in teamMembers" :key="index" class="team-card">
                <q-card-section>
                  <div class="text-h6">{{ member.name }}</div>
                  <div class="text-subtitle2">{{ member.role }}</div>
                  <div class="text-body2">{{ member.description }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- 第五屏：聯絡資訊 -->
          <div v-else-if="section.id === 'contact'" class="contact-content">
            <h2>聯絡腦</h2>
            <div class="contact-info">
              <div class="contact-item">
                <q-icon name="email" />
                <span>example@email.com</span>
              </div>
              <div class="contact-item">
                <q-icon name="phone" />
                <span>+886 123456789</span>
              </div>
              <div class="contact-item">
                <q-icon name="location_on" />
                <span>台北市信義區信義路五段7號</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </q-page>
  <q-btn
    v-if="$route.path !== '/' && !$q.screen.lt.md"
    class="return-to-preface-btn"
    unelevated
    rounded
    :label="$t('preface.return')"
    @click="goToPreface"
  >
    &nbsp;
    <q-icon name="fas fa-dove" class="q-mr-sm" />
  </q-btn>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
// import PeelSticker from 'components/PeelSticker.vue'
import Eye from 'components/EyeMove.vue'
import BulletinBoard from 'components/BulletinBoard.vue'
import { useLocomotiveScroll } from 'src/composables/useLocomotiveScroll'

const $q = useQuasar()
const router = useRouter()
const { t } = useI18n()
const { initLocomotiveScroll, update } = useLocomotiveScroll()
const isLoading = ref(true)

// 定義響應式尺寸
const brainSizes = {
  lg: 500,
  md: 400,
  sm: 300
}

const eyeSizes = {
  lg: 60,
  md: 50,
  sm: 40
}

// 計算當前尺寸
const currentSize = computed(() => {
  if ($q.screen.lt.sm) return 'sm'
  if ($q.screen.lt.md) return 'md'
  return 'lg'
})

// 定義需要加載的資源
const resourcesToLoad = {
  brainImage: false,
  // 可以添加其他需要加載的資源
}
// 處理圖片加載
const handleImageLoad = () => {
  resourcesToLoad.brainImage = true
  checkAllResourcesLoaded()
}

// 檢查所有資源是否加載完成
const checkAllResourcesLoaded = () => {
  const allLoaded = Object.values(resourcesToLoad).every(loaded => loaded)
  if (allLoaded) {
    // 添加一個小延遲，讓 loading 動畫更流暢
    setTimeout(() => {
      isLoading.value = false

    }, 500)
  }
}

let locomotiveInstance = null

// 解決 "isScrolling" 未定義警告
const isScrolling = ref(false)

// 控制顯示變色腦
const showColorBrain = ref(false)


onMounted(async () => {
  // 如果圖片已經在快取中，可能需要手動觸發加載完成
  if (document.querySelector('.brain-img')?.complete) {
    handleImageLoad()
  }

  // 等待 DOM 更新後初始化 Locomotive Scroll
  await nextTick()

  // 初始化 Locomotive Scroll 到頁面級別，使用更適合的配置
  locomotiveInstance = initLocomotiveScroll({
    el: document.querySelector('.page-container[data-scroll-container]'),
    smooth: true,
    smoothMobile: false,
    lerp: 0.1,
    scrollFromAnywhere: true, // 允許從任何位置開始滾動
    getDirection: true, // 取得滾動方向
    getSpeed: true, // 取得滾動速度
    reloadOnContextChange: true, // 上下文變化時重新加載
    resetNativeScroll: true // 重置原生滾動行為
  })

  if (locomotiveInstance) {
    console.log('Locomotive Scroll 已初始化:', locomotiveInstance)

    // 監聽滾動事件更新當前區塊
    locomotiveInstance.on('scroll', (obj) => {
      // 檢查哪個區塊在視窗中央
      const sectionElements = document.querySelectorAll('.section')
      const viewport = {
        top: obj.scroll.y,
        bottom: obj.scroll.y + window.innerHeight,
        middle: obj.scroll.y + (window.innerHeight / 2)
      }

      sectionElements.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        const top = obj.scroll.y + rect.top
        const bottom = top + rect.height

        // 如果視窗中間點在區塊內部，設置為當前區塊
        if (viewport.middle >= top && viewport.middle <= bottom) {
          currentSection.value = index
        }
      })
    })

    // 在初始化後觸發一次更新
    setTimeout(() => {
      update()
      console.log('Locomotive Scroll 已更新')
    }, 500)
  }

  // 創建一個新的 Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      // 確保 entries 是數組
      if (!Array.isArray(entries)) return

      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      }
    },
    {
      threshold: 0.1,
      rootMargin: '0px'
    }
  )

  // 獲取所有需要觀察的元素
  const elements = document.querySelectorAll('.section-content')
  for (const element of elements) {
    observer.observe(element)
  }
})

const goToNoteBoard = () => router.push('/site/notes')
const goToPreface = () => router.push('/')
const goToBreathePage = () => router.push('/site/breathe')
const goToTodoPage = () => router.push('/site/todo')

const goToLogin = () => router.push('/site/login')

// 定義sections
const sections = computed(() => [
  { id: 'brain', title: t('index.nav.brain') },
  { id: 'guide', title: t('index.nav.guide') },
  { id: 'news', title: t('index.nav.news') },
  { id: 'team', title: t('index.nav.team') },
  { id: 'contact', title: t('index.nav.contact') }
])

const currentSection = ref(0)

// 修改 scrollToSection 函數，控制 isScrolling 狀態
const scrollToSection = (sectionId) => {
  if (isScrolling.value) return // 如果正在滾動，防止重複觸發

  isScrolling.value = true

  // 找到目標區塊
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    // 使用 locomotive-scroll 滾動到指定區塊
    if (locomotiveInstance) {
      locomotiveInstance.scrollTo(targetSection, {
        duration: 1000,
        offset: 0,
        callback: () => {
          // 滾動完成後重置狀態
          setTimeout(() => {
            isScrolling.value = false
          }, 100)
        }
      })
    }
  } else {
    isScrolling.value = false // 如果找不到目標，重置狀態
  }
}

// 使用說明數據
const guides = [
  {
    title: '開始使用',
    description: '如何開始使用我們的服務'
  },
  {
    title: '功能介紹',
    description: '了解我們提供的主要功能'
  },
  {
    title: '常見問題',
    description: '解答常見的使用問題'
  }
]

// 團隊成員數據
const teamMembers = [
  {
    name: '我',
    role: '產品經理',
    description: '負責產品規劃與管理'
  },
  {
    name: '我',
    role: '技術總監',
    description: '負責技術架構與開發'
  },
  {
    name: '我',
    role: '設計師',
    description: '負責使用者介面設計'
  }
]

onBeforeUnmount(() => {
  // 清理 Locomotive Scroll
  if (locomotiveInstance) {
    locomotiveInstance.destroy()
  }
})
</script>

<style lang="scss">
// 全局滾動軸隱藏
:global(html),
:global(body) {
  scroll-behavior: smooth;
  overflow-y: auto !important;
  min-height: 100vh;
  height: auto !important;

  &::-webkit-scrollbar {
    display: none !important; // Chrome, Safari, Edge
  }
  -ms-overflow-style: none !important;  // IE
  scrollbar-width: none !important;  // Firefox
}

.Dela-gothic-one-stable {
  font-family: 'Dela Gothic One';
}

.Dela-gothic-one-text {
  font-family: 'Dela Gothic One';
  letter-spacing: 0.05em;
  width: 80vw; // 基本寬度使用vw單位
  margin: 0 auto; // 水平居中
  line-height: 1; // 確保行高適中
  max-height: calc(1.3em * 2); // 最多顯示兩行
  font-size: 5vw; // 大螢幕字體大小
  text-align: center;

  // 中等屏幕
  @media (max-width: $breakpoint-md-max) {
    font-size: 6vw; // 平板上適當放大
    width: 85vw;
  }

  // 小屏幕
  @media (max-width: $breakpoint-sm-max) {
    font-size: 7vw; // 手機上更大字體
    width: 90vw;
    letter-spacing: 0.03em; // 稍微減少字間距以適應小屏幕
  }

  // 極小屏幕
  @media (max-width: 400px) {
    font-size: 8vw;
    letter-spacing: 0.02em;
  }

  // 確保內容不超過兩行
  display: -webkit-box;
  -webkit-line-clamp: 2; // 限制最多兩行
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.page-container {
  position: relative;
  width: 100%;
  height: auto !important;
  overflow: visible !important;
  min-height: 100vh;
  overflow-x: hidden;
  display: block !important;

  &::-webkit-scrollbar {
    display: none !important;
  }
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

.q-page-container {
  &::-webkit-scrollbar {
    display: none !important;
  }
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

.brain-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 移除藍色背景 */
  background-color: transparent;
}

.brain-img {
  width: 500px;
  height: auto;
  display: block;

  @media (max-width: $breakpoint-sm-max) {
    width: 300px;
  }
}

.note-wrapper {
  position: absolute;
  right: 180px;
  bottom: 180px;
  z-index: 1;
}

.peel-sticker {
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.return-to-preface-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #5553d9;
  padding: 8px 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(85, 83, 217, 0.2);
  }
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.floating-cards-container {
  position: absolute;
  width: 300px;
  height: 300px;
  pointer-events: none;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: $breakpoint-md-max) {
    width: 160px;  /* 減小平板的容器尺寸 */
    height: 160px;
  }

  @media (max-width: $breakpoint-sm-max) {
    width: 120px;  /* 進一步減小手機的容器尺寸 */
    height: 120px;
  }
}

.floating-card {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: auto;
}

.card-wrapper {
  position: relative;
  left: -75px;
  top: -75px;

  @media (max-width: $breakpoint-sm-max) {
    left: -50px; /* 減小手機版的偏移 */
    top: -50px;
  }
}

.my-card, .sticker-card {
  width: 150px;
  height: 150px;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: scale(1.08);
  }

  @media (max-width: $breakpoint-md-max) {
    width: 100px;  /* 減小平板的卡片尺寸 */
    height: 100px;
  }

  @media (max-width: $breakpoint-sm-max) {
    width: 80px;  /* 進一步減小手機的卡片尺寸 */
    height: 80px;
  }
}

.card1, .card2, .card3 {
  animation: rotate 20s linear infinite;
}

.card1 { animation-delay: 0s; }
.card2 { animation-delay: -6.67s; }
.card3 { animation-delay: -13.33s; }

@keyframes rotate {
  from {
    transform: rotate(0deg) translateX(160px) translateY(-50px) rotate(0deg); /* 減小半徑並上移軌跡 */
  }
  to {
    transform: rotate(360deg) translateX(160px) translateY(-50px) rotate(-360deg);
  }
}

/* 為不同屏幕尺寸設置不同的旋轉軌跡 */
@media (max-width: $breakpoint-md-max) {
  @keyframes rotate {
    from {
      transform: rotate(0deg) translateX(120px) translateY(-40px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(120px) translateY(-40px) rotate(-360deg);
    }
  }
}

@media (max-width: $breakpoint-sm-max) {
  @keyframes rotate {
    from {
      transform: rotate(0deg) translateX(90px) translateY(-30px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(90px) translateY(-30px) rotate(-360deg);
    }
  }
}

.dark {
  .my-card {
    background: rgba(30, 30, 30, 0.9);
  }
}

.eyes-container {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 50px;
  z-index: 10;
  pointer-events: none;

  @media (max-width: $breakpoint-md-max) {
    gap: 45px;
    top: 180px;
  }

  @media (max-width: $breakpoint-sm-max) {
    gap: 30px;
    top: 150px;
  }
}

.left-eye, .right-eye {
  pointer-events: none;
}

.brain-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: auto;

  &:hover {
    transform: scale(1.02);
  }
}

.pupil {
  transform-origin: center !important;
}

.bulletin-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 300px;
  z-index: 100;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s ease;

  h1 {
    margin-bottom: 20px;
  }
}

.content-wrapper {
  width: 100%;
  position: relative;
  transition: opacity 0.5s ease;
  opacity: 0;
}

.content-loaded {
  opacity: 1;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 垂直導航列樣式 */
.vertical-nav {
  position: fixed;
  left: 20px;
  top: 70px;
  transform: none;
  background: rgba(255, 255, 255, 0.8);
  padding: 15px 10px;
  border-radius: 10px;
  z-index: 100;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.95);
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .q-btn {
      font-size: 0.9rem;
      font-weight: 400;
      position: relative;
      padding: 0 8px;
      min-height: 2rem;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 2px;
        background-color: currentColor;
        transition: width 0.3s ease;
      }

      &:hover::after {
        width: 100%;
      }

      &.active-nav {
        color: var(--q-primary);
        font-weight: 500;

        &::after {
          width: 100%;
        }
      }
    }
  }
}

/* 深色模式樣式 */
.dark .vertical-nav {
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid rgba(80, 80, 80, 0.2);

  &:hover {
    background: rgba(50, 50, 50, 0.9);
  }

  .nav-links .q-btn.active-nav {
    color: var(--q-primary);
  }
}

/* 確保每個 section 緊密排列 */
.section {
  width: 100%;
  height: 100vh; /* 固定為視窗高度 */
  padding: 0 8vw; /* 左右留白 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  overflow: hidden; /* 防止內容溢出 */
}

/* 每個 section 的內容容器 */
.section-content {
  width: 100%;
  max-width: 1400px; /* 限制最大寬度 */
  margin: 0 auto;
  padding: 60px 0; /* 上下間距 */
}

/* 不同區塊的樣式 */
.brain-wrapper,
.guide-content,
.news-content,
.team-content,
.contact-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Locomotive Scroll 特定樣式 */
[data-scroll-container] {
  position: relative;
  width: 100%;
  height: auto;
  overflow: visible !important;
}

[data-scroll-section] {
  position: relative;
  width: 100%;
}

/* 取消動畫效果，確保立即可見 */
[data-scroll] {
  will-change: transform;
  transition: none !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .section {
    padding: 0 4vw; /* 在小屏幕上減少左右間距 */
  }

  .vertical-nav {
    left: 10px;
    top: 60px;
    padding: 10px 8px;

    .nav-links .q-btn {
      font-size: 0.8rem;
      min-height: 1.8rem;
    }
  }
}

// 腦容器樣式
.brain-container {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

// 變色腦樣式
.color-brain {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  transition: opacity 0.3s ease;
}

// 原始腦樣式
.original-brain {
  position: relative;
  z-index: 1;
  transition: opacity 0.3s ease;
}

// 腦標題樣式
.brain-title {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

// 大標題
.brain-main-title {
  color: #ff44aa;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(255, 68, 170, 0.5);

  @media (max-width: $breakpoint-sm-max) {
    font-size: 1.8rem;
  }
}

// 小標題
.brain-sub-title {
  color: #9966ff;
  font-size: 1.2rem;

  @media (max-width: $breakpoint-sm-max) {
    font-size: 1rem;
  }
}

// 淡入動畫
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

// 功能卡片容器樣式 - 沒有動畫
.function-cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 2rem 0;
}

.function-card {
  width: 200px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: $breakpoint-sm-max) {
    width: 140px;
  }
}


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
