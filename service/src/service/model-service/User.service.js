const { User } = require('../../model/index')
const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')

class UserService {
  //#region  查询
  getUser = async ({ email, password }) => {
    return await getValueIsExisted(User, { account: email, password })
  }
  //获取系统用户目录
  getAllUsers = async () => {
    let users = await User.findAll()
    users = await formatToNormalArray(users)
    return users
  }
  //用户名是否已经存在
  getUserNameIsExisted = async (email) => {
    return await getValueIsExisted(User, { account: email })
  }
  //#endregion

  //#region  新增一条用户数据
  addNewUser = async ({ email, password }) => {
    let newData = {
      account: email,
      password,
      headicon: '/user/headicon/man.svg'
    }
    await User.create(newData)
  }
  //#endregion

  //#region 删除一条用户数据
  deleteUser = async (userId) => {
    let exist = await User.findOne({
      where: {
        id: userId,
      },
    })
    if (exist === null) {
      throw new Error('userId does not exist')
    } else {
      await User.destroy({
        where: {
          id: userId,
        },
      })
    }
  }
  //#endregion

  //#region 更新
  //修改密码，这个权限给用户还是管理员？还是都给,e，要验证密码吗，密码要加密吗
  updatePassword = async (userId) => {
    console.log('改密码的，这个方法还未编写呀')
  }
  //#endregion
}

module.exports = new UserService()
