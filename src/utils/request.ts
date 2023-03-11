// request.ts
import axios, { AxiosInstance, AxiosResponse, ResponseType } from 'axios'

import { ElNotification } from "element-plus"

export interface IResponse<T> {
  success: boolean,
  data: T,
}
interface IOpts {
  url: string,
  method: string,
  headers?: object,
  params?: object | string,
  data?: object | string,
  responseType?: ResponseType
}

export class Request {

  private request<T>(opts: IOpts) {
    const instance: AxiosInstance = axios.create({
      baseURL: '/api/',
      timeout: 6000
    })
    this.setInterceptors(instance)
    return instance<any, IResponse<T>>(opts)
  }

  private setInterceptors(ins: AxiosInstance) {
    ins.interceptors.request.use(config => {
      return config
    })

    ins.interceptors.response.use((res: AxiosResponse) => {
      if (res.status === 200) {
        return res.data
      } else {
        console.log('接口状态码：res.status' + res.status)
      }
    }, (res) => {
      let errMsg = res.response.data.data?.message
      if (errMsg) {
        ElNotification({
          type: 'error',
          message: errMsg
        })
      }
      return { success: false }
    })
  }

  async get<T>(url: string, options?: object | string, responseType?: ResponseType) {
    return this.request<T>({
      url,
      method: 'get',
      params: options,
      responseType: responseType,
    })
  }

  async post<T>(url: string, options?: object | string, responseType?: ResponseType) {
    return this.request<T>({
      url,
      method: 'post',
      // headers: {
      //   'Content-Type':'application/x-www-form-urlencoded'
      // },
      responseType: responseType,
      data: options
    })
  }
}

const request = new Request()

export default request