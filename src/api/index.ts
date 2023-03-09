import request from "../utils/request"

type type = 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql' | 'db2' | 'snowflake' | 'oracle'

export const getFieldTypes = async function (type: type) {
  return await request.post('/dic/field-types', {
    type,
  })
}
