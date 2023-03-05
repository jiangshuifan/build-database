const { Database } = require('../../model/index')
const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class DatabaseService {
  getAllDatabase = async () => {
    let database = await Database.findAll()
    database = await formatToNormalArray(database)
    console.log(database)
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
    await Database.create(newDb)
  }
}
module.exports = new DatabaseService()