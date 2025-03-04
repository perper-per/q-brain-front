<template>
  <q-page class="login-page column no-wrap" style="padding: 0;">
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
  padding: 0 !important;
  margin: 0 !important;

  // 確保頁面從頂部開始，沒有任何空間
  display: flex;
  flex-direction: column;

  // 移除 Quasar 默認邊距
  &.q-page {
    padding-top: 0;
  }

  :deep(.container) {
    min-height: 100vh;
    margin-top: 0;
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
