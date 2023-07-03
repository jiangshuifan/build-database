export const  getToken = ()=>{
    return localStorage.getItem('app_token') as string
}

interface iUser{
    account: string
}
export const  getUser = ()=>{
  return JSON.parse(localStorage.getItem('user') as string) as iUser
}

export const clearLoginState=()=>{
  localStorage.removeItem('app_token')
  localStorage.removeItem('user')
}