<template>
  <div class="preface-fullscreen">
    <div id="vanta-background" class="vanta-container">
      <!-- 添加浮動標題 -->
      <div class="floating-title">
        <h1 class="fade-in super-large">{{ $t('preface.question') }}</h1>
      </div>

      <!-- 浮動視窗 -->
      <div class="floating-window">
        <p>{{ $t('preface.subtitle') }}</p>
        <q-btn
          class="entrance-btn"
          unelevated
          rounded
          :label="$t('preface.entrance')"
          @click="handleEntrance"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import BIRDS from 'vanta/dist/vanta.birds.min'

const router = useRouter()
let vantaEffect = null

onMounted(() => {
  document.body.classList.add('route-preface')
  vantaEffect = BIRDS({
    el: "#vanta-background",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    birdSize: 1.50,
    backgroundColor: 0x7a839d,
    color1: 0x3a627d,
    color2: 0xff5858,
    THREE: THREE,
    points: 10.00,
    spacing: 20.00,
    showDots: false,
    backgroundAlpha: 0.90
  })
})

onBeforeUnmount(() => {
  document.body.classList.remove('route-preface')
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})

const handleEntrance = () => {
  router.push('/site')
}
</script>

<style lang="scss">
body:has(.preface-fullscreen) .q-page-container {
  padding-top: 0 !important;
}

.route-preface .q-page-container {
  padding-top: 0 !important;
}

.preface-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;

  .q-page-container,
  .q-layout,
  .q-page {
    padding: 0 !important;
    margin: 0 !important;
    min-height: 100vh;
  }
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.super-large {
  font-size: 80vw;
  font-family: 'Shippori Mincho B1', serif;
  font-weight: 700;
}

.vanta-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-title {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  width: 80vw;
  height: auto;
  overflow: visible;

  h1 {
    color: white;
    margin: 0;
    padding: 0;
    opacity: 0;
    animation: fadeIn 2s ease-out forwards;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    line-height: 1;
    font-size: 8vw;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.floating-window {
  margin-top: 10vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 2rem 3rem;
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: skewX(-15deg);
    animation: shine 3s infinite;
  }

  p {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0;
    animation: fadeIn 2s ease-out 0.5s forwards;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 100%;
  }
}

.entrance-btn {
  font-size: 1.2rem;
  padding: 12px 36px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
}
</style>
