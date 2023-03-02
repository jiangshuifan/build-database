import request from "../utils/request"

type dbType = 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql' | 'db2' | 'snowflake' | 'oracle'

export const getFieldTypes = async function (type: dbType) {
  return await request.post('/dic/field-types', {
    type,
  })
}
