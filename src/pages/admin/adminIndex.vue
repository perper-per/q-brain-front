<template>
  <q-page padding class="admin-page">
    <q-card flat class="q-pa-md admin-content">
      <div class="text-h5 q-mb-md text-center">{{ $t('admin.index') }}</div>

      <div class="row q-col-gutter-md">
        <!-- 會員管理卡片 -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="admin-card" @click="$router.push('/admin/members')">
            <q-card-section class="text-center">
              <q-icon name="person" size="3rem" color="primary" />
              <div class="text-h6 q-mt-sm">{{ $t('nav.adminMembers') }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 留言管理卡片 -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="admin-card" @click="$router.push('/admin/comments')">
            <q-card-section class="text-center">
              <q-icon name="comment" size="3rem" color="secondary" />
              <div class="text-h6 q-mt-sm">{{ $t('nav.adminComments') }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 公告管理卡片 -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="admin-card" @click="$router.push('/admin/bulletin')">
            <q-card-section class="text-center">
              <q-icon name="announcement" size="3rem" color="accent" />
              <div class="text-h6 q-mt-sm">{{ $t('nav.adminBulletin') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
// 因為只在模板中使用路由導航，所以直接用 $router 更簡單，不需要額外導入 useRouter
</script>

<style lang="scss" scoped>
.admin-page {
  /* 確保頁面有足夠的頂部邊距，防止被導航欄覆蓋 */
  padding-top: 70px !important; /* 根據您的導航欄高度調整此值 */
  min-height: calc(100vh - 50px); /* 調整高度避免內容被擠壓 */
}

.admin-content {
  /* 添加z-index確保內容在適當層級 */
  position: relative;
  z-index: 1;
}

.admin-card {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}
</style>

