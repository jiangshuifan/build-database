import request from "../utils/request"


export const getFieldTypes = async function (type: string) {
  return await request.post('/dic/field-types', {
    type,
  })
}


export const getSupportedDbTypes = async function () {
  return await request.post('/dic/database-types')
}
