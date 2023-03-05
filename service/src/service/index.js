const commonApi = require('./common-service/common.func')
const databaseApi = require('./model-service/Database.service')
const tableApi = require('./model-service/Table.service')
const fieldApi = require('./model-service/Fields.service')
const dataApi = require('./model-service/Data.service')
module.exports = {
  ...commonApi,
  ...fieldApi,
  ...tableApi,
  ...databaseApi,
  ...dataApi
}
