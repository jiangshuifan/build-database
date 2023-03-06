import request from "../utils/request"
import { Database, dbParams } from "../database"
export const getDatabaseList = async function () {
  return await request.post<Database[]>('/database/list')
}

export const createDatabase = async function (db: dbParams) {
  return await request.post<dbParams>('/database/add', db)
}
export const updateDatabase = async function (db: dbParams) {
  return await request.post('/database/update', db)
}

export const deleteDatabase = async function (id: string | number) {
  return await request.post('/database/remove', { id })
}
