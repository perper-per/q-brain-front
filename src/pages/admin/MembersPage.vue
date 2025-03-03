<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">{{ $t('admin.members.title') }}</div>

    <q-table
      :rows="members"
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

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn
              flat
              round
              :color="props.row.isBanned ? 'positive' : 'negative'"
              :icon="props.row.isBanned ? 'how_to_reg' : 'block'"
              @click="toggleBanStatus(props.row)"
            >
              <q-tooltip>
                {{ props.row.isBanned ? $t('admin.members.unban') : $t('admin.members.ban') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>{{ $t('admin.members.delete') }}</q-tooltip>
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
const members = ref([])
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
    name: 'username',
    label: t('admin.members.username'),
    field: 'username',
    align: 'left',
  },
  {
    name: 'email',
    label: t('admin.members.email'),
    field: 'email',
    align: 'left',
  },
  {
    name: 'status',
    label: t('admin.members.status'),
    field: row => row.isBanned ? '已封鎖' : '正常',
    align: 'left',
  },
  {
    name: 'joinDate',
    label: t('admin.members.joinDate'),
    field: 'createdAt',
    format: val => date.formatDate(val, 'YYYY/MM/DD'),
    align: 'left',
  },
  {
    name: 'actions',
    label: t('admin.members.actions'),
    field: 'actions',
    align: 'center',
  },
]

// 載入會員資料
const onRequest = async (props) => {
  console.log('載入會員資料:', props)
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
    console.log('API 請求參數:', params)

    const { data } = await apiAuth.get('/api/users', { params })
    console.log('API 回應資料:', data)

    members.value = data.items
    pagination.value.rowsNumber = data.total
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
  } catch (error) {
    console.error('載入會員失敗:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '載入失敗',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

// 封鎖/解除封鎖
const toggleBanStatus = async (member) => {
  console.log('切換封鎖狀態:', member)
  try {
    await apiAuth.patch(`/api/users/${member.id}/ban`, {
      isBanned: !member.isBanned
    })
    console.log('封鎖狀態更新成功')
    await onRequest({ pagination: pagination.value })
    $q.notify({
      type: 'positive',
      message: t(member.isBanned ? 'admin.members.unbanSuccess' : 'admin.members.banSuccess'),
      position: 'top'
    })
  } catch (error) {
    console.error('封鎖狀態更新失敗:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '操作失敗',
      position: 'top'
    })
  }
}

// 刪除會員
const confirmDelete = (member) => {
  console.log('準備刪除會員:', member)
  $q.dialog({
    title: t('admin.members.delete'),
    message: t('admin.members.confirmDelete'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await apiAuth.delete(`/api/users/${member.id}`)
      console.log('會員刪除成功')
      await onRequest({ pagination: pagination.value })
      $q.notify({
        type: 'positive',
        message: t('admin.members.deleteSuccess'),
        position: 'top'
      })
    } catch (error) {
      console.error('會員刪除失敗:', error)
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
  console.log('搜尋條件變更:', filter.value)
  pagination.value.page = 1
  onRequest({
    pagination: pagination.value
  })
})

// 初始載入
onMounted(() => {
  console.log('組件掛載，開始載入資料')
  onRequest({
    pagination: pagination.value
  })
})
</script>
