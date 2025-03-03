import { defineStore } from 'pinia'
import { apiAuth } from '@/composables/axios'

// 默認尺寸常量
const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 200

// 新增便條的默認數據
export const defaultNote = {
  title: '新便條',
  content: '',
  isExpanded: true,
  isUrgent: false,
  titleColor: '#000000',
  x: 0,
  y: 0,
  color: {
    light: '#ffd700',
    dark: '#ffa000',
  },
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
}

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [],
    lastZIndex: 1,
    loading: false,
    error: null,
    isMobileView: false,
    isUpdatingPositions: false,
  }),

  getters: {
    orderedNotes: (state) => {
      if (state.isUpdatingPositions) {
        return state.notes
      }

      if (state.isMobileView) {
        return [...state.notes].sort((a, b) => {
          return (a.position ?? Number.POSITIVE_INFINITY) - (b.position ?? Number.POSITIVE_INFINITY)
        })
      }

      return [...state.notes].sort((a, b) => {
        return a.zIndex - b.zIndex
      })
    },
    notesCount: (state) => (Array.isArray(state.notes) ? state.notes.length : 0),
  },

  actions: {
    setMobileView(isMobile) {
      if (this.isMobileView !== isMobile) {
        this.isMobileView = isMobile
        console.log('視圖模式已更新為:', isMobile ? '移動版' : '桌面版')
      }
    },

    async loadNotes() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('未登入或缺少令牌')
          throw new Error('未登入')
        }

        console.log('發送便條請求，令牌:', `${token.substring(0, 10)}...`)

        const response = await apiAuth.get('/api/notes')

        console.log('便條響應:', response)

        if (Array.isArray(response.data)) {
          this.notes = response.data
        } else if (response.data && Array.isArray(response.data.result)) {
          this.notes = response.data.result
        } else if (response.data && Array.isArray(response.data.notes)) {
          this.notes = response.data.notes
        } else {
          console.warn('無法識別便條數據格式:', response.data)
          this.notes = []
        }

        console.log('便條數量:', this.notes.length)
        return this.notes
      } catch (error) {
        console.error('載入便條時出錯:', error)
        this.error = error.message || '載入便條失敗'
        this.notes = [] // 確保在錯誤時重置為空數組
        throw error
      } finally {
        this.loading = false
      }
    },

    async addNote(noteData) {
      try {
        const newNote = {
          ...defaultNote,
          x: noteData.x || 50,
          y: noteData.y || 50,
          ...noteData,
          zIndex: this.lastZIndex + 1,
        }

        console.log('發送的便條數據:', newNote)
        const response = await apiAuth.post('/api/notes', newNote)
        console.log('服務器響應:', response.data)

        this.lastZIndex += 1
        this.notes.push(response.data.result)

        return response.data.result
      } catch (error) {
        console.error('新增便條失敗:', error.response?.data || error)
        throw error
      }
    },

    async updateNote(noteId, updates) {
      try {
        console.log('更新便條:', { noteId, updates })

        // 修改請求路徑和方法，使用標準的 RESTful 格式
        const response = await apiAuth.patch(`/api/notes/${noteId}`, updates)

        const updatedNote = response.data.result

        const index = this.notes.findIndex((note) => note._id === noteId)
        if (index !== -1) {
          this.notes[index] = { ...this.notes[index], ...updatedNote }
        }

        return updatedNote
      } catch (error) {
        console.error('更新便條失敗:', error)
        throw error
      }
    },

    async deleteNote(id) {
      try {
        console.log('準備刪除便條:', id)
        await apiAuth.delete(`/api/notes/${id}`)
        this.notes = this.notes.filter((note) => note._id !== id)
        return true
      } catch (error) {
        console.error('刪除便條失敗:', error)
        throw error
      }
    },

    async updateNoteZIndex(noteId) {
      this.lastZIndex += 1
      const note = this.notes.find((n) => n._id === noteId)
      if (!note) return

      note.zIndex = this.lastZIndex

      try {
        await this.updateNote(noteId, { zIndex: this.lastZIndex })
        return this.lastZIndex
      } catch (error) {
        console.error('更新 z-index 失敗:', error)
        throw error
      }
    },

    async createNote(note) {
      const response = await apiAuth.post('/api/notes', {
        title: note.title,
        content: note.content || '',
        position: note.position,
      })
      return response.data
    },

    // 新增一個批量更新方法，用於減少請求次數
    async updateMultipleNotes(updates) {
      if (!Array.isArray(updates) || updates.length === 0) return []

      try {
        // 過濾出實際需要更新的便條
        const validUpdates = updates.filter(
          (update) => update && update.id && Object.keys(update.data).length > 0,
        )

        if (validUpdates.length === 0) return []

        // 如果只有一個便條需要更新，使用普通更新方法
        if (validUpdates.length === 1) {
          const { id, data } = validUpdates[0]
          return [await this.updateNote(id, data)]
        }

        // 發送批量更新請求
        const response = await apiAuth.post('/api/notes/batch', { updates: validUpdates })

        // 更新本地狀態
        if (response.data.results) {
          for (const updatedNote of response.data.results) {
            const index = this.notes.findIndex((note) => note._id === updatedNote._id)
            if (index !== -1) {
              this.notes[index] = { ...this.notes[index], ...updatedNote }
            }
          }
        }

        return response.data.results || []
      } catch (error) {
        console.error('批量更新便條失敗:', error)
        throw error
      }
    },
  },
})

// 導出默認值以供其他組件使用
export { DEFAULT_WIDTH, DEFAULT_HEIGHT }
