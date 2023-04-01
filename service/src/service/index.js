const commonApi = require('./common-service/common.index')
const databaseApi = require('./model-service/Database.service')
const tableApi = require('./model-service/Table.service')
const fieldApi = require('./model-service/Fields.service')
const userApi = require('./model-service/User.service')
const vcodeApi = require('./model-service/Vcode.service')

module.exports = {
  common: commonApi,
  field: fieldApi,
  table: tableApi,
  database: databaseApi,
  user: userApi,
  vcode: vcodeApi,
}
