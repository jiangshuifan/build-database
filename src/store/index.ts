import { defineStore } from "pinia"
import { DatabaseTable, Database } from '../database'


export const useMainStore = defineStore('main', {
  state: () => {
    return {
      //必须是函数，为了在服务端渲染时避免交叉请求导致数据状态污染
      //必须时箭头函数，为了更好的ts类型推导
    }
  },
  getters: {},
  actions: {}
})



export const useDBStore = defineStore('db', {
  state: () => {
    return { ...new DBStoreClass() }
  },
  getters: {},
  actions: {}
})
const tables = [new DatabaseTable('User',
  [
    { field: 'username', name: '用户名', type: 'string' },
    { field: 'tel', isMarjorKey: true, name: '电话', type: 'string' },
    { field: 'email', name: '邮箱', type: 'string' },
    { field: 'github', name: 'github', type: 'string' },
    { field: 'headicon', name: '头像', type: 'string' },
    { field: 'position', name: '职位', type: 'string' },
    { field: 'education', name: '教育经历', type: 'string' },
    { field: 'projects', name: '项目', type: 'string' },
    { field: 'work_experience', name: '工作经历', type: 'string' },

  ], (() => {
    let arr = []
    for (let i = 0; i < 100; i++) {
      arr.push({ username: '于未然', tel: '173780911286', email: 'gaojiale_mail@qq.com', github: "https://github.com/jiangshuifan", headicon: "暂无", position: '前端开发', education: '南华大学·物流工程', projects: '很多', work_experience: '北科博研前端开发' })
    }
    return arr
  })()),
new DatabaseTable('experience',
  [
    { field: 'username', name: '用户名', type: 'string' },
    { field: 'tel', name: '电话', type: 'string' },
    { field: 'email', name: '邮箱', type: 'string' },
    { field: 'github', name: 'github', type: 'string' },
    { field: 'headicon', name: '头像', type: 'string' },
    { field: 'position', name: '职位', type: 'string' },
    { field: 'education', name: '教育经历', type: 'string' },
    { field: 'projects', name: '项目', type: 'string' },

  ], []),
new DatabaseTable('school',
  [
    { field: 'username', name: '用户名', type: 'string' },
    { field: 'tel', name: '电话', type: 'string' },
    { field: 'email', name: '邮箱', type: 'string' },
    { field: 'github', name: 'github', type: 'string' },
    { field: 'headicon', name: '头像', type: 'string' },
    { field: 'position', name: '职位', type: 'string' },
    { field: 'education', name: '教育经历', type: 'string' },
    { field: 'projects', name: '项目', type: 'string' },

  ], []),
new DatabaseTable('project',
  [
    { field: 'username', name: '用户名', type: 'string' },
    { field: 'tel', name: '电话', type: 'string' },
    { field: 'email', name: '邮箱', type: 'string' },
    { field: 'github', name: 'github', type: 'string' },
    { field: 'headicon', name: '头像', type: 'string' },
    { field: 'position', name: '职位', type: 'string' },
    { field: 'education', name: '教育经历', type: 'string' },
    { field: 'projects', name: '项目', type: 'string' },

  ], []),
new DatabaseTable('table1',
  [
    { field: 'username', name: '用户名', type: 'string' },
    { field: 'tel', name: '电话', type: 'string' },
    { field: 'email', name: '邮箱', type: 'string' },
    { field: 'github', name: 'github', type: 'string' },
    { field: 'headicon', name: '头像', type: 'string' },
    { field: 'position', name: '职位', type: 'string' },
    { field: 'education', name: '教育经历', type: 'string' },
    { field: 'projects', name: '项目', type: 'string' },

  ], []),
new DatabaseTable('table2',
  [
    { field: 'username', name: '用户名', type: 'string' },
    { field: 'tel', name: '电话', type: 'string' },
    { field: 'email', name: '邮箱', type: 'string' },
    { field: 'github', name: 'github', type: 'string' },
    { field: 'headicon', name: '头像', type: 'string' },
    { field: 'position', name: '职位', type: 'string' },
    { field: 'education', name: '教育经历', type: 'string' },
    { field: 'projects', name: '项目', type: 'string' },

  ], []),
new DatabaseTable('table3',
  [
    { field: 'username', name: '用户名', type: 'string' },
    { field: 'tel', name: '电话', type: 'string' },
    { field: 'email', name: '邮箱', type: 'string' },
    { field: 'github', name: 'github', type: 'string' },
    { field: 'headicon', name: '头像', type: 'string' },
    { field: 'position', name: '职位', type: 'string' },
    { field: 'education', name: '教育经历', type: 'string' },
    { field: 'projects', name: '项目', type: 'string' },

  ], []),]
class DBStoreClass {
  database: Database[] = [
    {
      name: 'db1',
      id: 1,
      type: 'SQLite',
      tables: tables
    },
    {
      name: 'db2',
      id: 2,
      type: 'MySQL',
      tables: tables
    },
    {
      name: 'db3',
      id: 3,
      type: 'MariaDB',
      tables: tables
    }
  ]
  tables: DatabaseTable[] = []
}