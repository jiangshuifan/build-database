const { Database } = require('../../model/index')
const { Op } = require("sequelize");

const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class DatabaseService {
  //数据库列表
  getAllDatabase = async (account) => {
    let database = await Database.findAll({
      where: {
        user_id: account
      }
    })
    database = await formatToNormalArray(database)
    return database
  }
  //创建数据库
  createDatabase = async ({ name, type, description, account }) => {
    const newDb = {
      name: name,
      type: type,
      description: description,
      user_id: account
    }
    console.log(newDb)
    const res = await Database.create(newDb)
    return res.dataValues
  }
  //判断名称是否重复
  isDBNameRepeat = async (db) => {
    let params
    if (Object.hasOwn(db, 'id')) {
      params = {
        name: db.name,
        [Op.not]: {
          id: db.id
        }
      }
    } else {
      params = {
        name: db.name
      }
    }
    return await getValueIsExisted(Database, params)
  }
  //更新某一数据库数据信息
  updateDatabase = async (dbId, data) => {
    let propertyList = ['name', 'password', 'description']
    let columnList = ['name', 'password', 'description'] //字段意义和上面对应就行了
    let proj = {}
    for (let i in propertyList) {
      if (data[propertyList[i]] !== undefined)
        proj[columnList[i]] = data[propertyList[i]]
    }
    Database.update(proj, {
      where: {
        id: dbId,
      },
    })
  }
  //删除数据库
  deleteDatabaseById = async (dbId) => {
    let exist = await Database.findOne({
      where: {
        id: dbId,
      },
    })
    if (exist === null) {
      throw new Error('database does not exist')
    } else {
      await Database.destroy({
        where: {
          id: dbId,
        },
      })
    }
  }
  //通过id获取数据库
  getDbById = async (dbId) => {
    let db = await Database.findOne({
      where: {
        id: dbId,
      },
    })
    if (db === null) {
      throw new Error('database does not exist')
    } else {
      return db.dataValues
    }
  }
  getDatabaseByName = async (name,account) => {
    let res = await Database.findAll({
      where: {
        name: {
          [Op.substring]: name
        },
        user_id:account
      },
    })
    res = await formatToNormalArray(res)
    return res
  }
}
module.exports = new DatabaseService()