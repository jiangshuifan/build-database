const { DataTypes } = require("sequelize")
const { formatReturn, formatDic } = require('../utils/format')
const { common } = require('../service/index')
const { getTablesAndFields } = common
class DictionaryHandler {
  handleFieldTypes(ctx) {
    const { type } = ctx.request.body
    let dicList = []
    Object.keys(DataTypes[type]).forEach((key, index) => {
      dicList.push({ id: index, value: key, label: key })
    })
    ctx.body = formatReturn(true, dicList)
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
}

module.exports = new DictionaryHandler()