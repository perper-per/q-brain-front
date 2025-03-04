<template>
  <div data-scroll-container >
  <!-- <div data-scroll-container class="gradient-bg"> -->
    <!-- Loading 遮罩 - 使用 v-show 而非 v-if 確保元素存在 -->
    <div v-show="isLoading" class="loading-overlay">
      <div class="loading-text-container">
        <div
          v-for="(_, index) in 20"
          :key="index"
          class="loading-text-line"
          :style="{
            marginLeft: index * 50 + 'px',
            left: '-600px',
            position: 'relative'
          }"
        >
          <span style="font-family: 'Dela Gothic One', cursive;">>>>>>>>>>loading>>>>>>>>>>>>>></span>
        </div>
      </div>
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- 導航列 -->
    <!-- <div class="vertical-nav">
      <div class="nav-links">
        <q-btn
          v-for="section in sections"
          :key="section.id"
          flat
          no-caps
          dense
          :label="section.title"
          @click="scrollToSection(section.id)"
          class="nav-btn"
        />
      </div>
    </div> -->

    <!-- 第一個 section - 英雄區塊 -->
    <section data-scroll-section class="section hero-section" id="hero">
      <div class="section-inner hero-content">
        <!-- 漂浮的大腦 - 右上角 -->
        <div class="floating-brain-wrapper" data-scroll data-scroll-speed="2">
          <BrainWithEyes
            :brain-size="brainSizes[currentSize]"
            :screen-size="currentSize"
            :show-eyes="true"
            @brain-click="redirectToLogin"
          />
        </div>

          <div class="brain-status-question" data-scroll-speed="-6" >
            <svg width="449" height="157" viewBox="0 0 549 157" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="rotate(30 275 78.5)">
                <path id="path1" d="M9.55568 33.819C105.754 212.873 467.187 -29.5023 542.273 101.507" stroke="transparent" stroke-width="5"/>

                <text fill="blue" font-size="50" font-family="'Dela Gothic One', cursive" textLength="500" lengthAdjust="spacing">
                  <textPath href="#path1">
                    腦的狀態如何？
                  </textPath>
                </text>
              </g>
            </svg>
          </div>

        <div class="hero-text" data-scroll data-scroll-speed="2">
          <h1 class="c-header_title" data-scroll>
            <span class="c-header_title_line">
              <span
                data-scroll
                data-scroll-speed="4"
                data-scroll-position="top"
                class="title-word knotty-word"
              >knotty</span>
            </span>
            <span class="c-header_title_line">
              <span
                data-scroll
                data-scroll-speed="2"
                data-scroll-position="top"
                class="title-word brained-word"
              >brained</span>
            </span>
          </h1>
        </div>
      </div>
    </section>

    <!-- 波浪背景 - 放在第一和第二區塊之間 -->
    <div class="wave-background" data-scroll data-scroll-speed="3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" class="wave-svg">
        <defs>
          <linearGradient gradientTransform="rotate(270)" x1="50%" y1="0%" x2="50%" y2="100%" id="sssquiggly-grad">
            <stop stop-color="hsl(1.4, 100%, 67%)" offset="0%"></stop>
            <stop stop-color="hsl(167, 52%, 78%)" offset="100%"></stop>
          </linearGradient>
        </defs>
        <g stroke="url(#sssquiggly-grad)" fill="none" stroke-linecap="round" stroke-width="2">
          <path d="M10,10C21.8,11.46,41,22,66.67,17C92.36,12,105.56,-17.13,133.33,-14C161.11,-10.87,172.22,34.71,200,32C227.78,29.29,238.89,-30.54,266.67,-27C294.44,-23.46,305.56,46.29,333.33,49C361.11,51.71,372.22,-12.13,400,-14C427.78,-15.88,438.89,37.29,466.67,40C494.44,42.71,505.56,-4.54,533.33,-1C561.11,2.54,572.22,56.79,600,57C627.78,57.21,638.89,0.42,666.67,0C694.44,-0.42,707.64,52.92,733.33,55C759.03,57.08,778.19,19.38,790,10" transform="translate(0, 52)"></path>
          <path d="M10,10C21.8,11.46,41,22,66.67,17C92.36,12,105.56,-17.13,133.33,-14C161.11,-10.87,172.22,34.71,200,32C227.78,29.29,238.89,-30.54,266.67,-27C294.44,-23.46,305.56,46.29,333.33,49C361.11,51.71,372.22,-12.13,400,-14C427.78,-15.88,438.89,37.29,466.67,40C494.44,42.71,505.56,-4.54,533.33,-1C561.11,2.54,572.22,56.79,600,57C627.78,57.21,638.89,0.42,666.67,0C694.44,-0.42,707.64,52.92,733.33,55C759.03,57.08,778.19,19.38,790,10" transform="translate(0, 95)"></path>
          <path d="M10,10C21.8,11.46,41,22,66.67,17C92.36,12,105.56,-17.13,133.33,-14C161.11,-10.87,172.22,34.71,200,32C227.78,29.29,238.89,-30.54,266.67,-27C294.44,-23.46,305.56,46.29,333.33,49C361.11,51.71,372.22,-12.13,400,-14C427.78,-15.88,438.89,37.29,466.67,40C494.44,42.71,505.56,-4.54,533.33,-1C561.11,2.54,572.22,56.79,600,57C627.78,57.21,638.89,0.42,666.67,0C694.44,-0.42,707.64,52.92,733.33,55C759.03,57.08,778.19,19.38,790,10" transform="translate(0, 140)"></path>
        </g>
      </svg>
    </div>


    <!-- 第二個 section - 功能介紹區塊 -->
<section data-scroll-section class="section content-section" id="content">
  <div class="section-inner">
    <div class="section-header">
      <span class="section-number" data-scroll data-scroll-speed="1">01</span>
      <h2 class="section-title" data-scroll data-scroll-speed="2">
        <span class="primary-color">解結工具</span>
      </h2>
    </div>
    <div class="function-container" data-scroll data-scroll-speed="1">
      <!-- 功能球容器 -->
      <div class="function-balls-container">
        <!-- 第一個球 - 呼吸 (最大) -->
        <div class="function-ball-wrapper" data-scroll data-scroll-speed="1.2">
          <div class="function-ball ball-1 ball-large" @click="goToBreathePage">
            <div class="ball-content">
              <div class="ball-front">
                <div class="problem-title">太焦慮!!</div>
                <div class="problem-desc">腦袋緊繃、呼吸急促</div>
              </div>
              <div class="ball-back">
                <div class="ball-title">呼吸練習</div>
                <div class="ball-desc">{{ $t('index.sections.guide.cards.breathe.description') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第二個球 - 待辦事項 (中等) -->
        <div class="function-ball-wrapper" data-scroll data-scroll-speed="1.8">
          <div class="function-ball ball-2 ball-medium" @click="goToTodoPage">
            <div class="ball-content">
              <div class="ball-front">
                <div class="problem-title">要從何開始</div>
                <div class="problem-desc">事情太多無法理清</div>
              </div>
              <div class="ball-back">
                <div class="ball-title">待辦事項</div>
                <div class="ball-desc">條理化你的任務</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第三個球 - 靈感板 (中等) -->
        <div class="function-ball-wrapper" data-scroll data-scroll-speed="2.4">
          <div class="function-ball ball-3 ball-medium" @click="goToNoteBoard">
            <div class="ball-content">
              <div class="ball-front">
                <div class="problem-title">胡思亂想</div>
                <div class="problem-desc">需要記錄下來</div>
              </div>
              <div class="ball-back">
                <div class="ball-title">便利貼板</div>
                <div class="ball-desc">記錄你的靈感</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    <!-- 第三個 section -->
    <section data-scroll-section class="section news-section" id="news">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-number" data-scroll data-scroll-speed="1">02</span>
          <h2 class="section-title primary-color" data-scroll data-scroll-speed="2">
            最新公告
          </h2>
        </div>
        <div class="section-content" data-scroll data-scroll-speed="1">
          <BulletinBoard class="expanded-bulletin" />
        </div>
      </div>
    </section>

    <!-- 第四個 section -->
    <section data-scroll-section class="section team-section" id="team">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-number" data-scroll data-scroll-speed="1">03</span>
          <h2 class="section-title primary-color" data-scroll data-scroll-speed="2">
            製作的腦
          </h2>
        </div>
        <div class="team-grid" data-scroll data-scroll-speed="1">
          <div
            v-for="(member, index) in teamMembers"
            :key="index"
            class="team-member"
            data-scroll
            data-scroll-speed="1"
          >
            <h3 class="member-name">{{ member.name }}</h3>
            <span class="member-role">{{ member.role }}</span>
            <p class="member-desc">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 第五個 section -->
    <section data-scroll-section class="section content-section" id="content">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-number" data-scroll data-scroll-speed="1">04</span>
          <h2 class="section-title" data-scroll data-scroll-speed="2">
            腦訊通知
          </h2>
        </div>
        <div class="sign-in" data-scroll data-scroll-speed="3">
          <p class="content-desc" data-scroll data-scroll-speed="1">
            Lorem ipsum dolor
            <span class="grey">sit epicurus in animis nostres <br>
            inesse notionem ut voluptates</span>
          </p>
          <div class="form" data-scroll data-scroll-speed="4">
            <input type="email" placeholder="Your email...">
            <button>訂閱更新</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部的大腦組件 - 放在所有 section 之後，但在容器結束前 -->
    <div class="footer-brain-container" data-scroll-section>
      <div class="footer-brain-wrapper" data-scroll data-scroll-speed="1">
        <BrainWithEyes
          :brain-size="brainSizes[currentSize]"
          :screen-size="currentSize"
          :show-eyes="true"
          @brain-click="redirectToLogin"
        />
      </div>
    </div>
  </div>
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
import { onMounted, onBeforeMount, computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLocomotiveScroll } from 'src/composables/useLocomotiveScroll'
import BulletinBoard from 'components/BulletinBoard.vue'
import BrainWithEyes from 'components/BrainWithEyes.vue'

// 確保 loading 狀態默認為 true
const isLoading = ref(true)

const $q = useQuasar()
const router = useRouter()
const { initLocomotiveScroll, update, locomotiveInstance } = useLocomotiveScroll()

// 不同屏幕尺寸的腦大小
const brainSizes = {
  lg: 500,
  md: 400,
  sm: 300
}


// 計算當前尺寸
const currentSize = computed(() => {
  if ($q.screen.lt.sm) return 'sm'
  if ($q.screen.lt.md) return 'md'
  return 'lg'
})

// 團隊成員數據
const teamMembers = [
  {
    name: '腦人',
    role: '產品經理',
    description: '負責產品規劃與管理，制定產品策略與發展方向。'
  },
  {
    name: '腦人',
    role: '技術總監',
    description: '負責技術架構與開發，確保系統穩定性與擴展性。'
  },
  {
    name: '腦人',
    role: '設計師',
    description: '負責使用者介面設計，創造流暢直觀的使用體驗。'
  }
]


// 點擊大腦重定向到登錄頁面
const redirectToLogin = () => router.push('/site/login')
const goToNoteBoard = () => router.push('/site/notes')
const goToPreface = () => router.push('/')
const goToBreathePage = () => router.push('/site/breathe')
const goToTodoPage = () => router.push('/site/todo')

// 在組件掛載前確保 loading 狀態為 true
onBeforeMount(() => {
  console.log('啟動 Loading 畫面')
  isLoading.value = true
})

// 初始化視差滾動
onMounted(() => {
  console.log('Loading 狀態:', isLoading.value)

  setTimeout(() => {
    console.log('Loading 時間到，關閉 Loading 畫面')
    isLoading.value = false

    setTimeout(() => {
      try {
        initLocomotiveScroll({
          smooth: true,
          multiplier: 1,
          lerp: 0.1,
          smartphone: {
            smooth: true
          },
          tablet: {
            smooth: true,
            breakpoint: 1024
          }
        })
        console.log('Locomotive Scroll 初始化成功')

        document.documentElement.classList.add('is-ready')
      } catch (error) {
        console.error('初始化 Locomotive Scroll 發生錯誤:', error)
      }
    }, 100)

    update()
  }, 2000)

  window.addEventListener('resize', () => {
    try {
      update()
    } catch (error) {
      console.error('更新 Locomotive Scroll 時發生錯誤:', error)
    }
  })

  // 確保頁面加載後刷新一次 Locomotive Scroll
  nextTick(() => {
    // 短暫延遲確保 DOM 完全渲染
    setTimeout(() => {
      if (locomotiveInstance.value) {
        locomotiveInstance.value.update();

        // 確保所有區域都可見
        for (const section of document.querySelectorAll('.section')) {
          // 強制重新計算區域高度和位置
          section.style.display = 'block';
          section.style.opacity = '1';
        }

        // 再次更新滾動引擎
        locomotiveInstance.value.update();
      }
    }, 500);
  });
})

// 定義部分區塊數據供模板使用
// const sections = [
//   { id: 'hero', title: '首頁' },
//   { id: 'content', title: '內容' },
//   { id: 'news', title: '公告' },
//   { id: 'team', title: '團隊' },
//   { id: 'contact', title: '聯絡' }
// ]

// 處理導航點擊
// const scrollToSection = (sectionId) => {
//   scrollTo(`#${sectionId}`, {
//     offset: 0,
//     duration: 1000
//   })
// }
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

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

.gradient-bg {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    #2a2a2a 100%,
  );
  height: 100%;
  width: 100%;
}

/* Hero section 樣式 */
.hero-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 默認為手機布局 */
}

/* 文字部分 */
.hero-text {
  position: relative;
  z-index: 2;
  padding: 2rem;
  margin-top: 10vh; /* 手機版在上方 */
  width: 100%;
  text-align: left; /* 確保內容左對齊 */
}

/* 腦部分 */
.brain-wrapper {
  position: relative;
  z-index: 3;
  align-self: center;
  margin-top: auto;
  margin-bottom: 10vh;
}

.brain-container {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: scale(1.02);
  }
}

.brain-img {
  max-width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
}

.color-brain {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.original-brain {
  position: relative;
  z-index: 1;
}

.brain-title {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  text-align: center;
  transition: opacity 0.3s ease;
}

.brain-main-title {
  color: #ff44aa;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(255, 68, 170, 0.5);
}

.brain-status-title {
  text-align: center;
  margin-top: 1rem;
}

.Dela-gothic-one-text {
  font-family: 'Dela Gothic One', cursive;
  font-size: 1.5rem;
  color: #fff;
}

/* 淡入動畫 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.disappear{
  opacity:0;
  transition: opacity 2s;
  color: #333;
}
.appear{
  opacity:1;
}

// /* 導航列 */
// .vertical-nav {
//   position: fixed;
//   top: 50%;
//   right: 30px;
//   transform: translateY(-50%);
//   z-index: 100;
//   background: rgba(0, 0, 0, 0.3);
//   backdrop-filter: blur(10px);
//   padding: 15px 10px;
//   border-radius: 30px;
// }

// .nav-links {
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// }

// .nav-btn {
//   color: #fff;
//   opacity: 0.6;
//   transition: opacity 0.3s;

//   &:hover {
//     opacity: 1;
//   }

//   &.active {
//     opacity: 1;
//     color: #FDC65D;
//   }
// }
.brain-status-question {
  position: absolute;
  bottom: 6vh;
  right: 5vw;
  width: 40%;
  height: auto;
  z-index: 10;
  pointer-events: none;

  svg {
    overflow: visible;
  }

  @media (min-width: 769px) {
    width: 30%;
    bottom: 10vh;
    right: 10vw;
  }

  @media (max-width: 768px) {
    width: 60%;
    bottom: 15vh;
    right: 5vw;

    text {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    width: 70%;
    bottom: 12vh;

    text {
      font-size: 16px;
    }
  }
}
/* 每個 section 固定高度為 100vh */
.section {
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 內容容器 */
.section-inner {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

/* 標題樣式 */
.huge-title {
  font-family: 'Nova Round', cursive !important;
  letter-spacing: 1px; /* 改善字體顯示 */
}

/* 統一的區塊標題樣式 */
.section-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
  position: relative;

  @media (min-width: 769px) {
    margin-bottom: 5rem;
  }
}

.section-number {
  font-size: 3rem;
  line-height: 1;
  position: absolute;
  top: -1.5rem;
  left: -1rem;
  z-index: 0;

  @media (min-width: 769px) {
    font-size: 5rem;
    top: -2.5rem;
    left: -2rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    top: -1rem;
    left: -0.5rem;
  }
}

.section-title {
  font-weight: 600;
  font-size: 2.5rem;
  margin: 0;
  position: relative;
  z-index: 1;

  @media (min-width: 769px) {
    font-size: 3.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }

  .primary-color {
    color: $primary;
  }
}

.primary-color {
  color: $primary;
}
.grey {
  color: #999;
}

/* 波浪背景樣式 */
.wave-background {
  position: absolute;
  top: 70vh;  /* 位於第一個區塊底部 */
  left: -5%;
  width: 110vw;
  height: 30vh;
  z-index: 1;
  pointer-events: none;  /* 確保不會干擾滑鼠事件 */
}

.wave-svg {
  width: 100%;
  height: auto;
  opacity: 0.6;  /* 半透明效果 */
}

/* 確保第二個區塊內容在波浪之上 */
.content-section {
  position: relative;
  z-index: 2;
}

/* 第二區塊 */
.content-section {
  position: relative;
}

.sign-in {
  max-width: 600px;
}

.content-desc {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.form input {
  flex: 1;
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: $primary;
}

.form button {
  padding: 1rem 2rem;
  border-radius: 2rem;
  border: none;
  background: $primary;
  color: #FFF;
  font-weight: bold;
  cursor: pointer;
}

/* Team section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.team-member {
  color: #fff;
}

.member-name {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.member-role {
  color: #FDC65D;
  font-size: 1rem;
  display: block;
  margin-bottom: 1rem;
}

.member-desc {
  color: #999;
  line-height: 1.6;
}

/* Contact section */
.contact-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #fff;
  font-size: 1.8rem;
}

.contact-item .q-icon {
  color: #FDC65D;
  font-size: 2.5rem;
}

/* 公告板樣式 */
.expanded-bulletin {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border-radius: 4px;
  padding: 2rem;
  height: 50vh;
  overflow-y: auto;
}

/* 右上角漂浮的大腦 */
.floating-brain-wrapper {
  position: absolute;
  top: 10vh;
  right: 5vw;
  animation: float 6s ease-in-out infinite;
}

/* 漂浮動畫 */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* 手機版調整 */
@media (max-width: 768px) {
  .floating-brain-wrapper {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 10vh;
    align-self: center;
  }
}

/* 響應式設計 */
@media (min-width: 769px) {
  .hero-content {
    flex-direction: row;
  }

  .hero-text {
    position: absolute;
    bottom: 15vh;
    left: 0;
    margin-top: 0;
    width: 100%;
  }

  .brain-wrapper {
    position: absolute;
    top: 10vh;
    right: 5vw;
    margin: 0;
  }
}

/* 平板布局 - 介於手機和桌面之間 */
@media (min-width: 601px) and (max-width: 768px) {
  .brainSize {
    width: 250px; /* 平板版稍小一點 */
  }

  .huge-title {
    font-size: 6vw;
  }
}

/* 手機布局調整 */
@media (max-width: 600px) {
  .brainSize {
    width: 200px; /* 手機版更小 */
  }

  .huge-title {
    font-size: 12vw;
  }

  .brain-main-title {
    font-size: 1.8rem;
  }

  .brain-status-title .Dela-gothic-one-text {
    font-size: 1.2rem;
  }
}

/* 確保標題文字有足夠的區域 */
.hero-text {
  .huge-title {
    margin-bottom: 1rem;
    width: 80%; /* 佔父元素的 80% */
    transform-origin: left bottom; /* 從左下角開始放大縮小 */
    position: relative;
    left: 0;
    bottom: 0;
    line-height: 0.9;
  }

  .title-word {
    font-size: 10vw; /* 使用視窗寬度作為基礎，確保足夠大 */
    display: block; /* 讓每個單詞獨占一行 */
    width: 100%; /* 佔滿容器寬度 */
    letter-spacing: -0.02em; /* 稍微調整字間距 */
    text-align: left; /* 確保文字左對齊 */
  }

  .knotty-word {
    padding-left: 0; /* 第一行從最左邊開始 */
    margin-left: 0;
  }

  .brained-word {
    padding-left: 3vw; /* 第二行保持縮進效果 */
  }

  /* 不同斷點也使用相同的起點和大小比例 */
  @media (max-width: 768px) {
    .huge-title {
      width: 80%; /* 保持相同的寬度比例 */
      transform-origin: left bottom; /* 保持相同的起點 */
    }

    .title-word {
      font-size: 15vw; /* 在小屏幕上使用更大的字體 */
    }

    .knotty-word {
      padding-left: 0; /* 小屏幕移除縮進 */
    }

    .brained-word {
      padding-left: 1.5rem; /* 小屏幕減少縮進 */
    }
  }
}

/* 確保 Loading 遮罩樣式正確 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 99999; /* 極高的 z-index 確保顯示在最前面 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-text-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.loading-text-line {
  white-space: nowrap;
  margin-bottom: 10px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.2);
  left: -150px;

  @media (max-width: 599px) {
    font-size: 7vw; /* 手機版稍小一些 */
  }

  @media (min-width: 600px) and (max-width: 1023px) {
    font-size: 10vw; /* 平板大小 */
  }

  @media (min-width: 1024px) {
    font-size: 10vw; /* 桌面版超大 */
  }
}

/* 你也可以添加一些動畫效果，讓大字體更有視覺衝擊 */
.loading-text-line span {
  display: inline-block;
  transform-origin: center;
  animation: pulseText 2s infinite; /* 脈動效果 */
}

@keyframes pulseText {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.02); }
}

/* 重要：將 scoped 移除，讓樣式可以生效到 html.is-ready 元素 */
@import 'src/css/quasar.variables.scss';

/* 保留 locomotive-parallax.scss 中的核心旋轉樣式，直接寫在這裡 */
.c-header_title_line {
  display: block;
  opacity: 0;
  transform: translateY(100%) rotateX(-80deg);
  transform-origin: left bottom;
  transform-style: preserve-3d;
  transition: opacity 0s cubic-bezier(.215,.61,.355,1), transform 0s cubic-bezier(.215,.61,.355,1);
  text-align: left; /* 確保文字左對齊 */
  padding-left: 0; /* 移除可能的左邊距 */
  margin-left: 0;

  &:first-child {
    margin-left: 0; /* 確保第一行從最左邊開始 */
    padding-left: 0;
  }

  span {
    display: inline-block;
    transform-origin: left bottom;
    transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    font-family: 'Nova Round', cursive !important;
  }
}

/* 頁面就緒時的標題行動畫 */
html.is-ready .c-header_title_line {
  opacity: 1;
  transform: none;
  transition-duration: .8s;
}

html.is-ready .c-header_title_line:first-child {
  transition-delay: .1s;
}

html.is-ready .c-header_title_line:nth-child(2) {
  transition-delay: .2s;
}

/* 視差標題樣式 */
.c-header_title {
  padding: 2.5rem 0;
  perspective: 600px;
  -webkit-perspective: 600px;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0;
  width: 80%;
  transform-origin: left bottom;
}

/* 移動設備下的標題對齊左下角 */
@media (max-width: 768px) {
  .hero-text {
    margin-top: 0;
    position: absolute;
    bottom: 15vh;
    left: 5vw;
    text-align: left;
    width: 90%;
  }

  .c-header_title {
    position: relative;
    bottom: auto;
    width: 100%;
    text-align: left;
    padding-bottom: 0;
  }

  .title-word {
    font-size: 14vw;
  }

  .knotty-word, .brained-word {
    padding-left: 0;
    margin-left: 0;
  }
}

/* 更小螢幕的額外調整 */
@media (max-width: 480px) {
  .hero-text {
    bottom: 12vh;
  }

  .title-word {
    font-size: 16vw;
  }
}

/* 確保第二區的特殊佈局 */
.content-section .section-inner {
  display: flex;
  flex-direction: column;

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .section-header {
    margin-bottom: 2rem;

    @media (min-width: 769px) {
      flex: 0 0 40%;
      margin-bottom: 0;
    }
  }

  .sign-in {
    @media (min-width: 769px) {
      margin-top: 4rem;
    }
  }
}

/* 功能球容器樣式 */
.function-balls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4rem;
  margin: 4rem 0;
  position: relative;
  height: 50vh; /* 足夠高的容器以顯示球向上漂浮 */

  @media (max-width: 768px) {
    gap: 3rem;
    height: auto;
    padding: 2rem 0;
  }
}

.function-ball-wrapper {
  position: relative;
  z-index: 2;
  /* 浮動動畫 */
  animation: floatAnimation 6s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 1s;
  }

  &:nth-child(3) {
    animation-delay: 2s;
  }
}

/* 球的基本樣式 */
.function-ball {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
              box-shadow 0.5s ease;
  perspective: 1000px;

  /* 不同尺寸的球 */
  &.ball-large {
    width: 260px;
    height: 260px;

    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
    }
  }

  &.ball-medium {
    width: 220px;
    height: 220px;

    @media (max-width: 768px) {
      width: 180px;
      height: 180px;
    }
  }

  /* 默認狀態下半透明 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    opacity: 0.9;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  /* 懸停效果 */
  &:hover {
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.4);

    &::before {
      opacity: 1;
    }

    .ball-content {
      transform: rotateY(180deg);
    }
  }

  /* 點擊效果 */
  &:active {
    transform: scale(0.95);
  }

  /* 球內容 - 3D翻轉效果 */
  .ball-content {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .ball-front, .ball-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    color: white;
  }

  .ball-back {
    transform: rotateY(180deg);
  }

  .problem-title, .ball-title {
    font-family: 'Dela Gothic One', cursive;
    font-size: 1.8rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  .problem-desc, .ball-desc {
    font-size: 1.1rem;
    opacity: 0.9;
    line-height: 1.4;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
}

/* 球的顏色變化 */
.ball-1::before {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
}

.ball-2::before {
  background: linear-gradient(135deg, #6A11CB, #2575FC);
}

.ball-3::before {
  background: linear-gradient(135deg, #00C9FF, #92FE9D);
}

/* 浮動動畫 */
@keyframes floatAnimation {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 球內的發光效果 */
.function-ball::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
  z-index: -1;
  pointer-events: none;
}

/* 頁腳大腦容器 */
.footer-brain-container {
  width: 100%;
  padding: 5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 40vh;

  /* 為容器添加特殊背景效果 */
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.2));
}

/* 底部大腦樣式 */
.footer-brain-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  /* 為大腦添加輕微的上下浮動效果 */
  animation: footer-brain-float 6s ease-in-out infinite;

  /* 大腦周圍的光暈效果 */
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.7;
  }

  /* 當滑鼠懸停在大腦上時的效果 */
  &:hover {
    animation-play-state: paused;
    transform: scale(1.05);

    &::before {
      animation: footer-pulse 2.5s infinite;
    }
  }
}

/* 頁腳大腦浮動動畫 */
@keyframes footer-brain-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 頁腳光暈脈衝動畫 */
@keyframes footer-pulse {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.95);
  }
}
</style>
