
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
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
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
