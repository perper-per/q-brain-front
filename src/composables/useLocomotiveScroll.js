import { ref, onBeforeUnmount } from 'vue'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

export function useLocomotiveScroll() {
  const locomotiveInstance = ref(null)

  // 初始化 Locomotive Scroll
  const initLocomotiveScroll = ({ speed = 0.5, smoothness = 0.05, ...otherOptions } = {}) => {
    // 先銷毀現有實例
    destroyLocomotiveScroll()

    const defaultOptions = {
      el: document.querySelector('[data-scroll-container]'),
      smooth: false, // 完全關閉平滑滾動
      multiplier: speed,
      class: 'is-inview',
      lerp: smoothness,
      smartphone: {
        smooth: false,
      },
      tablet: {
        smooth: false,
        breakpoint: 1024,
      },
      // 關閉不必要的功能
      scrollFromAnywhere: false,
      touchMultiplier: 1,
      resetNativeScroll: true,
    }

    // 合併選項
    const scrollOptions = { ...defaultOptions, ...otherOptions }

    // 如果找不到容器元素，提前返回
    if (!scrollOptions.el) {
      console.warn('找不到 data-scroll-container 元素')
      return null
    }

    try {
      // 初始化 Locomotive Scroll
      locomotiveInstance.value = new LocomotiveScroll(scrollOptions)
      console.log('Locomotive Scroll 已初始化:', locomotiveInstance.value)

      // 只添加窗口大小變化事件
      window.addEventListener('resize', () => {
        locomotiveInstance.value?.update()
      })

      return locomotiveInstance.value
    } catch (error) {
      console.error('初始化 Locomotive Scroll 失敗:', error)
      return null
    }
  }

  // 滾動到特定元素
  const scrollTo = (target, options = {}) => {
    if (!locomotiveInstance.value) return

    console.log(`滾動到: ${target}`, options)
    locomotiveInstance.value.scrollTo(target, {
      offset: -60, // 預設往上偏移，避免被標頭擋住
      duration: 1000, // 滾動動畫持續時間 (毫秒)
      disableLerp: false, // 使用插值 (平滑效果)
      ...options,
    })
  }

  // 更新滾動項目
  const update = () => {
    locomotiveInstance.value?.update()
  }

  // 銷毀 locomotive 實例
  const destroyLocomotiveScroll = () => {
    if (locomotiveInstance.value) {
      console.log('銷毀 Locomotive Scroll')
      locomotiveInstance.value.destroy()
      locomotiveInstance.value = null
    }
  }

  // 確保在組件銷毀時清理資源
  onBeforeUnmount(() => {
    destroyLocomotiveScroll()
  })

  return {
    initLocomotiveScroll,
    scrollTo,
    update,
    destroyLocomotiveScroll,
    locomotiveInstance,
  }
}
