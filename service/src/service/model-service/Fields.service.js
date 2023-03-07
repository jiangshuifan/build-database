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
    console.log(fields)
    return fields
  }
  //新建
  createField = async (params) => {
    const newFd = {
      field: params.field,
      fd_name: params.fdName,
      fd_type: params.fdType,
      is_marjorkey: params.isMarjorKey,
      is_foreignkey: params.isForeignKey,
      tb_id: params.tbId
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
    console.log(data)
    let propertyList = ['field', 'fdName', 'fdType', 'isMarjorKey', 'isForeignKey', 'tbId']
    let columnList = ['field', 'fd_name', 'fd_type', 'is_marjorkey', 'is_foreignkey', 'tb_id'] //字段意义和上面对应就行了
    let proj = {}
    for (let i in propertyList) {
      if (data[propertyList[i]] !== undefined)
        proj[columnList[i]] = data[propertyList[i]]
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