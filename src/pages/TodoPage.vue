<template>
  <q-page padding>
    <Container>
      <!-- 詳情頁模式 -->
      <div v-if="showDetail">
        <div class="row justify-between items-center q-mb-md">
          <h3>{{ currentNote?.title || '待辦詳情' }}</h3>
          <q-btn color="primary" icon="arrow_back" label="返回" @click="backToList" />
        </div>

        <!-- 編輯模式 -->
        <div v-if="editing && currentNote">
          <q-input class="q-mb-md" v-model="editNote.title" label="標題" outlined />
          <q-input class="q-mb-md" v-model="editNote.description" label="描述" outlined />
          <q-card flat bordered class="q-mt-sm">
            <q-editor v-model="editNote.content" min-height="5rem" />
          </q-card>

          <div class="row justify-end q-mt-md">
            <q-btn color="grey" label="取消" @click="cancelEdit" class="q-mr-sm" />
            <q-btn color="primary" label="保存" @click="saveEdit" />
          </div>
        </div>

        <!-- 查看模式 -->
        <div v-else-if="currentNote">
          <div class="row items-center justify-between">
            <h3 class="q-mb-md q-mt-md">{{ currentNote.title }}</h3>
            <div>
              <q-btn
                round
                color="secondary"
                icon="edit"
                @click="startEdit"
              />
              <q-btn
                class="q-ml-sm"
                round
                color="red"
                icon="delete"
                @click="removeNote"
              />
            </div>
          </div>
          <div>{{ currentNote.description }}</div>
          <div class="text-caption">更新時間：{{ currentNote.updatedAt }}</div>
          <div class="q-mt-md" v-html="currentNote.content" />
        </div>

        <!-- 找不到待辦的情況 -->
        <div v-else class="text-center q-pa-lg">
          <p>找不到對應的待辦事項</p>
          <q-btn color="primary" label="返回列表" @click="backToList" />
        </div>
      </div>

      <!-- 列表頁模式 -->
      <div v-else>
        <div class="row justify-between items-center q-mb-md">
          <h3>我的待辦事項</h3>
          <div>
            <q-btn
              color="primary"
              icon="add"
              label="新增待辦"
              to="/site/todo-new"
              class="q-mr-sm"
            />
            <q-btn
              color="secondary"
              icon="text_snippet"
              label="批量輸入"
              @click="showBulkInput = true"
            />
          </div>
        </div>

        <!-- 待辦事項列表 -->
        <div>
          <h5 class="q-my-md">進行中的事項</h5>
          <q-list separator v-if="activeTasks.length > 0">
            <q-item v-for="task in activeTasks" :key="task.id" clickable>
              <q-item-section avatar>
                <q-checkbox v-model="task.completed" @update:model-value="completeTask(task)" />
              </q-item-section>

              <q-item-section @click="goToDetail(task.createdAt)">
                <q-item-label>{{ task.title }}</q-item-label>
                <q-item-label caption>{{ task.description }}</q-item-label>
                <q-item-label caption>{{ task.updatedAt }}</q-item-label>

                <!-- 添加子任務顯示 -->
                <div v-if="task.subTasks && task.subTasks.length > 0" class="q-mt-xs">
                  <q-list dense class="subtasks-list">
                    <q-item v-for="subTask in task.subTasks" :key="subTask.id" dense class="q-py-none">
                      <q-item-section avatar class="q-pr-none">
                        <q-checkbox
                          v-model="subTask.completed"
                          @click.stop
                          @update:model-value="toggleSubTask(task.createdAt, subTask.id)"
                        />
                      </q-item-section>
                      <q-item-section :class="{ 'text-strike': subTask.completed }">
                        <q-item-label caption>{{ subTask.title }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-item-section>

              <q-item-section side>
                <q-btn flat round color="secondary" icon="edit" @click="goToDetail(task.createdAt)" />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-lg">
            <p>沒有進行中的事項</p>
          </div>

          <!-- 已完成事項 -->
          <h5 class="q-my-md">已完成的事項</h5>
          <q-list separator v-if="completedTasks.length > 0">
            <q-item v-for="task in completedTasks" :key="task.id" clickable class="completed-task">
              <q-item-section avatar>
                <q-checkbox v-model="task.completed" @update:model-value="uncompleteTask(task)" />
              </q-item-section>

              <q-item-section @click="goToDetail(task.createdAt)">
                <q-item-label class="text-strike">{{ task.title }}</q-item-label>
                <q-item-label caption>{{ task.description }}</q-item-label>
                <q-item-label caption>完成於: {{ task.completedAt }}</q-item-label>
                <q-chip v-if="task.inFlow" color="positive" text-color="white" size="sm">心流</q-chip>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-lg">
            <p>沒有已完成的事項</p>
          </div>
        </div>
      </div>
    </Container>

    <!-- 批量輸入對話框 -->
    <q-dialog v-model="showBulkInput" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">批量輸入待辦事項</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="bulkText"
            type="textarea"
            filled
            autofocus
            placeholder="請輸入待辦事項清單，AI將自動分析主任務和子任務關係..."
            rows="12"
            hint="範例格式：&#10;1. 完成專案報告&#10;   - 整理數據&#10;   - 撰寫摘要&#10;2. 預約牙醫&#10;   - 確認時間&#10;   - 預先填寫表格"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="grey" v-close-popup />
          <q-btn
            flat
            label="解析任務"
            color="primary"
            :loading="aiProcessing"
            :disable="!bulkText.trim()"
            @click="processWithAI"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 心流狀態對話框 -->
    <q-dialog v-model="showFlowDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">恭喜完成任務!</div>
        </q-card-section>

        <q-card-section>
          <p>完成這項任務時，你是否處於心流狀態？</p>
          <p class="text-caption">心流：高度專注，時間感消失，完全沉浸在任務中的狀態</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="否" color="grey" v-close-popup />
          <q-btn flat label="是" color="positive" @click="markTaskAsFlow" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 如果您希望在某個頁面顯示歷史記錄 -->
    <AIHistoryList @reuse-result="handleReuseResult" />
  </q-page>
</template>

<script setup>
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue'
import { useLocalNotes, formatDateTime } from 'src/helper'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import Container from 'src/components/ContainerComp.vue'
import { useAxios } from 'src/composables/axios'
import { useQuasar } from 'quasar'

const notes = useLocalNotes()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { apiAuth } = useAxios()

// 批量輸入相關狀態
const showBulkInput = ref(false)
const bulkText = ref('')
const aiProcessing = ref(false)

// 心流狀態對話框
const showFlowDialog = ref(false)
const currentCompletedTaskId = ref(null)

// 編輯模式狀態
const editing = ref(false)
const editNote = reactive({
  title: '',
  description: '',
  content: ''
})

// 檢查是否有 ID 參數
const showDetail = computed(() => !!route.params.id)

// 找到對應的待辦事項
const currentNote = computed(() => {
  if (!route.params.id) return null
  return notes.value.find(note => note.createdAt.toString() === route.params.id)
})

// 過濾出進行中和已完成的任務
const activeTasks = computed(() => {
  return notes.value.filter(note => !note.completed)
})

const completedTasks = computed(() => {
  return notes.value.filter(note => note.completed)
})

// 導航到詳情頁
const goToDetail = (id) => {
  router.push(`/site/todo/${id}`)
}

// 返回列表頁
const backToList = () => {
  if (editing.value) {
    const confirmLeave = confirm('有未保存的更改，確定要離開嗎？')
    if (!confirmLeave) return
    editing.value = false
  }
  router.push('/site/todo')
}

// 開始編輯
const startEdit = () => {
  if (!currentNote.value) return

  // 複製當前待辦到編輯對象
  editNote.title = currentNote.value.title
  editNote.description = currentNote.value.description
  editNote.content = currentNote.value.content

  editing.value = true
}

// 取消編輯
const cancelEdit = () => {
  editing.value = false
}

// 保存編輯
const saveEdit = () => {
  if (!currentNote.value) return

  // 更新待辦內容
  const index = notes.value.findIndex(note => note.createdAt.toString() === route.params.id)
  if (index !== -1) {
    // 更新內容但保留其他屬性（如創建時間）
    notes.value[index] = {
      ...notes.value[index],
      title: editNote.title,
      description: editNote.description,
      content: editNote.content,
      updatedAt: formatDateTime(Date.now())
    }

    editing.value = false
  }
}

// 刪除待辦
const removeNote = () => {
  if (!currentNote.value) return

  // 確認刪除
  if (confirm('確定要刪除這個待辦事項嗎？')) {
    const index = notes.value.findIndex(note => note.createdAt.toString() === route.params.id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      backToList()
    }
  }
}

// 完成任務
const completeTask = (task) => {
  const index = notes.value.findIndex(note => note.createdAt === task.createdAt)
  if (index !== -1) {
    notes.value[index] = {
      ...notes.value[index],
      completed: true,
      completedAt: formatDateTime(Date.now())
    }

    // 顯示心流對話框
    currentCompletedTaskId.value = task.createdAt
    showFlowDialog.value = true
  }
}

// 取消完成任務
const uncompleteTask = (task) => {
  const index = notes.value.findIndex(note => note.createdAt === task.createdAt)
  if (index !== -1) {
    notes.value[index] = {
      ...notes.value[index],
      completed: false,
      completedAt: null,
      inFlow: false
    }
  }
}

// 標記任務為心流狀態
const markTaskAsFlow = () => {
  if (!currentCompletedTaskId.value) return

  const index = notes.value.findIndex(note => note.createdAt === currentCompletedTaskId.value)
  if (index !== -1) {
    notes.value[index] = {
      ...notes.value[index],
      inFlow: true
    }
  }

  currentCompletedTaskId.value = null
}

// 使用 AI 處理批量輸入
const processWithAI = async () => {
  if (!bulkText.value.trim()) return

  aiProcessing.value = true

  try {
    // 準備傳送給 API 的數據
    const textToProcess = bulkText.value.trim()

    // 使用 apiAuth 而不是 axios 直接調用
    const { data } = await apiAuth.post('/api/ai/analyze-tasks', {
      text: textToProcess
    });

    if (!data.success) {
      throw new Error(data.message || '處理失敗');
    }

    // 獲取後端處理後的 AI 結果
    const aiResult = data.result;

    // 解析結果
    let parsedTasks
    try {
      parsedTasks = JSON.parse(aiResult)
    } catch (error) {
      console.error('AI 返回的不是有效 JSON:', aiResult, error)
      // 回退到簡單拆分
      return simpleTaskParsing(textToProcess)
    }

    // 處理解析後的任務
    const now = Date.now()

    for (let i = 0; i < parsedTasks.length; i++) {
      const task = parsedTasks[i]

      // 為子任務添加唯一ID (如果 AI 沒有提供)
      if (task.subTasks && task.subTasks.length > 0) {
        task.subTasks = task.subTasks.map(subTask => ({
          id: subTask.id || `${now}-${i}-${Math.random().toString(36).substring(2, 9)}`,
          title: subTask.title,
          completed: false
        }))
      }

      // 添加到待辦事項
      notes.value.unshift({
        title: task.title,
        description: task.description || '',
        content: task.description || '',
        createdAt: now - i, // 確保每個項目有唯一 ID
        updatedAt: formatDateTime(now),
        completed: false,
        subTasks: task.subTasks || [],
        order: i
      })
    }

    // 關閉對話框並清空輸入
    showBulkInput.value = false
    bulkText.value = ''

    // 顯示成功通知
    $q.notify({
      color: 'positive',
      message: '成功創建待辦事項',
      icon: 'check'
    })
  } catch (error) {
    console.error('AI 處理失敗:', error);
    $q.notify({
      type: 'negative',
      message: '無法處理待辦事項：' + (error.response?.data?.message || error.message),
      position: 'top'
    });

    // 如果 AI 處理失敗，回退到簡單的文本拆分
    simpleTaskParsing(bulkText.value)
  } finally {
    aiProcessing.value = false;
  }
}

// 簡單的任務解析 (作為 AI 分析失敗時的備用)
const simpleTaskParsing = (text) => {
  const lines = text.split('\n').filter(line => line.trim())
  const now = Date.now()
  const tasks = []

  let currentMainTask = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // 跳過空行
    if (!line) continue

    // 通過縮進或特殊字符判斷是否為子任務
    const isSubTask = line.startsWith('  ') || line.startsWith('\t') ||
                      line.startsWith('- ') || line.startsWith('* ') ||
                      /^\d+\.\s/.test(line)

    if (isSubTask && currentMainTask) {
      // 去除子任務前的特殊字符
      const subTaskTitle = line
        .replace(/^[\s\t]+/, '')
        .replace(/^[-*]\s+/, '')
        .replace(/^\d+\.\s+/, '')

      // 添加到當前主任務的子任務列表
      if (!currentMainTask.subTasks) {
        currentMainTask.subTasks = []
      }

      currentMainTask.subTasks.push({
        id: `${now}-${i}-${Math.random().toString(36).substring(2, 9)}`,
        title: subTaskTitle,
        completed: false
      })
    } else {
      // 這是一個新的主任務
      let title = line
      let description = ''

      // 簡單拆分為標題和描述
      if (line.includes(':')) {
        const parts = line.split(':')
        title = parts[0].trim()
        description = parts.slice(1).join(':').trim()
      }

      currentMainTask = {
        title,
        description,
        content: description,
        createdAt: now - i,
        updatedAt: formatDateTime(now),
        completed: false,
        subTasks: []
      }

      tasks.push(currentMainTask)
    }
  }

  // 將解析的任務添加到待辦事項列表
  tasks.forEach((task, index) => {
    notes.value.unshift({
      ...task,
      order: index
    })
  })

  // 關閉對話框並清空輸入
  showBulkInput.value = false
  bulkText.value = ''
}

// 路由守衛: 攔截路由離開事件
onBeforeRouteLeave((to, from, next) => {
  if (editing.value) {
    const confirmLeave = confirm('有未保存的更改，確定要離開嗎？')
    if (confirmLeave) {
      editing.value = false
      next()
    } else {
      next(false) // 取消導航
    }
  } else {
    next() // 正常導航
  }
})

// 設置瀏覽器的 beforeunload 事件監聽器
const handleBeforeUnload = (e) => {
  if (editing.value) {
    // 標準化的提示信息
    const message = '有未保存的更改，確定要離開嗎？'
    e.returnValue = message
    return message
  }
}

// 在組件掛載時添加監聽器
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 在組件卸載時移除監聽器
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 切換子任務完成狀態
const toggleSubTask = (taskId, subTaskId) => {
  const taskIndex = notes.value.findIndex(note => note.createdAt === taskId)
  if (taskIndex === -1) return

  const task = notes.value[taskIndex]
  if (!task.subTasks) return

  const subTaskIndex = task.subTasks.findIndex(st => st.id === subTaskId)
  if (subTaskIndex === -1) return

  // 更新子任務狀態
  task.subTasks[subTaskIndex].completed = !task.subTasks[subTaskIndex].completed

  // 檢查所有子任務是否完成，如果是，將父任務也標記為完成
  const allCompleted = task.subTasks.every(st => st.completed)
  if (allCompleted && !task.completed) {
    completeTask(task)
  } else if (!allCompleted && task.completed) {
    // 如果有子任務未完成，但父任務已完成，則取消父任務的完成狀態
    uncompleteTask(task)
  }
}

// 處理重用 AI 分析結果
const handleReuseResult = (item) => {
  try {
    const parsedTasks = JSON.parse(item.outputResult)
    // 處理並添加這些任務到列表
    const now = Date.now()

    for (let i = 0; i < parsedTasks.length; i++) {
      const task = parsedTasks[i]

      // 處理子任務 ID
      if (task.subTasks && task.subTasks.length > 0) {
        task.subTasks = task.subTasks.map(subTask => ({
          id: subTask.id || `${now}-${i}-${Math.random().toString(36).substring(2, 9)}`,
          title: subTask.title,
          completed: false
        }))
      }

      // 添加到待辦事項
      notes.value.unshift({
        title: task.title,
        description: task.description || '',
        content: task.description || '',
        createdAt: now - i,
        updatedAt: formatDateTime(now),
        completed: false,
        subTasks: task.subTasks || [],
        order: i
      })
    }
  } catch (error) {
    console.error('處理歷史記錄失敗:', error)
    $q.notify({
      color: 'negative',
      message: '無法使用此記錄',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.completed-task {
  opacity: 0.7;
  background-color: #f5f5f5;
}

.text-strike {
  text-decoration: line-through;
}
</style>
