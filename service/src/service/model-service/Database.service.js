const { Database } = require('../../model/index')
const { Op } = require("sequelize");

const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class DatabaseService {
  getAllDatabase = async () => {
    let database = await Database.findAll()
    database = await formatToNormalArray(database)
    return database
  }
  createDatabase = async ({ dbName, dbType, isPrivate, password }) => {
    console.log(dbName, dbType, isPrivate, password)
    const newDb = {
      db_name: dbName,
      db_type: dbType,
      db_icon: '',
      password,
      is_private: isPrivate
    }
    const res = await Database.create(newDb)
    return res.dataValues
  }
  isDBNameRepeat = async (db) => {
    let params
    if (Object.hasOwn(db, 'id')) {
      params = {
        db_name: db.dbName,
        [Op.not]: {
          id: db.id
        }
      }
    } else {
      params = {
        db_name: db.dbName
      }
    }
    return await getValueIsExisted(Database, params)
  }
  updateDatabase = async (dbId, data) => {
    let propertyList = ['dbName', 'password']
    let columnList = ['db_name', 'password'] //字段意义和上面对应就行了
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