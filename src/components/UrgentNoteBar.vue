<template>
  <div class="protected-area blur-backdrop">
    <div v-if="isLoading" class="text-subtitle2">載入中...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="urgentNotes.length > 0" class="urgent-notes-preview">
      <q-btn
        v-for="note in urgentNotes"
        :key="note._id"
        flat
        dense
        class="urgent-note-btn hover-lift"
        @click="$emit('scroll-to-note', note._id)"
      >
        <q-icon name="warning" color="red" size="xs" class="q-mr-xs" />
        {{ note.title || '無標題' }}
      </q-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  urgentNotes: {
    type: Array,
    required: true
  },
  isLoading: Boolean,
  errorMessage: String
})

defineEmits(['scroll-to-note'])
</script>

<style lang="scss" scoped>
.protected-area {
  min-height: 40px;
  position: sticky;
  top: 0;
  z-index: var(--z-protected-area);
}
</style>
