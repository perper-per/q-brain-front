<template>
  <svg :width="computedSize" :height="computedSize" class="eye" ref="eyeRef" :viewBox="`0 0 ${computedSize} ${computedSize}`">
    <circle
      :cx="computedCenter"
      :cy="computedCenter"
      :r="computedSize/2"
      fill="white"
      class="eyeball"
      ref="eyeBallRef"
    />
    <circle
      :cx="computedCenter"
      :cy="computedCenter"
      :r="computedSize/3"
      fill="#0D0D20"
      class="pupil"
      ref="pupilRef"
    />
  </svg>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  size: {
    type: Number,
    default: 60
  },
  screenSize: {
    type: String,
    default: 'lg'
  },
  maxRotation: {
    type: Number,
    default: 45
  }
})

const getMovementParams = computed(() => ({
  lg: { maxMove: 0.3, maxRotation: 45, transitionTime: '0.1s' },
  md: { maxMove: 0.28, maxRotation: 40, transitionTime: '0.09s' },
  sm: { maxMove: 0.25, maxRotation: 30, transitionTime: '0.08s' }
}[props.screenSize]))

const computedSize = computed(() => {
  const size = props.size
  return Math.max(size, 20)
})

const computedCenter = computed(() => computedSize.value / 2)

const eyeRef = ref(null)
const eyeBallRef = ref(null)
const pupilRef = ref(null)

const calculateEyeMovement = (mouseX, mouseY, eyeRect) => {
  const params = getMovementParams.value
  const R = eyeRect.width / 2
  const centerX = eyeRect.left + R
  const centerY = eyeRect.top + R

  const deltaX = mouseX - centerX
  const deltaY = mouseY - centerY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  const movementScale = Math.min(
    distance / ($q.screen.lt.sm ? window.innerWidth / 3 : window.innerWidth / 4),
    1
  )

  const maxMove = R * params.maxMove
  const moveX = (deltaX / distance) * maxMove * movementScale
  const moveY = (deltaY / distance) * maxMove * movementScale

  const theta = Math.atan2(deltaY, deltaX)
  let angle = (theta * 180 / Math.PI + 360) % 360

  const maxRotation = params.maxRotation
  if (angle > 180) {
    angle = Math.max(360 - maxRotation, angle)
  } else {
    angle = Math.min(maxRotation, angle)
  }

  return {
    moveX: Number.isNaN(moveX) ? 0 : moveX,
    moveY: Number.isNaN(moveY) ? 0 : moveY,
    angle
  }
}

const handleMouseMove = (e) => {
  const eye = eyeBallRef.value
  const pupil = pupilRef.value
  if (!eye || !pupil) return

  const eyeRect = eye.getBoundingClientRect()
  const { moveX, moveY, angle } = calculateEyeMovement(e.clientX, e.clientY, eyeRect)

  pupil.style.transform = `
    translate(${moveX}px, ${moveY}px)
    rotate(${angle}deg)
  `
}

const throttle = (func, limit) => {
  let inThrottle = false
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      const timer = setTimeout(() => {
        inThrottle = false
        clearTimeout(timer)
      }, limit)
    }
  }
}

const throttledMouseMove = throttle(handleMouseMove, 16)

onMounted(() => {
  document.addEventListener('mousemove', throttledMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', throttledMouseMove)
})
</script>

<style lang="scss" scoped>
.eye {
  margin: auto;
  position: relative;
  overflow: visible;
  min-width: 20px;
  min-height: 20px;
}

.pupil {
  position: relative;
  transform-origin: center;

  @media (max-width: $breakpoint-md-max) {
    transition: transform 0.09s ease;
  }

  @media (max-width: $breakpoint-sm-max) {
    transition: transform 0.08s ease;
  }
}

.eyeball {
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));

  @media (max-width: $breakpoint-md-max) {
    filter: drop-shadow(0 0 4px rgba(0,0,0,0.2));
  }

  @media (max-width: $breakpoint-sm-max) {
    filter: drop-shadow(0 0 3px rgba(0,0,0,0.2));
  }
}
</style>
