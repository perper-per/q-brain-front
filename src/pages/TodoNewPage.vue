<template>
  <q-page padding>
    <Container>
      <h3>新的待辦事項</h3>
      <form @submit="submit">
        <q-input class="q-mt-sm" outlined v-model="note.title" label="標題" />

        <q-input
          class="q-mt-sm"
          outlined
          v-model="note.description"
          label="描述"
          dense
        />

        <q-card flat bordered class="q-mt-sm">
          <q-editor v-model="note.content" min-height="5rem" />
        </q-card>

        <!-- 子任務區域 -->
        <div class="q-mt-md">
          <div class="text-subtitle1 q-mb-sm">子任務</div>

          <q-list bordered separator class="rounded-borders">
            <q-item v-for="(subTask, index) in subTasks" :key="index">
              <q-item-section>
                <q-input dense outlined v-model="subTask.title" label="子任務標題" />
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="negative" icon="delete" @click="removeSubTask(index)" />
              </q-item-section>
            </q-item>

            <q-item clickable @click="addSubTask" v-if="subTasks.length < 10">
              <q-item-section>
                <div class="text-center text-primary">
                  <q-icon name="add" /> 添加子任務
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="q-mt-md">
          <q-btn color="grey" to="/site/todo" type="reset">取消</q-btn>
          <q-btn class="q-ml-sm" color="positive" type="submit">創建</q-btn>
        </div>
      </form>
    </Container>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalNotes, formatDateTime } from 'src/helper'
import Container from 'src/components/ContainerComp.vue'

// 引入需要的功能
const router = useRouter()
const notes = useLocalNotes()

// 使用 reactive 定義表單資料
const note = reactive({
  title: '',
  description: '',
  content: ''
})

// 子任務列表
const subTasks = ref([])

// 添加子任務
const addSubTask = () => {
  subTasks.value.push({
    id: Date.now() + Math.random().toString(36).substring(2, 9),
    title: '',
    completed: false
  })
}

// 刪除子任務
const removeSubTask = (index) => {
  subTasks.value.splice(index, 1)
}

// 修改提交表單的函式
const submit = (e) => {
  if (e) e.preventDefault()

  // 驗證標題不為空
  if (!note.title.trim()) {
    alert('請輸入待辦標題')
    return
  }

  // 過濾空白的子任務
  const validSubTasks = subTasks.value
    .filter(task => task.title.trim() !== '')
    .map(task => ({
      id: task.id,
      title: task.title,
      completed: false
    }))

  // 把 note 的資料加到 notes 陣列的最前端 (unshift)
  notes.value.unshift({
    ...note,
    createdAt: Date.now(),
    updatedAt: formatDateTime(Date.now()),
    completed: false,
    subTasks: validSubTasks
  })

  router.push('/site/todo')  // 提交後返回待辦列表頁面

  // 清空表單內容
  note.title = ''
  note.description = ''
  note.content = ''
  subTasks.value = []
}
</script>
