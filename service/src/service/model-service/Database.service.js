const { Database } = require('../../model/index')
const { Op } = require("sequelize");

const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class DatabaseService {
  //数据库列表
  getAllDatabase = async () => {
    let database = await Database.findAll()
    database = await formatToNormalArray(database)
    return database
  }
  //创建数据库
  createDatabase = async ({ name, type, isPrivate, password }) => {
    console.log(name, type, isPrivate, password)
    const newDb = {
      name: name,
      type: type,
      db_icon: '',
      password,
      is_private: isPrivate
    }
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
    let propertyList = ['name', 'password']
    let columnList = ['name', 'password'] //字段意义和上面对应就行了
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
}
module.exports = new DatabaseService()