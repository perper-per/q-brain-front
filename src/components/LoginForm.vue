<template>
  <div class="login-form">
    <h5>Login</h5>
    <input v-model="username" type="text" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="submitLogin">Login</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');

const emit = defineEmits(['login']);

const submitLogin = () => {
  if (username.value && password.value) {
    emit('login', username.value, password.value);
  } else {
    alert('Please enter both username and password');
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}

button {
  width: 100%;
  padding: 10px;
}
</style>
