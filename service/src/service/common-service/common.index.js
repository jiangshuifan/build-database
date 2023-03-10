
const { Table, Database, Fields, } = require('../../model/index');
const { Op } = require("sequelize");

const { formatToNormalArray } = require('./common.func')
const { createTable, getAllTable } = require('../model-service/Table.service')
const { getAllField, createField, updateField } = require('../model-service/Fields.service')
class CrossTablesService {
  //获取数据库表格以及除当前表格的所有表格下字段·树结构字典
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
      isMarjorKey: 1,
      isForeignKey: 0,
      tbId: id,
      targetKey: null
    }
    await createField(defaultFiled)
    return res
  }
  //获得一个数据库下所有主键、外键对应关系
  getAllMarjorKeyAndForeignKeyByDBID = async (dbId) => {
    let target = []
    let tables = await getAllTable(dbId)
    for (let item of tables) {
      //拿到各表的主键id
      let marjor = await Fields.findAll({
        where: {
          tb_id: item.id,
          is_marjor_key: true
        }
      })
      marjor = (await formatToNormalArray(marjor))[0]

      let foreign = await Fields.findAll({
        where: {
          target_key: JSON.stringify([marjor.tbId, marjor.id])
        }
      })
      foreign = await formatToNormalArray(foreign)
      foreign.forEach(key => {
        let item = {
          marjorKeyTable: marjor.tbId,
          foreignKeyTable: key.tbId,
          marjorkeyField: marjor.id,
          foreignKeyField: key.id
        }
        target.push(item)
      })
    }
    return target
  }
  //创建、更新字段，设置了主外键，先判断是否需要更新主外键表
  handleFieldAndUpdateRelatedKey = async (type, data) => {
    let originMarjor = await Fields.findAndCountAll({
      where: {
        tb_id: data.tbId,
        is_marjor_key: 1
      }
    })
    //分类型为新增和更新处理
    if (type === 'add') {
      //找到当前表格当前的主键
      if (data.isMarjorKey === 1) {
        if (originMarjor.count !== 0) {
          //之前就有主键，那么将之前的主键改为非主键，再加入数据
          await updateField({ id: originMarjor.rows[0].id, is_marjor_key: false })
        }
      }
      return await createField(data)
    } else if (type === 'update') {//更新操作,主要考虑是否要对其它数据进行修改
      if (data.isMarjorKey === 1) {
        if (originMarjor.count !== 0) {
          //之前就有主键，那么将之前的主键改为非主键，再加入数据
          await updateField({ id: originMarjor.rows[0].id, is_marjor_key: false })
        }
      }
      return await updateField(data)
    }
  }
  //更新字段，设置了主外键，先判断是否需要更新主外键表
}


module.exports = new CrossTablesService()