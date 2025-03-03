<template>
  <q-page class="login-page">
    <SlideForm />
  </q-page>
</template>

<script setup>
import SlideForm from 'components/SlideForm.vue'
</script>

<style lang="scss">
.login-page {
  min-height: 100vh;
  width: 100%;
  background: var(--login-bg);
  color: var(--login-text);


  :deep(.container) {
    min-height: 100vh;
  }

  :deep(.q-card) {
    background: var(--login-card-bg);
    backdrop-filter: blur(10px);
  }

  :deep(.q-input) {
    background: var(--login-input-bg);
    border-radius: 8px;
  }

  :deep(.q-field__native),
  :deep(.q-field__label),
  :deep(.q-field__marginal) {
    color: var(--login-text);
  }

  // 深色模式下的特定樣式
  .dark & {
    :deep(.q-card) {
      background: rgba(17, 17, 17, 0.7);
    }

    :deep(.q-input) {
      background: rgba(17, 17, 17, 0.9);
    }
  }
}
</style>
