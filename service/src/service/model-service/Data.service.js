const { Data } = require('../../model/index')
const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class DataService {
  getAllDatas = async (tabldId) => {
    let database = await Data.findAll({
      where: {
        tb_Id: tabldId
      }
    })
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
    let res = await Data.create(newDb)
    console.log(res)
  }
}

module.exports = new DataService()