import { useNoteStore } from '../stores/noteStore';
import { useQuasar } from 'quasar';
import { ref, computed, onMounted, watch } from 'vue'
// import { useDraggable } from '@vueuse/core'

export function useNoteActions() {
  const noteStore = useNoteStore()
  const $q = useQuasar()

  // 簡化移動視圖檢測，移除 watchEffect
  const isMobileView = computed(() => {
    return $q.platform.is.mobile || ($q.screen && $q.screen.lt.sm)
  })

  // 只在初始化時設置一次移動視圖狀態
  onMounted(() => {
    // 使用新的處理視圖轉換的方法
    if (noteStore.handleViewModeChange) {
      noteStore.handleViewModeChange(isMobileView.value)
    } else if (noteStore.setMobileView) {
      // 兼容舊版
      noteStore.setMobileView(isMobileView.value)
    }
  })

  // 監聽視圖模式變化
  watch(isMobileView, (newValue) => {
    if (noteStore.handleViewModeChange) {
      noteStore.handleViewModeChange(newValue)
    } else if (noteStore.setMobileView) {
      noteStore.setMobileView(newValue)
    }
  })

  // 加入防抖功能
  const updateDebounces = new Map()

  // 拖曳相關狀態
  const isDragging = ref(false)
  const dragStart = ref({ x: 0, y: 0, noteX: 0, noteY: 0 })

  // 顏色選項
  const colorOptions = [
    { light: '#ffd700', dark: '#ffa000', text: '#000000' }, // 黃色
    { light: '#f8bbd0', dark: '#ec407a', text: '#000000' }, // 粉色
    { light: '#b3e5fc', dark: '#29b6f6', text: '#000000' }, // 藍色
    { light: '#c8e6c9', dark: '#66bb6a', text: '#000000' }, // 綠色
    { light: '#ffccbc', dark: '#ff7043', text: '#000000' }, // 橙色
    { light: '#d1c4e9', dark: '#7e57c2', text: '#ffffff' }, // 紫色
    { light: '#cfd8dc', dark: '#78909c', text: '#ffffff' }, // 灰色
    { light: '#ffffff', dark: '#f5f5f5', text: '#000000' }, // 白色
  ]

  // 更新便條位置
  const updateNotePosition = async (noteId, x, y) => {
    try {
      // 如果是手機視圖，則忽略 x, y 更新
      if (isMobileView.value) {
        return true
      }

      // 確保座標是有效的數字
      if (
        !noteId ||
        typeof x !== 'number' ||
        typeof y !== 'number' ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
      ) {
        return false
      }

      // 查找當前便條
      const note = noteStore.notes.find((n) => n._id === noteId)
      if (!note) return false

      // 檢查位置是否實際變化（考慮四捨五入）
      if (Math.abs(note.x - x) < 1 && Math.abs(note.y - y) < 1) {
        return true // 位置接近，視為未變化
      }

      // 清除之前的定時器
      if (updateDebounces.has(noteId)) {
        clearTimeout(updateDebounces.get(noteId))
      }

      // 建立新的定時器
      const timerId = setTimeout(async () => {
        // 再次確認便條存在且位置有變化
        const currentNote = noteStore.notes.find((n) => n._id === noteId)
        if (currentNote && (Math.abs(currentNote.x - x) >= 1 || Math.abs(currentNote.y - y) >= 1)) {
          await noteStore.updateNote(noteId, { x, y })
        }
        updateDebounces.delete(noteId)
      }, 400) // 延長防抖時間

      updateDebounces.set(noteId, timerId)

      // 立即更新本地狀態以保持UI反應靈敏
      noteStore.$patch((state) => {
        const index = state.notes.findIndex((n) => n._id === noteId)
        if (index !== -1) {
          state.notes[index].x = x
          state.notes[index].y = y
        }
      })

      return true
    } catch (error) {
      console.error('更新位置失敗:', error)
      return false
    }
  }

  // 切換緊急狀態
  const toggleUrgent = async (noteId, currentState) => {
    try {
      const newState = !currentState
      await noteStore.updateNote(noteId, {
        isUrgent: newState,
        titleColor: newState ? '#FF0000' : '#000000',
      })

      $q.notify({
        message: newState ? '已設為緊急' : '已取消緊急',
        color: newState ? 'red' : 'primary',
        position: 'top',
        timeout: 1000,
      })

      return newState
    } catch (error) {
      console.error('切換緊急狀態失敗:', error)
      $q.notify({
        message: '操作失敗',
        color: 'negative',
        position: 'top',
      })
      return currentState
    }
  }

  // 複製便條
  const duplicateNote = async (note) => {
    try {
      const newNote = {
        ...note,
        _id: undefined, // 移除 ID 以創建新記錄
        x: note.x + 20, // 稍微偏移位置
        y: note.y + 20,
      }

      await noteStore.addNote(newNote)

      $q.notify({
        message: '便條已複製',
        color: 'positive',
        position: 'top',
        timeout: 1000,
      })

      return true
    } catch (error) {
      console.error('複製便條失敗:', error)
      $q.notify({
        message: '複製失敗',
        color: 'negative',
        position: 'top',
      })
      return false
    }
  }

  // 刪除便條
  const deleteNote = async (noteId) => {
    try {
      await noteStore.deleteNote(noteId)

      $q.notify({
        message: '便條已刪除',
        color: 'primary',
        position: 'top',
        timeout: 1000,
      })

      return true
    } catch (error) {
      console.error('刪除便條失敗:', error)
      $q.notify({
        message: '刪除失敗',
        color: 'negative',
        position: 'top',
      })
      return false
    }
  }

  // 保存便條
  const saveNote = async (noteId, updates) => {
    try {
      await noteStore.updateNote(noteId, updates)
      return true
    } catch (error) {
      console.error('保存失敗:', error)
      $q.notify({
        message: '保存失敗',
        color: 'negative',
      })
      return false
    }
  }

  // 處理拖曳開始
  const handleDragStart = (e, note, currentPosition) => {
    // 如果點擊的是編輯區域，則不開始拖曳
    if (
      e.target.closest('.content-editor') ||
      e.target.closest('.title-input') ||
      e.target.closest('.tools-buttons')
    ) {
      return false
    }

    isDragging.value = true

    if (e.type.startsWith('touch')) {
      const touch = e.touches[0]
      dragStart.value = {
        x: touch.clientX,
        y: touch.clientY,
        noteX: currentPosition.x,
        noteY: currentPosition.y,
      }
    } else {
      dragStart.value = {
        x: e.clientX,
        y: e.clientY,
        noteX: currentPosition.x,
        noteY: currentPosition.y,
      }
    }

    // 更新 z-index
    noteStore.updateNoteZIndex(note._id)

    return true
  }

  // 處理拖曳過程
  const handleDrag = (e, forceMobile, currentPosition) => {
    if (forceMobile) return currentPosition
    if (!isDragging.value) return currentPosition

    let clientX
    let clientY

    if (e.type.startsWith('touch')) {
      const touch = e.touches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const dx = clientX - dragStart.value.x
    const dy = clientY - dragStart.value.y

    return {
      x: Math.max(0, dragStart.value.noteX + dx),
      y: Math.max(0, dragStart.value.noteY + dy),
    }
  }

  // 處理拖曳結束
  const handleDragEnd = async (noteId, position) => {
    if (!isDragging.value) return false

    isDragging.value = false

    // 更新數據庫中的位置
    await updateNotePosition(noteId, position.x, position.y)

    return true
  }

  // 更新便條顏色
  const changeNoteColor = async (noteId, colorObj) => {
    try {
      await noteStore.updateNote(noteId, { color: colorObj })
      return true
    } catch (error) {
      console.error('更新顏色失敗:', error)
      return false
    }
  }

  return {
    isMobileView,
    isDragging,
    updateNotePosition,
    toggleUrgent,
    duplicateNote,
    deleteNote,
    saveNote,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    colorOptions,
    changeNoteColor,
  }
}
