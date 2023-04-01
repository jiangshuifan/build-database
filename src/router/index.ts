
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationFailure, } from 'vue-router'
import { useBaseStore } from '@/store/index'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'base',
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
  {
    name: 'content',
    path: '/content',
    component: () => import('@/views/content/index.vue'),
    redirect: '',
    children: [
      {
        name: 'list',
        path: '/list',
        redirect: "/list/main",
        component: () => import('@/views/database-middle/index.vue'),
        children: [
          {
            name: 'main',
            path: 'main',
            component: () => import('@/views/database-middle/home/index.vue')
          },
          {
            name: 'tables',
            path: 'database/:database',
            component: () => import('@/views/database-middle/tables/index.vue')
          },
          {
            name: 'tablesRelation',
            path: 'database/:database/relation',
            component: () => import('@/views/database-middle/table-relation/index.vue')
          },
          {
            name: 'tableDesign',
            path: 'database/:database/:table/design',
            component: () => import('@/views/database-middle/table-design/index.vue')
          },
        ]
      },
      {
        name: 'profile',
        path: '/profile',
        component: () => import('@/views/profile/index.vue')
      },
      {
        name: 'setting',
        path: '/setting',
        component: () => import('../views/page-setting/index.vue')
      },
    ]
  },

  {
    path: "/404",
    name: 'fzf',
    component: () => import("@/views/404/index.vue")
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to, from, failure) => {
  const store = useBaseStore()
  if (to.path === "/") {
    store.isRoot = true
  } else {
    store.isRoot = false
  }
})

export default router
