<template>
  <q-page class="breath-page">
    <!-- 添加 HalftoneWaves 作為背景 -->
    <HalftoneWaves class="background-waves" />

    <!-- 完成覆蓋層 -->
    <div v-if="showCompletionOverlay" class="completion-overlay" @click="dismissOverlay">
      <div class="completion-circle" @click.stop>
        <span class="completion-text">舒適</span>
      </div>
      <div class="completion-hint">點擊空白處關閉</div>
    </div>

    <!-- 主要內容區域 -->
    <div class="content-container">
      <!-- 桌面版控制面板布局 -->
      <div class="desktop-layout">
        <!-- 左側面板 - 時間選擇或計時器 -->
        <div class="control-panel left-panel">
          <!-- 未開始時顯示時間選擇 -->
          <q-btn-toggle
            v-if="!isStarted"
            v-model="duration"
            :options="[
              {label: '1分鐘', value: 60},
              {label: '3分鐘', value: 180},
              {label: '5分鐘', value: 300}
            ]"
            class="duration-toggle"
            no-caps
            unelevated
            rounded
            toggle-color="white"
            text-color="white"
            color="transparent"
            active-class="active-duration"
          />

          <!-- 開始後顯示計時器 -->
          <div v-else class="timer-display">
            <div class="time-value">{{ formatTime(timeLeft) }}</div>
            <div class="time-label">剩餘時間</div>
          </div>
        </div>

        <!-- 手機版頂部控制區域 -->
        <div class="mobile-top-controls">
          <!-- 未開始時顯示時間選擇 -->
          <q-btn-toggle
            v-if="!isStarted"
            v-model="duration"
            :options="[
              {label: '1分鐘', value: 60},
              {label: '3分鐘', value: 180},
              {label: '5分鐘', value: 300}
            ]"
            class="duration-toggle"
            no-caps
            unelevated
            rounded
            toggle-color="white"
            text-color="white"
            color="transparent"
            active-class="active-duration"
          />

          <!-- 開始後顯示計時器 -->
          <div
            v-else
            class="timer-display"
          >
            <div class="time-value">{{ formatTime(timeLeft) }}</div>
            <div class="time-label">剩餘時間</div>
          </div>
        </div>

        <!-- 中間呼吸圈圈 -->
        <div class="breath-circle-container">
          <!-- 旋轉文字 -->
          <svg
            class="rotating-text"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="circlePath"
              fill="none"
              d="
                M 10, 50
                a 40,40 0 1,1 80,0
                a 40,40 0 1,1 -80,0
              "
            />
            <text>
              <textPath
                href="#circlePath"
                class="circle-text"
              >
                BREATHE IN●BREATHE OUT●
              </textPath>
            </text>
          </svg>

          <!-- 參考圓圈 -->
          <div class="reference-circle">
            <svg
              width="300"
              height="300"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="75"
                fill="rgba(255, 255, 255, 0.5)"
                stroke="rgba(255, 255, 255, 0.3)"
                stroke-width="2"
                stroke-opacity="0.2"
              />
            </svg>
          </div>

          <!-- 動畫圓圈 -->
          <svg
            class="breath-circle"
            :class="{ 'animate-breath': isStarted }"
            width="300"
            height="300"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              :r="circleRadius"
              fill="rgba(255, 255, 255, 0.9)"
              stroke="rgba(255, 255, 255, 0.9)"
              stroke-width="4"
            />
          </svg>

          <!-- 呼吸提示文字 -->
          <div
            v-if="isStarted"
            class="breath-text"
            :class="{
              'fade-in': isStarted,
              'inhale': currentPhase === '吸',
              'exhale': currentPhase === '吐'
            }"
          >
            {{ currentPhase }}
          </div>
        </div>

        <!-- 右側面板 - 開始/停止按鈕 -->
        <div class="control-panel right-panel">
          <q-btn
            :color="isStarted ? 'negative' : 'primary'"
            :label="isStarted ? 'Stop' : 'Start'"
            @click="toggleBreathing"
            rounded
            class="control-btn"
          />
        </div>
      </div>

      <!-- 手機版底部控制按鈕 - 修復顯示問題 -->
      <div class="mobile-bottom-controls">
        <q-btn
          :color="isStarted ? 'negative' : 'primary'"
          :label="isStarted ? '停止' : '開始'"
          @click="toggleBreathing"
          rounded
          class="control-btn"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue'
import HalftoneWaves from '../components/HalftoneWaves.vue'

const isStarted = ref(false)
const timeLeft = ref(60)
const circleRadius = ref(50)
const currentPhase = ref('吸')
const duration = ref(60) // 預設 1 分鐘
let breathInterval
let timerInterval
const showCompletionOverlay = ref(false)

// 當 duration 改變時，更新 timeLeft
watch(duration, (newValue) => {
  timeLeft.value = newValue
})

// 格式化時間函數
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 開始/停止呼吸練習
const toggleBreathing = () => {
  if (isStarted.value) {
    // 停止呼吸練習
    stopBreathing()
  } else {
    // 開始呼吸練習
    startBreathing()
  }
}

// 開始呼吸練習
const startBreathing = () => {
  isStarted.value = true
  timeLeft.value = duration.value // 設置計時時間
  showCompletionOverlay.value = false // 確保覆蓋層隱藏

  // 開始呼吸動畫循環
  breathInterval = setInterval(() => {
    // 每4秒切換一次呼吸階段
    currentPhase.value = currentPhase.value === '吸' ? '吐' : '吸'
  }, 4000)

  // 開始倒數計時
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      // 時間到，停止練習並顯示完成覆蓋層
      stopBreathing()
      showCompletionOverlay.value = true
    }
  }, 1000)
}

// 停止呼吸練習
const stopBreathing = () => {
  isStarted.value = false
  currentPhase.value = '吸'

  // 清除所有計時器
  if (breathInterval) {
    clearInterval(breathInterval)
    breathInterval = null
  }

  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 解除完成覆蓋層
const dismissOverlay = () => {
  showCompletionOverlay.value = false
}

// 組件卸載前清理計時器
onBeforeUnmount(() => {
  if (breathInterval) clearInterval(breathInterval)
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style lang="scss" scoped>
.breath-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.content-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  z-index: 1;
  padding: 2rem;
}

/* 桌面布局 */
.desktop-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 3rem;
}

/* 控制面板 */
.control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  height: 180px;
}

/* 時間選擇 */
.duration-toggle {
  .q-btn {
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    opacity: 0.6;

    &:hover {
      opacity: 0.8;
    }
  }

  .active-duration {
    background-color: rgba(255, 255, 255, 0.3);
    opacity: 1;
  }
}

/* 計時器顯示 */
.timer-display {
  width: 150px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  animation: timer-fade-in 0.5s ease-out;

  .time-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .time-label {
    font-size: 1rem;
    opacity: 0.8;
  }
}

@keyframes timer-fade-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 左側面板 */
.left-panel .duration-toggle {
  display: flex;
  flex-direction: column;

  .q-btn {
    margin: 2px 0;
    border-radius: 15px;
  }
}

/* 右側面板 */
.right-panel .control-btn {
  font-size: 1.2rem;
  padding: 10px 20px;
}

/* 呼吸圈圈容器 */
.breath-circle-container {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止圈圈被壓縮 */
}

/* 其他圈圈相關樣式保持不變 */
.rotating-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 2;
  animation: rotate 20s linear infinite;
}

.circle-text {
  font-family: 'Dela Gothic One', cursive;
  fill: white;
  font-size: 11.7px;
  letter-spacing: 1px;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.reference-circle,
.breath-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.breath-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3.5rem;
  opacity: 0;
  z-index: 10;

  // 吸氣文字樣式 - 藍色主題
  &.inhale {
    color: #FFF;
    font-family: 'Dela Gothic One';
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    animation: inhale-animation 4s ease-in-out;
    letter-spacing: 2px;
  }

  // 呼氣文字樣式 - 橙色主題
  &.exhale {
    color: #FFF;
    font-family: 'Dela Gothic One';
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    animation: exhale-animation 4s ease-in-out;
    letter-spacing: 2px;
  }
}

// 吸氣動畫 - 從小變大並淡入淡出
@keyframes inhale-animation {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  90% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

// 呼氣動畫 - 從大變小並淡入淡出
@keyframes exhale-animation {
  0% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  90% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
}

.animate-breath {
  animation: breathe 8s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
}

/* 手機版頂部控制區域 */
.mobile-top-controls {
  display: none; /* 默認在桌面版隱藏 */
  margin-bottom: 1.5rem;
  width: 100%;
  justify-content: center;

  /* 統一高度變量 */
  --control-height: 46px;

  .duration-toggle {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    padding: 5px;
    height: var(--control-height);

    .q-btn {
      font-size: 0.9rem;
      padding: 8px 12px;

      &.active-duration {
        background-color: white;
        color: #6c7a89;
      }
    }
  }

  .timer-display {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    height: var(--control-height);
    box-sizing: border-box;

    .time-value {
      font-size: 1.2rem;
      margin: 0;
    }

    .time-label {
      font-size: 0.9rem;
    }
  }
}

/* 手機版底部控制按鈕 - 修改類名避免衝突 */
.mobile-bottom-controls {
  display: none; /* 默認隱藏 */
  justify-content: center;
  margin-top: 2rem;
  width: 100%;

  .control-btn {
    font-size: 1.2rem;
    padding: 10px 40px;
    min-width: 150px;
  }
}

/* 響應式調整 */
@media (max-width: 768px) {
  .content-container {
    padding: 20px; /* 確保在小屏幕上有足夠的間距 */
  }

  /* 調整桌面布局為垂直方向 */
  .desktop-layout {
    flex-direction: column;
    gap: 1rem;
  }

  /* 隱藏桌面版控制面板 */
  .control-panel {
    display: none !important; /* 使用!important確保隱藏 */
  }

  /* 顯示手機版頂部控制區域 */
  .mobile-top-controls {
    display: flex !important; /* 確保顯示 */
  }

  /* 顯示手機版底部控制按鈕 */
  .mobile-bottom-controls {
    display: flex !important; /* 確保顯示 */
  }

  /* 圓圈大小調整 */
  .breath-circle-container {
    width: 250px;
    height: 250px;
  }
}

/* 小手機屏幕進一步調整 */
@media (max-width: 480px) {
  .content-container {
    padding: 15px;
  }

  .breath-circle-container {
    width: 220px;
    height: 220px;
  }

  .mobile-top-controls {
    .duration-toggle .q-btn {
      font-size: 0.8rem;
      padding: 6px 10px;
    }
  }

  .mobile-bottom-controls .control-btn {
    font-size: 1.1rem;
    padding: 8px 30px;
  }
}

/* 完成覆蓋層樣式 */
.completion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.5s ease;
}

.completion-circle {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 70%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
  animation: pulseGlow 2s infinite alternate ease-in-out;
  cursor: default;
}

.completion-text {
  font-size: 3rem;
  font-weight: bold;
  color: #444;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.completion-hint {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 20px;
  font-size: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulseGlow {
  from {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
    transform: scale(1);
  }
  to {
    box-shadow: 0 0 50px rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
  }
}
</style>
