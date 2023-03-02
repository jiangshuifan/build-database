import axios from "axios"
import { AxiosRequestConfig } from "axios"

const request = function (config: AxiosRequestConfig) {
  const instance = axios.create({
    timeout: 60000,
    baseURL: '/api',
    ...config
  })
  instance.interceptors.request.use(
    (request: any) => {
      return request
    },
    () => {
      console.error('请求拦截报错')
    }
  )
  instance.interceptors.response.use(
    (response) => {
      return response.data
    }
  )
  return instance(config);
}

export default {
  post: async function (url: string, data?: any) {
    return await request({
      method: 'post',
      url,
      data: data
    })
  },
  get: async function (url: string, params?: any) {
    return await request({
      method: 'get',
      url: url,
      params: params
    })
  },
}