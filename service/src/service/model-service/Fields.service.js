const { Fields } = require('../../model/index')
const { Op } = require("sequelize");

const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class FieldsService {
  getAllField = async (tbId) => {
    let fields = await Fields.findAll({
      where: {
        tb_id: tbId
      }
    })
    fields = await formatToNormalArray(fields)
    return fields
  }
  //新建
  createField = async (params) => {
    const newFd = {
      field: params.field,
      name: params.name,
      type: params.type,
      is_marjor_key: params.isMarjorKey,
      is_foreign_key: params.isForeignKey,
      target_key: params.targetKey,
      tb_id: params.tbId,
      allow_null: params.allowNull,
      unique: params.unique,
      db_id: params.dbId
    }
    const res = await Fields.create(newFd)
    return res.dataValues
  }
  //name字段是否重复
  isFieldRepeat = async (fd) => {
    let params = {
      tb_id: fd.tbId,
      field: fd.field,
    }
    if (Object.hasOwn(fd, 'id')) {
      params = {
        tb_id: fd.tbId,
        field: fd.field,
        [Op.not]: {
          id: fd.id
        }
      }
    }
    return await getValueIsExisted(Fields, params)
  }
  //更新
  updateField = async (data) => {
    if (Array.isArray(data.targetKey)) {
      data.targetKey = JSON.stringify(data.targetKey)
    }
    let propertyList = ['field', 'name', 'type', 'tbId', 'isMarjorKey', 'isForeignKey', 'targetKey', 'allowNull', 'unique']
    let columnList = ['field', 'name', 'type', 'tb_id', 'is_marjor_key', 'is_foreign_key', 'target_key', 'allow_null', 'unique'] //字段意义和上面对应就行了
    let proj = {}
    for (let i in propertyList) {
      if (data[propertyList[i]] !== undefined) {
        proj[columnList[i]] = data[propertyList[i]]
      }
    }
    Fields.update(proj, {
      where: {
        id: data.id,
      },
    })
  }
  // 删
  deleteFieldById = async (fdId) => {
    let exist = await Fields.findOne({
      where: {
        id: fdId,
      },
    })
    if (exist === null) {
      throw new Error('table does not exist')
    } else {
      await Fields.destroy({
        where: {
          id: fdId,
        },
      })
    }
  }
}

module.exports = new FieldsService()