import { defineStore } from "pinia"
import { DatabaseTable, Database } from '../database'


export const useMainStore = defineStore('main', {
  state: () => {
    return {
      //必须是函数，为了在服务端渲染时避免交叉请求导致数据状态污染
      //必须是箭头函数，为了更好的ts类型推导
    }
  },
  getters: {},
  actions: {}
})



export const useBaseStore = defineStore('db', {
  state: () => {
    return {
      isRoot: false,//是否为根节点
    }
  },
  getters: {},
  actions: {}
})