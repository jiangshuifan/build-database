
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationFailure, } from 'vue-router'
import { useBaseStore } from '@/store/index'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'base',
    path: '/',
    component: () => import('../views/home/index.vue')
  },
  {
    name: 'tables',
    path: '/:database',
    component: () => import('../views/tables/index.vue')
  },
  {
    name: 'tablesRelation',
    path: '/:database/relation',
    component: () => import('../views/table-relation/index.vue')
  },
  {
    name: 'tableData',
    path: '/:database/:table/data',
    component: () => import('../views/table-data/index.vue')
  },
  {
    name: 'tableDesign',
    path: '/:database/:table/design',
    component: () => import('../views/table-design/index.vue')
  },
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
