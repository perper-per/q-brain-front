<template>
  <q-card v-if="showDebug" flat bordered class="q-ma-md bg-grey-2">
    <q-card-section>
      <div class="text-h6">調試資訊</div>
      <div class="q-mt-sm">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label caption>用戶名</q-item-label>
              <q-item-label>{{ user.username }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>用戶角色</q-item-label>
              <q-item-label>{{ user.role }} ({{ typeof user.role }})</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Admin枚舉值</q-item-label>
              <q-item-label>{{ UserRole.ADMIN }} ({{ typeof UserRole.ADMIN }})</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>isAdmin</q-item-label>
              <q-item-label>{{ user.role === UserRole.ADMIN }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>便條數量</q-item-label>
              <q-item-label>{{ noteStore.notes ? noteStore.notes.length : 'undefined' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>

    <q-card-actions align="around">
      <q-btn flat color="primary" @click="showDebug = false">隱藏</q-btn>
      <q-btn flat color="secondary" @click="reloadData">重新載入數據</q-btn>
      <q-btn flat color="deep-purple" @click="setAdminRole">強制設為管理員</q-btn>
    </q-card-actions>
  </q-card>
  <q-btn v-else fab-mini color="grey" icon="bug_report" class="fixed-bottom-right q-ma-md" @click="showDebug = true" />
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useNoteStore } from '../stores/noteStore'
import UserRole from '../enums/UserRole'

const user = useUserStore()
const noteStore = useNoteStore()
const showDebug = ref(true)

const reloadData = async () => {
  try {
    // 重新加載用戶資訊
    if (user.token) {
      // 可以添加重新獲取用戶信息的方法
      console.log('重新載入用戶資訊')
    }

    // 重新加載便條
    if (user.isLoggedIn) {
      await noteStore.loadNotes()
      console.log('已重新載入便條:', noteStore.notes.length)
    }
  } catch (error) {
    console.error('重新載入數據失敗', error)
  }
}

// 添加強制設置管理員角色的功能
const setAdminRole = () => {
  // 直接修改 userStore 中的角色
  user.role = UserRole.ADMIN
  // 確保保存到 localStorage
  localStorage.setItem('role', UserRole.ADMIN.toString())

  // 如果有 user 對象，也更新它
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      userData.role = UserRole.ADMIN
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('更新 localStorage 中的用戶角色失敗', error)
    }
  }

  console.log('已強制設置為管理員角色:', user.role)
}
</script>
