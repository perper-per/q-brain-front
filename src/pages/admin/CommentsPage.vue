<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">{{ $t('admin.comments.title') }}</div>

    <q-table
      :rows="comments"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      :filter="filter"
      virtual-scroll
      :virtual-scroll-slice-size="15"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
    >
      <!-- 搜尋欄 -->
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="搜尋"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- 狀態列自定義 -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="getStatusColor(props.row.status)"
            text-color="white"
            size="sm"
          >
            {{ $t(`admin.comments.statuses.${props.row.status}`) }}
          </q-chip>
        </q-td>
      </template>

      <!-- 操作列 -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn
              flat
              round
              color="positive"
              icon="check"
              @click="approveComment(props.row)"
              v-if="props.row.status === 'pending'"
            >
              <q-tooltip>{{ $t('admin.comments.approve') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="close"
              @click="rejectComment(props.row)"
              v-if="props.row.status === 'pending'"
            >
              <q-tooltip>{{ $t('admin.comments.reject') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>{{ $t('admin.comments.delete') }}</q-tooltip>
            </q-btn>
          </q-btn-group>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { date } from 'quasar'
import { useAxios } from '../../composables/axios'

const { t } = useI18n()
const $q = useQuasar()
const { apiAuth } = useAxios()

const loading = ref(false)
const comments = ref([])
const filter = ref('')

// 分頁設置
const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0
})

const columns = [
  {
    name: 'author',
    label: t('admin.comments.author'),
    field: row => row.author.username,
    align: 'left',
  },
  {
    name: 'content',
    label: t('admin.comments.content'),
    field: 'content',
    align: 'left',
  },
  {
    name: 'date',
    label: t('admin.comments.date'),
    field: 'createdAt',
    format: val => date.formatDate(val, 'YYYY/MM/DD HH:mm'),
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    label: t('admin.comments.status'),
    field: 'status',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('admin.comments.actions'),
    field: 'actions',
    align: 'center',
  },
]

// 狀態顏色映射
const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    approved: 'positive',
    rejected: 'negative'
  }
  return colors[status] || 'grey'
}

// 載入留言資料
const onRequest = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const params = {
      page,
      limit: rowsPerPage,
      sortBy,
      order: descending ? 'desc' : 'asc',
      search: filter.value
    }

    const { data } = await apiAuth.get('/api/comments', { params })

    if (data && data.items) {
      comments.value = data.items
      pagination.value.rowsNumber = data.total || 0
    } else {
      comments.value = []
      pagination.value.rowsNumber = 0
    }

    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
  } catch (error) {
    console.error('Error loading comments:', error)
    comments.value = []

    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '載入失敗',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

// 審核通過
const approveComment = async (comment) => {
  try {
    await apiAuth.patch(`/api/comments/${comment.id}/approve`)
    await onRequest({ pagination: pagination.value })
    $q.notify({
      type: 'positive',
      message: t('admin.comments.approveSuccess'),
      position: 'top'
    })
  } catch (error) {
    console.error('Error approving comment:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '審核失敗',
      position: 'top'
    })
  }
}

// 審核拒絕
const rejectComment = async (comment) => {
  try {
    await apiAuth.patch(`/api/comments/${comment.id}/reject`)
    await onRequest({ pagination: pagination.value })
    $q.notify({
      type: 'positive',
      message: t('admin.comments.rejectSuccess'),
      position: 'top'
    })
  } catch (error) {
    console.error('Error rejecting comment:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '拒絕失敗',
      position: 'top'
    })
  }
}

// 刪除留言
const confirmDelete = (comment) => {
  $q.dialog({
    title: t('admin.comments.delete'),
    message: t('admin.comments.confirmDelete'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await apiAuth.delete(`/api/comments/${comment.id}`)
      await onRequest({ pagination: pagination.value })
      $q.notify({
        type: 'positive',
        message: t('admin.comments.deleteSuccess'),
        position: 'top'
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || '刪除失敗',
        position: 'top'
      })
    }
  })
}

// 監聽搜尋條件變化
watch(filter, () => {
  pagination.value.page = 1
  onRequest({
    pagination: pagination.value
  })
})

// 初始載入
onMounted(() => {
  onRequest({
    pagination: pagination.value
  })
})
</script>
