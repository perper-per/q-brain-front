const routes = [
  {
    // Landing
    path: '/',
    name: 'preface',
    component: () => import('pages/PrefacePage.vue'),
    meta: {
      title: 'preface.title',
      hideHeader: true,
      layout: 'blank', // 明確指定不使用 layout
      // 添加轉換相關設置
      viewTransition: {
        name: 'fade',
        duration: '0.3s',
      },
    },
  },
  {
    // 主要應用區域使用 /site 前綴
    path: '/site',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', // /site
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          viewTransition: {
            name: 'slide',
            duration: '0.5s',
          },
        },
      },
      {
        path: 'notes',
        name: 'notes',
        component: () => import('pages/NoteBoard.vue'),
      },
      {
        path: 'breathe',
        name: 'breathe',
        component: () => import('pages/BreathePage.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { title: 'nav.login' },
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('pages/admin/adminIndex.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/DashBoard.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'todo',
        name: 'todo',
        component: () => import('src/pages/TodoPage.vue'),
        props: true,
      },
      {
        path: 'todo/:id',
        name: 'todoDetail',
        component: () => import('src/pages/TodoPage.vue'),
        props: true,
      },
      {
        path: 'todo-new',
        name: 'todoNew',
        component: () => import('src/pages/TodoNewPage.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    children: [
      // 後台首頁
      {
        path: '',
        name: 'adminIndex',
        component: () => import('pages/admin/adminIndex.vue'),
        meta: { title: 'admin.index' },
      },
      // 會員管理
      {
        path: 'members',
        name: 'adminMembers',
        component: () => import('pages/admin/MembersPage.vue'),
        meta: { title: 'admin.members.title' },
      },
      // 留言管理
      {
        path: 'comments',
        name: 'adminComments',
        component: () => import('pages/admin/CommentsPage.vue'),
        meta: { title: 'admin.comments.title' },
      },
      // 公告管理
      {
        path: 'bulletin',
        name: 'adminBulletin',
        component: () => import('pages/admin/BulletinPage.vue'),
        meta: { title: 'admin.bulletin.title' },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'notFound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
