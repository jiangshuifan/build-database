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
  createDatabase = async ({ name, type, isPrivate, password }) => {
    console.log(name, type, isPrivate, password)
    const newDb = {
      name: name,
      type: type,
      db_icon: '',
      password,
      is_private: isPrivate
    }
    let res = await Data.create(newDb)
    console.log(res)
  }
}

module.exports = new DataService()