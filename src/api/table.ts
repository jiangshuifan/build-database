import request from "../utils/request"
import { DatabaseTable, tbParams } from "../database"
export const getTableList = async function (databaseId: string | number) {
  return await request.post<DatabaseTable[]>('/table/list', { dbId: databaseId })
}

export const createTable = async function (tb: tbParams) {
  return await request.post<tbParams>('/table/add', tb)
}


export const updateTable = async function (tb: tbParams) {
  return await request.post('/table/update', tb)
}


export const deleteTable = async function (id: number | string) {
  return await request.post('/table/remove', { id })
}