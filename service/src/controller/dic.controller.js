const { DataTypes } = require("sequelize")
const { formatReturn, formatDic, StringArrayToDic } = require('../utils/format')
const { common, database } = require('../service/index')
const { getTablesAndFields } = common
const { getDbById } = database
class DictionaryHandler {
  handleFieldTypes = async (ctx) => {
    try {
      const { dbId } = ctx.request.body
      let database = await getDbById(dbId)
      let dicList = []
      Object.keys(DataTypes[database.type]).forEach((key, index) => {
        dicList.push({ id: index, value: key, label: key })
      })
      ctx.body = formatReturn(true, dicList)
    }
    catch (err) {
      console.log(err)
    }
  }
  handleTableAndFieldDic = async (ctx) => {
    try {
      const { dbId, tbId } = ctx.request.body
      let dicData = await getTablesAndFields(dbId, tbId)
      ctx.body = formatReturn(true, formatDic(dicData, { label: 'name', value: 'id' }))
    } catch (err) {
      console.log(err)
    }
  }
  handleSupportedDBType = async (ctx) => {
    try {
      let dic = StringArrayToDic(['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'])
      ctx.body = formatReturn(true, dic)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new DictionaryHandler()