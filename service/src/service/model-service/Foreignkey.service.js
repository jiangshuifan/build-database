const { Foreign } = require('../../model/index')
const { Op } = require("sequelize");

const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class ForeignkeyService {
  //创建外键
  createForeignKey = async (tbId, key, MarjorKey) => {
    const res = await Foreign.create({ table_id: tbId, field_id: key, marjor_key_id: MarjorKey })
    return res.dataValues
  }
  //更新某一数据库数据信息
  updateForeignKey = async (tableId, fieldId) => {
    Foreign.update({ field_id: fieldId }, {
      where: {
        table_id: tableId,
      },
    })
  }
  deleteForeignKey = async (fieldId) => {
    Foreign.destroy({
      where: {
        field_id: fieldId,
      },
    })
  }
  checkHasRelationReflect = async (MarjorKey) => {
    return await getValueIsExisted(Foreign, {
      marjor_key_id: MarjorKey
    })
  }
}
module.exports = new ForeignkeyService()