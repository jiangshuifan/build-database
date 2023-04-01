const { Vcode } = require('../../model/index')
const {
  formatToNormalArray,
  getValueIsExisted,
} = require('../common-service/common.func')

class VcodeService {
  addVcode = async ({ email, code, ip }, duration) => {
    let newData = {
      email,
      ip,
      times: 1,
      code,
      time_stamp: new Date().getTime() + 1000 * 60 * duration
    }
    console.log(newData)
    await Vcode.create(newData)
  }
  //#region  查询
  //用户名是否已经存在
  getEmailIsExisted = async (email) => {
    return await getValueIsExisted(Vcode, { email: email })
  }
  //#endregion

  //#region 删除一条用户数据
  deleteCodeRecord = async (email) => {
    let isExist = await getValueIsExisted(Vcode, { email: email })
    if (!isExist) {
      throw new Error('email does not exist')
    } else {
      await Vcode.destroy({
        where: {
          email: email,
        },
      })
    }
  }
  //#endregion

  //#region 更新
  updateCodeRecord = async ({ email, code }, duration) => {
    const record = await Vcode.findOne({
      where: {
        email: email
      }
    })
    Vcode.update({
      code, times: record.times + 1,
      time_stamp: new Date().getTime() + 1000 * 60 * duration
    }, {
      where: {
        email: email
      }
    })
  }
  //#endregion
}

module.exports = new VcodeService()
