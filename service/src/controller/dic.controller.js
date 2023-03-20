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
      let ind = 1
      Object.keys(DataTypes).forEach((key) => {
        if (key.charCodeAt(0) < 97) {
          if (Object.hasOwn(DataTypes[key].types, database.type)) {
            console.log(Object.hasOwn(DataTypes[key].types, database.type), key, DataTypes[key].types)
            dicList.push({ id: ind, value: key, label: key })
            ind++
          }
        }
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
      dicData.forEach(item => {
        item.field = item.name
      })
      ctx.body = formatReturn(true, formatDic(dicData, { label: 'field', value: 'id' }))
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