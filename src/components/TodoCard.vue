<template>
  <q-card
  flat
  bordered
  class="q-mb-sm cursor-pointer"
  @click="emit('click', $event)">
    <q-card-section class="q-pt-xs">
      <div class="text-h5 q-mt-sm q-mb-xs">{{ title }}</div>
      <div class="text-grey text-caption">{{ description }}</div>

      <!-- 子任務區域 -->
      <div v-if="subTasks && subTasks.length > 0" class="q-mt-md">
        <q-list dense class="subtasks-list">
          <q-item v-for="task in subTasks" :key="task.id" dense>
            <q-item-section avatar>
              <q-checkbox
                v-model="task.completed"
                @click.stop
                @update:model-value="emit('subtask-toggle', task.id)"
              />
            </q-item-section>
            <q-item-section :class="{ 'text-strike': task.completed }">
              {{ task.title }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <p class="text-caption text-grey">更新時間：{{ updatedAt }}</p>

      <!-- 子任務計數 -->
      <div v-if="subTasks && subTasks.length > 0" class="text-caption">
        <q-chip size="sm" color="primary" text-color="white">
          {{ completedSubTasks }}/{{ subTasks.length }} 子任務
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps, toRefs, defineEmits, computed } from 'vue'

const emit = defineEmits(['click', 'subtask-toggle'])

const props = defineProps({
  title: String,
  description: String,
  updatedAt: String,
  subTasks: {
    type: Array,
    default: () => []
  }
})

const { title, description, updatedAt, subTasks } = toRefs(props)

// 計算已完成的子任務數量
const completedSubTasks = computed(() => {
  if (!props.subTasks) return 0
  return props.subTasks.filter(task => task.completed).length
})
</script>

<style scoped>
.subtasks-list {
  border-left: 2px solid #eee;
  padding-left: 8px;
  margin-left: 8px;
}

.text-strike {
  text-decoration: line-through;
  opacity: 0.7;
}
</style>

