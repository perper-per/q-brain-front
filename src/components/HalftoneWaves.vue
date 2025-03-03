<template>
  <canvas ref="canvasRef" class="halftone-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let animationFrameId = null
let time = 0
let resizeCanvas = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const drawHalftoneWave = () => {
    const gridSize = 20
    const rows = Math.ceil(canvas.height / gridSize)
    const cols = Math.ceil(canvas.width / gridSize)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const centerX = x * gridSize
        const centerY = y * gridSize
        const distanceFromCenter = Math.sqrt(
          (centerX - canvas.width / 2) ** 2 +
          (centerY - canvas.height / 2) ** 2
          // Math.pow(centerX - canvas.width / 2, 2) +
          // Math.pow(centerY - canvas.height / 2, 2)
        )
        const maxDistance = Math.sqrt(
          (canvas.width / 2) ** 2 +
          (canvas.height / 2) ** 2
        )
        const normalizedDistance = distanceFromCenter / maxDistance

        const waveOffset = Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5
        const size = gridSize * waveOffset * 0.8

        ctx.beginPath()
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(150, 150, 150, ${waveOffset * 0.5})`
        ctx.fill()
      }
    }
  }

  const animate = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawHalftoneWave()

    time += 0.05
    animationFrameId = requestAnimationFrame(animate)
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  animate()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (resizeCanvas) {
    window.removeEventListener('resize', resizeCanvas)
  }
})
</script>

<style lang="scss">
$background-dark: rgba(18, 18, 18, 0.9);  // 深色模式背景
$background-light: rgba(255, 255, 255, 0.9);  // 淺色模式背景
$animation-duration: 0.5s;
$transition-duration: 0.3s;

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.halftone-canvas {
  display: block;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  transition: background-color $transition-duration ease;

  // 深色模式
  body.body--dark & {
    background-color: $background-dark;
  }

  // 淺色模式
  body.body--light & {
    background-color: $background-light;
  }

  animation: fadeIn $animation-duration ease-in-out;

  @media (max-width: 768px) {
    height: 100dvh;
  }

  @media (min-resolution: 2dppx) {
    image-rendering: pixelated;
  }
}
</style>
