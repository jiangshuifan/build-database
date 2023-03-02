const { DataTypes } = require("sequelize")

class DictionaryHandler {
  handleFieldTypes(ctx) {
    const { type } = ctx.request.body
    let dicList = []
    Object.keys(DataTypes[type]).forEach((key, index) => {
      dicList.push({ id: index, value: key, label: key })
    })
    ctx.body = dicList
  }
}

module.exports = new DictionaryHandler()