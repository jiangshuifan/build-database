
const { Table, Database, Fields } = require('../../model/index');
const { Op } = require("sequelize");

const { formatToNormalArray } = require('./common.func')
const { createTable } = require('../model-service/Table.service')
const { getAllField, createField } = require('../model-service/Fields.service')
const { createMarjorKey } = require('../model-service/Marjorkey.service')

class CrossTablesService {
  //获取数据库表格以及所有表格下字段·树结构
  getTablesAndFields = async (dbId, tableId) => {
    let tables = await Table.findAll({
      where: {
        db_id: dbId,
        [Op.not]: {
          id: tableId
        }
      }
    })
    tables = await formatToNormalArray(tables)
    for (let i = 0; i < tables.length; i++) {
      let tb = tables[i]
      let fileds = await getAllField(tb.id)
      if (fileds.length > 0)
        tb.children = fileds
    }
    return tables
  }
  //新建数据库同时加入默认id字段
  createTableAndSetDefaultField = async (data) => {
    const res = await createTable(data)
    let id = res.id
    let defaultFiled = {
      field: 'id',
      name: 'id',
      type: 'Number',
      isMarjorkey: 'true',
      isForeignkey: 'false',
      tbId: id
    }
    const field = await createField(defaultFiled)
    console.log(id, field.id)
    await createMarjorKey(id, field.id)
    return res
  }
}


module.exports = new CrossTablesService()