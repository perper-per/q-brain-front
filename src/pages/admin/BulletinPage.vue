<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">{{ $t('admin.bulletin.title') }}</div>
      <q-btn
        color="primary"
        :label="$t('admin.bulletin.newBulletin')"
        @click="openEditor()"
        icon="add"
      />
    </div>

    <!-- 公告列表 -->
    <q-table
      :rows="bulletins"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      :filter="filter"

      binary-state-sort
    >
      <!-- 添加搜尋欄 -->
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
            {{ $t(`admin.bulletin.statuses.${props.row.status}`) }}
          </q-chip>
        </q-td>
      </template>

      <!-- 類型列自定義 -->
      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <q-icon
            :name="getTypeIcon(props.row.type)"
            :color="getTypeColor(props.row.type)"
            size="sm"
          />
          {{ $t(`admin.bulletin.types.${props.row.type}`) }}
        </q-td>
      </template>

      <!-- 操作列 -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="openEditor(props.row)"
            >
              <q-tooltip>{{ $t('admin.bulletin.editBulletin') }}</q-tooltip>
            </q-btn>

            <!-- 添加發布/草稿切換按鈕 -->
            <q-btn
              v-if="props.row.status === 'draft'"
              flat
              round
              color="positive"
              icon="publish"
              @click="changeStatus(props.row, 'published')"
            >
              <q-tooltip>{{ $t('admin.bulletin.publish') }}</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'published'"
              flat
              round
              color="grey"
              icon="unpublished"
              @click="changeStatus(props.row, 'draft')"
            >
              <q-tooltip>{{ $t('admin.bulletin.unpublish') }}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>{{ $t('admin.bulletin.delete') }}</q-tooltip>
            </q-btn>
          </q-btn-group>
        </q-td>
      </template>
    </q-table>

    <!-- 編輯器對話框 -->
    <q-dialog v-model="showEditor" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">
            {{ editingBulletin.id ? $t('admin.bulletin.editBulletin') : $t('admin.bulletin.newBulletin') }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveBulletin">
            <!-- 公告類型 -->
            <q-select
              v-model="editingBulletin.type"
              :options="typeOptions"
              :label="$t('admin.bulletin.type')"
              emit-value
              map-options
              class="q-mb-md"
            />

            <!-- 公告狀態 -->
            <q-select
              v-model="editingBulletin.status"
              :options="statusOptions"
              :label="$t('admin.bulletin.status')"
              emit-value
              map-options
              class="q-mb-md"
            />

            <!-- 公告內容 -->
            <q-input
              v-model="editingBulletin.content"
              type="textarea"
              :label="$t('admin.bulletin.content')"
              rows="4"
              class="q-mb-md"
            />

            <!-- 日期選擇器 -->
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model="editingBulletin.publishDate"
                  :label="$t('admin.bulletin.publishDate')"
                  type="date"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="editingBulletin.expiryDate"
                  :label="$t('admin.bulletin.expiryDate')"
                  type="date"
                />
              </div>
            </div>

            <!-- 按鈕 -->
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                :label="$t('admin.bulletin.cancel')"
                @click="showEditor = false"
                class="q-mr-sm"
              />
              <q-btn
                :label="$t('admin.bulletin.save')"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
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
const bulletins = ref([])
const showEditor = ref(false)
const editingBulletin = ref({
  type: 'info',
  content: '',
  publishDate: '',
  expiryDate: '',
  status: 'draft'
})

// 表格列定義
const columns = [
  {
    name: 'type',
    label: t('admin.bulletin.type'),
    field: 'type',
    align: 'left',
  },
  {
    name: 'content',
    label: t('admin.bulletin.content'),
    field: 'content',
    align: 'left',
  },
  {
    name: 'publishDate',
    label: t('admin.bulletin.publishDate'),
    field: 'publishDate',
    format: val => date.formatDate(val, 'YYYY/MM/DD'),
    align: 'left',
  },
  {
    name: 'status',
    label: t('admin.bulletin.status'),
    field: 'status',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('admin.bulletin.actions'),
    field: 'actions',
    align: 'center',
  },
]

// 類型選項
const typeOptions = [
  {
    label: t('admin.bulletin.types.info'),
    value: 'info'
  },
  {
    label: t('admin.bulletin.types.warning'),
    value: 'warning'
  },
  {
    label: t('admin.bulletin.types.event'),
    value: 'event'
  }
]

// 狀態選項
const statusOptions = [
  {
    label: t('admin.bulletin.statuses.draft'),
    value: 'draft'
  },
  {
    label: t('admin.bulletin.statuses.published'),
    value: 'published'
  }
]

// 狀態顏色映射
const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    published: 'positive',
    expired: 'negative'
  }
  return colors[status] || 'grey'
}

// 類型圖標映射
const getTypeIcon = (type) => {
  const icons = {
    info: 'info',
    warning: 'warning',
    event: 'event'
  }
  return icons[type] || 'info'
}

// 類型顏色映射
const getTypeColor = (type) => {
  const colors = {
    info: 'info',
    warning: 'warning',
    event: 'primary'
  }
  return colors[type] || 'grey'
}

// 分頁狀態
const pagination = ref({
  sortBy: 'publishDate',
  descending: true,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0
})

// 搜尋狀態
const filter = ref('')

// 處理分頁請求
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

    const { data } = await apiAuth.get('/api/bulletins', { params })

    if (data?.items) {
      bulletins.value = data.items.map(item => ({
        ...item,
        id: item._id
      }))
      pagination.value.rowsNumber = data.total || 0
    } else {
      bulletins.value = []
      pagination.value.rowsNumber = 0
    }

    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage

    console.log('Response data:', data)
  } catch (error) {
    console.error('Error loading bulletins:', error)
    bulletins.value = []

    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '載入失敗',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

// 監聽搜尋條件變化
watch(filter, () => {
  pagination.value.page = 1
  onRequest({
    pagination: pagination.value
  })
})

// 初始載入改為使用 onRequest
onMounted(() => {
  onRequest({
    pagination: pagination.value
  })
})

// 打開編輯器
const openEditor = (bulletin = null) => {
  if (bulletin) {
    // 確保日期格式正確
    const formattedPublishDate = bulletin.publishDate ?
      date.formatDate(bulletin.publishDate, 'YYYY-MM-DD') :
      '';

    const formattedExpiryDate = bulletin.expiryDate ?
      date.formatDate(bulletin.expiryDate, 'YYYY-MM-DD') :
      '';

    editingBulletin.value = {
      ...bulletin,
      _id: bulletin._id || bulletin.id,
      publishDate: formattedPublishDate,
      expiryDate: formattedExpiryDate
    }
  } else {
    editingBulletin.value = {
      type: 'info',
      content: '',
      publishDate: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      expiryDate: '',
      status: 'draft'
    }
  }
  showEditor.value = true
  console.log('原始公告：', bulletin)
}

// 儲存公告
const saveBulletin = async () => {
  try {
    // 創建要發送的數據物件
    const bulletinData = { ...editingBulletin.value };

    // 確保日期格式正確
    if (bulletinData.publishDate) {
      // 確保日期格式在儲存時是正確的
      // 視您的後端需求，可能需要轉換成 ISO 格式或其他格式
      bulletinData.publishDate = date.formatDate(bulletinData.publishDate, 'YYYY-MM-DD');
    }

    if (bulletinData.expiryDate) {
      bulletinData.expiryDate = date.formatDate(bulletinData.expiryDate, 'YYYY-MM-DD');
    }

    if (editingBulletin.value.id || editingBulletin.value._id) {
      const bulletinId = editingBulletin.value._id || editingBulletin.value.id
      await apiAuth.patch(`/api/bulletins/${bulletinId}`, bulletinData)
    } else {
      await apiAuth.post('/api/bulletins', bulletinData)
    }
    showEditor.value = false
    await onRequest({
      pagination: pagination.value
    })
  } catch (error) {
    console.error('Error saving bulletin:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '儲存失敗',
      position: 'top'
    })
  }
}

// 確認刪除
const confirmDelete = (bulletin) => {
  $q.dialog({
    title: t('admin.bulletin.delete'),
    message: t('admin.bulletin.confirmDelete'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const bulletinId = bulletin._id || bulletin.id
      await apiAuth.delete(`/api/bulletins/${bulletinId}`)
      await onRequest({
        pagination: pagination.value
      })
    } catch (error) {
      console.error('Error deleting bulletin:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || '刪除失敗',
        position: 'top'
      })
    }
  })
}

// 更改公告狀態
const changeStatus = async (bulletin, newStatus) => {
  try {
    const bulletinId = bulletin._id || bulletin.id
    await apiAuth.patch(`/api/bulletins/${bulletinId}`, {
      status: newStatus
    })

    $q.notify({
      type: 'positive',
      message: newStatus === 'published'
        ? t('admin.bulletin.publishSuccess')
        : t('admin.bulletin.unpublishSuccess'),
      position: 'top'
    })

    // 重新載入公告列表
    await onRequest({
      pagination: pagination.value
    })
  } catch (error) {
    console.error('Error changing bulletin status:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '狀態更新失敗',
      position: 'top'
    })
  }
}
</script>
