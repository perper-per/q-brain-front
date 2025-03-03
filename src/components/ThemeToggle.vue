<template>
  <q-btn
    flat
    dense
    round
    :icon="isDark ? 'dark_mode' : 'light_mode'"
    @click="changeTheme(isDark ? 'light' : 'dark')"
    class="theme-toggle"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 為不支援的瀏覽器添加 polyfill
if (!document.startViewTransition) {
  document.startViewTransition = (fn) => fn()
}

const isDark = ref(false)

function changeTheme(type) {
  document.startViewTransition(() => {
    if (type === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')  // 保存主題偏好
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  })
}

onMounted(() => {
  // 檢查保存的主題偏好
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})


// 更新指針位置
const updatePointerPosition = ($event) => {
  const pointerX = `${Math.floor($event.clientX / window.innerWidth * 100)}%`
  const pointerY = `${Math.floor($event.clientY / window.innerHeight * 100)}%`
  document.documentElement.style = `--pointerX: ${pointerX}; --pointerY: ${pointerY};`
}

// 更新觸控指針位置
const updateTouchPointerPosition = ($event) => {
  const pointerX = `${Math.floor($event.touches[0].clientX / window.innerWidth * 100)}%`
  const pointerY = `${Math.floor($event.touches[0].clientY / window.innerHeight * 100)}%`
  document.documentElement.style = `--pointerX: ${pointerX}; --pointerY: ${pointerY};`
}

onMounted(() => {
  // 檢查保存的主題偏好
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  // 添加事件監聽
  document.addEventListener('mousedown', updatePointerPosition)
  document.addEventListener('touchstart', updateTouchPointerPosition)
})
</script>
