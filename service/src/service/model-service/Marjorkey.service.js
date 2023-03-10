const { Marjor } = require('../../model/index')
const { Op } = require("sequelize");

const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class MarjorkeyService {
  //创建主键
  createMarjorKey = async (tbId, key) => {
    const res = await Marjor.create({ table_id: tbId, field_id: key })
    return res.dataValues
  }
  //更新某一数据库数据信息
  updateMarjorKey = async (tableId, fieldId) => {
    Marjor.update({ field_id: fieldId }, {
      where: {
        table_id: tableId,
      },
    })
  }
  checkHasRelationReflect = async () => {

  }
}
module.exports = new MarjorkeyService()