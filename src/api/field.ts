import request from "../utils/request"
import { TableField, dbField } from "../database"
export const getFieldList = async function (tbId: string | number) {
  return await request.post<TableField[]>('/field/list', { tbId })
}

export const createField = async function (fd: dbField) {
  return await request.post<dbField>('/field/add', fd)
}


export const updateField = async function (fd: dbField) {
  return await request.post('/field/update', fd)
}


export const deleteField = async function (id: number | string) {
  return await request.post('/field/remove', { id })
}