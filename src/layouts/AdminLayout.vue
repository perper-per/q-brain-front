<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ t('nav.adminPanel') }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      bordered
      show-if-above
      side="left"
      :width="250"
      class="admin-drawer"
    >
      <q-list>
        <q-item>
          <q-item-section avatar>
            <Avatar :size="30" variant="beam" :name="user.username" :colors="colors" />
          </q-item-section>
          <q-item-section>
            {{ user.username }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <q-list>
        <q-item
          v-for="nav in navs"
          :key="nav.to"
          :to="nav.to"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>
          <q-item-section>
            {{ nav.text }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'
import Avatar from "vue-boring-avatars"

const { t } = useI18n()
const user = useUserStore()

// 添加 Avatar 的顏色
const colors = ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']

const navs = computed(() => {
  return [
    {
      to: '/admin/members',
      text: t('nav.adminMembers'),
      icon: 'person' // 使用 Material Icons
    },
    {
      to: '/admin/comments',
      text: t('nav.adminComments'),
      icon: 'comment'
    },
    {
      to: '/admin/bulletin',
      text: t('nav.adminBulletin'),
      icon: 'announcement'
    },
    {
      to: '/site',
      text: t('nav.home'),
      icon: 'home'
    },
  ]
})
</script>

<style lang="scss" scoped>
.q-drawer {
  background-color: var(--color-background);
  padding-top: 50px; // 為 header 預留空間

  .q-item {
    color: var(--color-text);

    &.q-router-link--active {
      background: var(--color-primary);
      color: white;
    }
  }
}

// 確保內容區域不被遮住
.q-page-container {
  padding-left: 250px; // 與 drawer 寬度相同
  padding-top: 50px; // 為 header 預留空間
}

// 響應式調整
@media (max-width: 1023px) {
  .q-page-container {
    padding-left: 0;
  }
}

/* 只對管理面板標題使用 Nova Round 字體 */
.q-toolbar__title {
  font-family: 'Nova Round', cursive !important;
}
</style>

