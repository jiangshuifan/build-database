const { Fields } = require('../../model/index')
const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')


class FieldsService {
  getAllUsers = async () => {
    let users = await User.findAll()
    users = await formatToNormalArray(users)
    return users
  }
}

module.exports = new FieldsService()