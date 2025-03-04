<template>
  <div class="brain-eyes-wrapper" data-scroll data-scroll-speed="1">
    <!-- 大腦部分 -->
    <div class="brain-container"
        @mouseover="showColorBrain = true"
        @mouseleave="showColorBrain = false"
        @click="$emit('brain-click')">

      <!-- 眼睛部分 - 絕對定位到腦容器上 -->
      <div class="eyes-container" v-if="showEyes">
        <Eye
          ref="leftEyeRef"
          class="left-eye"
          :size="calculatedEyeSize"
          :screen-size="screenSize"
          :style="{ left: `calc(50% - ${calculatedEyePosition}px)` }"
        />
        <Eye
          ref="rightEyeRef"
          class="right-eye"
          :size="calculatedEyeSize"
          :screen-size="screenSize"
          :style="{ right: `calc(50% - ${calculatedEyePosition}px)` }"
        />
      </div>

      <!-- 旋轉文字圓圈 - 僅在hover時顯示 -->
      <div class="rotating-text-container" v-show="showColorBrain">
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
              登入以開始記錄腦
            </textPath>
          </text>
        </svg>
      </div>

      <!-- 大標題文字 -->
      <div v-show="showColorBrain" class="brain-title">
        <h3 class="brain-main-title Dela-gothic-one-stable">{{ brainTitle }}</h3>
      </div>

      <!-- 變色版腦 -->
      <img
        v-show="showColorBrain"
        :src="colorBrainSrc"
        class="brain-img color-brain"
        :style="{ width: `${brainSize}px` }"
      >

      <!-- 原始腦圖片 -->
      <img
        :src="originalBrainSrc"
        class="brain-img original-brain"
        :style="{ width: `${brainSize}px`, opacity: showColorBrain ? 0 : 1 }"
      >
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Eye from './EyeMove.vue'
import brainColorImg from '@/assets/brain_rgb_gra.png'
import brainOriginalImg from '@/assets/brain_rgb_onlybrain.png'

const props = defineProps({
  brainSize: {
    type: Number,
    default: 500
  },
  screenSize: {
    type: String,
    default: 'md'
  },
  showEyes: {
    type: Boolean,
    default: true
  },
  colorBrainSrc: {
    type: String,
    default: brainColorImg
  },
  originalBrainSrc: {
    type: String,
    default: brainOriginalImg
  },
  // 眼睛大小比例 (相對於腦大小)
  eyeSizeRatio: {
    type: Number,
    default: 0.12 // 眼睛大小為腦大小的 12%
  },
  // 眼睛間距比例 (相對於腦大小)
  eyeGapRatio: {
    type: Number,
    default: 0.3 // 眼睛間距為腦大小的 30%
  }
})

defineEmits(['brain-click'])

const showColorBrain = ref(false)

// 計算眼睛的大小 (基於腦大小的比例)
const calculatedEyeSize = computed(() => {
  return Math.round(props.brainSize * props.eyeSizeRatio)
})

// 計算眼睛的位置 (基於腦大小的比例)
const calculatedEyePosition = computed(() => {
  return Math.round(props.brainSize * props.eyeGapRatio / 2)
})
</script>

<style lang="scss" scoped>
/* 腦和眼睛容器 */
.brain-eyes-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 腦部分 */
.brain-container {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

/* 眼睛部分 - 絕對定位 */
.eyes-container {
  position: absolute;
  top: 35%;
  left: 0;
  width: 100%;
  height: 0; /* 確保容器不佔高度 */
  z-index: 5;  /* 確保在腦上方 */
}

.left-eye, .right-eye {
  position: absolute;
  transition: all 0.3s ease;
}

/* 旋轉文字圓圈樣式 */
.rotating-text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  z-index: 4;
  animation: rotate 15s linear infinite;
  opacity: 0.8;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.rotating-text {
  width: 100%;
  height: 100%;
}

.circle-text {
  font-family: 'Dela Gothic One', cursive;
  font-size: 15px;
  fill: $primary;
  letter-spacing: 1px;
}

.brain-img {
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
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  text-align: center;
  transition: opacity 0.3s ease;
}

.brain-main-title {
  margin: 0;
  font-size: 1.5rem;
  color: white;
  font-family: 'Dela Gothic One', cursive;
}

/* 腦狀態標題 */
.brain-status-title {
  margin-top: 20px;
  text-align: center;
}

.Dela-gothic-one-text {
  font-family: 'Dela Gothic One', cursive;
  font-size: 1.5rem;
  color: white;
  margin: 0;
}
</style>
