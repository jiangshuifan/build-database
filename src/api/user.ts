import request from "../utils/request";

export const HandleSendVerificationCode = async (params: any) => {
  return request.post('/user/getcode', params)
}

export const HandleRegister = async (params: any) => {
  return request.post('/user/register', params)
}

export const HandleLogin = async (params: { email: string, password: string }) => {
  return request.post<{ token: string }>('/user/login', params)
}
