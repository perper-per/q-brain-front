import { ref, watch } from 'vue'

// 使用 localStorage 存儲待辦事項的函數
export function useLocalNotes() {
  // 從 localStorage 獲取數據，如果不存在則使用空數組
  const storedNotes = localStorage.getItem('todo-notes')
  const initialNotes = storedNotes ? JSON.parse(storedNotes) : []

  // 創建響應式引用
  const notes = ref(initialNotes)

  // 監聽變化並保存到 localStorage
  watch(
    notes,
    (newNotes) => {
      localStorage.setItem('todo-notes', JSON.stringify(newNotes))
    },
    { deep: true }, // 深度監聽，以捕獲數組內部對象的變化
  )

  return notes
}

// 生成獨特的 ID 函數
export function generateId() {
  return Date.now().toString()
}

// 格式化日期時間函數
export function formatDateTime(timestamp) {
  const date = new Date(timestamp)
  const dateString = date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const timeString = date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return `${dateString} ${timeString}`
}
