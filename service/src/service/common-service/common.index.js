
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
  //获取数据库表格以及下面所有字段
  getAllTablesAndField = async (dbId) => {
    let tbs = await getAllTable(dbId)
    for (let i = 0; i < tbs.length; i++) {
      let nodes = await getAllField(tbs[i].id)
      tbs[i].children = nodes
    }
    return tbs
  }
  //新建数据库同时加入默认id字段
  createTableAndSetDefaultField = async (data) => {
    const res = await createTable(data)
    let id = res.id
    let defaultFiled = {
      field: 'id',
      name: 'id',
      type: 'NUMBER',
      isMarjorKey: 1,
      isForeignKey: 0,
      tbId: id,
      targetKey: null,
      allowNull: false,
      unique: true,
      dbId: data.dbId
    }
    await createField(defaultFiled)
    return res
  }
  //获得一个数据库下所有主键、外键对应关系
  getAllMarjorKeyAndForeignKeyByDBID = async (dbId) => {
    let target = []
    let tbs = {}
    let tables = await getAllTable(dbId)
    let foreignFields = []
    for (let item of tables) {
      tbs[item.id] = item
    }
    let foreign = await Fields.findAll({
      where: {
        db_id: dbId,
        is_foreign_key: true
      }
    })
    foreignFields.push(...foreign)
    if (foreignFields.length > 0) {
      foreignFields = await formatToNormalArray(foreignFields)
      for (let i = 0; i < foreignFields.length; i++) {
        let key = foreignFields[i]
        let marjor = JSON.parse(key.targetKey)
        let currentField = await Fields.findOne({
          where: {
            id: marjor[1]
          }
        })
        let item = {
          marjorKeyTable: marjor[0],
          foreignKeyTable: key.tbId,
          marjorKeyField: marjor[1],
          foreignKeyField: key.id,
          foreignKeyName: key.field,
          marjorKeyName: currentField.field,
          foreignKeyTableName: tbs[key.tbId].name,
          marjorKeyTableName: tbs[marjor[0]].name,
          foreignKeyType: tbs[key.tbId].type,
          marjorKeyType: currentField.type,
        }
        target.push(item)
      }
    }
    //JSON.stringify([marjor.tbId, marjor.id])
    return target
  }
  //创建、更新字段，设置了主外键，先判断是否需要更新主外键表
  handleFieldAndUpdateRelatedKey = async (type, data) => {
    let originMarjor = await Fields.findAndCountAll({
      where: {
        tb_id: data.tbId,
        is_marjor_key: true
      }
    })
    //分类型为新增和更新处理
    if (type === 'add') {
      //找到当前表格当前的主键
      if (data.isMarjorKey === 1) {
        if (originMarjor.count !== 0) {
          console.log(originMarjor.rows[0])
          //之前就有主键，那么将之前的主键改为非主键，再加入数据
          await updateField({ id: originMarjor.rows[0].id, isMarjorKey: false })
        }
      }
      return await createField(data)
    } else if (type === 'update') {//更新操作,主要考虑是否要对其它数据进行修改
      if (data.isMarjorKey === 1) {
        if (originMarjor.count !== 0) {
          //之前就有主键，那么将之前的主键改为非主键，再加入数据
          await updateField({ id: originMarjor.rows[0].id, isMarjorKey: false })
        }
      }
      return await updateField(data)
    }
  }
  //得到当前数据库下所有主外键关系，需要拿到
}


module.exports = new CrossTablesService()