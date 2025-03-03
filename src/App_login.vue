<template>
  <div id="app">
    <div v-if="!isAuthenticated">
      <LoginForm @login="handleLogin" />
    </div>
    <div v-else>
      <NoteBoard :notes="notes" @save="saveNotes" @logout="handleLogout" />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LoginForm from './components/LoginForm.vue';
import NoteBoard from './components/NoteBoard.vue';

const isAuthenticated = ref(false);
const notes = ref([]);

// 檢查使用者是否已經登入
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
    fetchNotes();
  }
});

// 登入處理
const handleLogin = async (username, password) => {
  try {
    const response = await axios.post('/api/users/login', { username, password });
    localStorage.setItem('token', response.data.token);
    isAuthenticated.value = true;
    fetchNotes();
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// 取得便利貼資料
const fetchNotes = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    notes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
  }
};

// 儲存便利貼
const saveNotes = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('/api/notes', notes.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert('Notes saved successfully!');
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

// 登出處理
const handleLogout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  notes.value = [];
};
</script>

<style>
#app {
  text-align: center;
  margin: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
