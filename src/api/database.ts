import request from "../utils/request"
import { downloadBlobFile } from "../utils/download"
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


interface iTableFieldRelation {
  foreignKeyField: number,
  foreignKeyTable: number,
  marjorKeyTable: number,
  marjorKeyField: number,
  marjorKeyName: string,
  foreignKeyName: string,
}
//获取一数据库下所有主外键关系
export const getTableFieldRelation = async function (dbId: number) {
  return await request.post<iTableFieldRelation[]>('/database/field-relation', { id: dbId })
}


export const downloadDb = async function (dbId: number, dbName: string) {
  let blob = await request.post('/database/download', { id: dbId }, "blob")
  downloadBlobFile(blob, dbName + new Date().getTime() + '.db')
}

export const fuzzyQueryDbs = async function (keyword: string) {
  return await request.post<Database[]>('/database/fuzzy-query', { keyword })

}