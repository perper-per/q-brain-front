import { defineStore } from 'pinia'
import { useNoteStore } from './noteStore'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [],
    currentIndex: -1,
  }),

  actions: {
    addToHistory(action) {
      // 移除當前位置之後的歷史記錄
      this.history = this.history.slice(0, this.currentIndex + 1)
      this.history.push(action)
      this.currentIndex++
    },

    async undo() {
      if (this.currentIndex < 0) return

      const noteStore = useNoteStore()
      const action = this.history[this.currentIndex]

      try {
        switch (action.type) {
          case 'delete':
            await noteStore.createNote(action.note)
            break
          case 'update':
            await noteStore.updateNote(action.noteId, action.oldData)
            break
          // 可以添加其他類型的操作
        }
        this.currentIndex--
      } catch (error) {
        console.error('撤銷失敗:', error)
      }
    },

    async redo() {
      if (this.currentIndex >= this.history.length - 1) return

      const noteStore = useNoteStore()
      const action = this.history[this.currentIndex + 1]

      try {
        switch (action.type) {
          case 'delete':
            await noteStore.deleteNote(action.note._id)
            break
          case 'update':
            await noteStore.updateNote(action.noteId, action.newData)
            break
        }
        this.currentIndex++
      } catch (error) {
        console.error('重做失敗:', error)
      }
    },
  },
})
