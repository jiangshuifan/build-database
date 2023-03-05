import request from "../utils/request"

export const getDatabaseList = async function () {
  return await request.post('/database/list')
}



interface dbParams {
  dbName: string,
  dbType: 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql' | 'db2' | 'snowflake' | 'oracle',
  isPrivate: boolean,
  password: string
}
export const createDatabase = async function (db: dbParams) {
  return await request.post('/database/add', db)
}
