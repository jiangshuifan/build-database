const { Table } = require('../../model/index')
const { Op } = require("sequelize");
const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')

class TableService {
  //获取数据库下所有表格
  getAllTable = async (dbId) => {
    let tables = await Table.findAll({
      where: {
        db_id: dbId,
      }
    })
    tables = await formatToNormalArray(tables)
    return tables
  }

  //新建
  createTable = async (data) => {
    const newTb = {
      name: data.name,
      db_id: data.dbId,
    }
    const res = await Table.create(newTb)
    return res.dataValues
  }
  //name字段是否重复
  isTBNameRepeat = async (tb) => {
    let params = {
      db_id: tb.dbId,
      name: tb.name,
    }
    if (Object.hasOwn(tb, 'id')) {
      params = {
        db_id: tb.dbId,
        name: tb.name,
        [Op.not]: {
          id: tb.id
        }
      }
    }
    let res = await getValueIsExisted(Table, params)
    return res
  }
  //更新
  updateTable = async (tbId, data) => {
    let propertyList = ['name']
    let columnList = ['name'] //字段意义和上面对应就行了
    let proj = {}
    for (let i in propertyList) {
      if (data[propertyList[i]] !== undefined)
        proj[columnList[i]] = data[propertyList[i]]
    }
    Table.update(proj, {
      where: {
        id: tbId,
      },
    })
  }
  // 删
  deleteTableById = async (tbId) => {
    let exist = await Table.findOne({
      where: {
        id: tbId,
      },
    })
    if (exist === null) {
      throw new Error('table does not exist')
    } else {
      await Table.destroy({
        where: {
          id: tbId,
        },
      })
    }
  }
}

module.exports = new TableService()