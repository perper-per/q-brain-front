<template>
  <q-card class="bulletin-board">
    <q-card-section>
      <div class="text-h6">最新公告</div>
    </q-card-section>

    <q-card-section>
      <q-list>
        <q-item
          v-for="bulletin in activeBulletins"
          :key="bulletin.id"
          class="bulletin-item"
        >
          <q-item-section avatar>
            <q-icon
              :name="getTypeIcon(bulletin.type)"
              :color="getTypeColor(bulletin.type)"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ bulletin.content }}</q-item-label>
            <q-item-label caption>
              {{ formatDate(bulletin.publishDate) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="activeBulletins.length === 0">
          <q-item-section>
            <q-item-label class="text-grey text-center">
              暫無公告
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useAxios } from '../composables/axios'

const { api } = useAxios()
const activeBulletins = ref([])

const getTypeIcon = (type) => {
  const icons = {
    info: 'info',
    warning: 'warning',
    event: 'event'
  }
  return icons[type] || 'info'
}

const getTypeColor = (type) => {
  const colors = {
    info: 'info',
    warning: 'warning',
    event: 'primary'
  }
  return colors[type] || 'grey'
}

const formatDate = (dateString) => {
  return date.formatDate(dateString, 'YYYY/MM/DD')
}

const loadBulletins = async () => {
  try {
    const { data } = await api.get('/api/bulletins/active')
    activeBulletins.value = data
  } catch (error) {
    console.error('Error loading bulletins:', error)
  }
}

onMounted(() => {
  loadBulletins()
})
</script>

<style lang="scss" scoped>
.bulletin-board {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);

  .bulletin-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    &:last-child {
      border-bottom: none;
    }
  }
}

// 深色模式支援
.dark {
  .bulletin-board {
    background: rgba(30, 30, 30, 0.8);
  }
}
</style>
