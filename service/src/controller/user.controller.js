
const createVerificationCode = require('../utils/verification-code')
const { formatReturn } = require('../utils/format')
const { sendVerificationCodeWithMail ,sendResetPasswordVCodeWithMail} = require('../utils/send-mail')
const { getClientIP } = require('../utils/ip')
const { qqMailConfig } = require('../../private/private-global')
const { vcode, user } = require("../service/index")
const { addVcode, updateCodeRecord, getEmailIsExisted, deleteCodeRecord } = vcode
const { getUserNameIsExisted: isUserExist, addNewUser,updatePassword } = user

const { createToken, validateToken } = require('../utils/token')

const { IpChange, GetVCodeTooManyTimesError, AccountExistError, ExecuteError, AccountRegisteredError,
  VcodeExpiredError, VcodeValidError, VcodeError,AccountDidNotRegisterError
} = require('../errors/user.err')
const { VALID_DURATION } = require('../../config');
class UserHandler {
  //验证码
  getVerificationCode = async (ctx) => {
    try {
      let { email,type } = ctx.request.body
      let code = createVerificationCode()
      let ip = getClientIP(ctx)
      //已注册列表中，是否已经存在
      let isRegistered = await isUserExist(email)
      if (isRegistered && type==='1') {//已注册而在走注册流程
        ctx.app.emit('error', AccountExistError, ctx)
      } else {
        //正在注册列表中email是否存在
        let isExist = await getEmailIsExisted(email)
        if (isExist) {
          //次数小于5
          if (isExist.times < 5) {
            //已存在，判断是否过期
            let timeStamp = isExist.timeStamp
            let currentTimeStamp = new Date().getTime()
            let gap = parseInt(timeStamp) - currentTimeStamp
            console.log(gap)
            if (gap <= 0) {
              //过期则直接更新
              await updateCodeRecord({ email, code }, VALID_DURATION)
              if(type==='1'){
                await sendVerificationCodeWithMail({
                  account: email,
                  verificationCode: code,
                  projectName: '于未然的数据库设计项目'
                }, qqMailConfig)
              }else if(type==='2'){
                await sendResetPasswordVCodeWithMail({
                  account: email,
                  verificationCode: code,
                  projectName: '于未然的数据库设计项目'
                }, qqMailConfig)
              }
              ctx.body = formatReturn(true, '验证码已发送，注意查收')
            } else {
              //未过期 判断ip
              if (ip === ip) {
                //5min内不能更新
                ctx.app.emit('error', `请于${parseInt(gap / 1000)}s后重新获取验证码`, ctx)
              } else {
                //和最近ip注册地址不一致
                ctx.app.emit('error', IpChange, ctx)
              }
            }
          } else {//>5次数过多
            ctx.app.emit('error', GetVCodeTooManyTimesError, ctx)
          }
        } else {
          //不存在，新增
          await addVcode({ email, code, ip }, VALID_DURATION)
          await sendVerificationCodeWithMail({
            account: email,
            verificationCode: code,
            projectName: '于未然的数据库设计项目'
          }, qqMailConfig)
          ctx.body = formatReturn(true, '验证码已发送，注意查收')
        }
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', ExecuteError, ctx)
    }
  }
  //登录
  handleLogin = async (ctx) => {
    try {
      let { email, password } = ctx.request.body
      let isRegistered = await isUserExist(email)
      if (isRegistered) {
        if (password === isRegistered.password) {
          let token = await createToken({ email, password })
          ctx.body = formatReturn(true, {
            token: token
          })
        } else {
          ctx.app.emit('error', "密码错误", ctx)
        }
      } else {
        ctx.app.emit('error', "当前账号尚未注册，请注册后再试", ctx)
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', ExecuteError, ctx)
    }

  }
  //退出
  handleLogout() {

  }
  //邮箱注册
  registerWithMail = async (ctx) => {
    const { email, password, code } = ctx.request.body
    let isRegistered = await isUserExist(email)
    if (isRegistered) {
      ctx.app.emit('error', AccountRegisteredError, ctx)
    } else {
      let isExist = await getEmailIsExisted(email)
      if (isExist) {//发送过验证码
        let timeStamp = isExist.timeStamp
        let currentTimeStamp = new Date().getTime()
        let gap = parseInt(timeStamp) - currentTimeStamp
        if (gap < 0) {//过期
          ctx.app.emit('error', VcodeExpiredError, ctx)
        } else {//未过期
          if (isExist.code === code) {//注册
            await addNewUser({ email, password })
            await deleteCodeRecord(email)
            ctx.body = formatReturn(true, "注册成功！")
          } else {//验证码错误
            ctx.app.emit('error', VcodeError, ctx)
          }
        }
      } else {//未发送过验证码
        ctx.app.emit('error', VcodeValidError, ctx)
      }
    }
  }
  //重置密码
  resetPassword=async(ctx)=> {
    const { email, password, code } = ctx.request.body
    let isRegistered = await isUserExist(email)
    if (isRegistered) {
      let isExist = await getEmailIsExisted(email)
      if (isExist) {//发送过验证码
        let timeStamp = isExist.timeStamp
        let currentTimeStamp = new Date().getTime()
        let gap = parseInt(timeStamp) - currentTimeStamp
        if (gap < 0) {//过期
          ctx.app.emit('error', VcodeExpiredError, ctx)
        } else {//未过期
          if (isExist.code === code) {//重置密码
            await updatePassword(email, password)
            await deleteCodeRecord(email)
            ctx.body = formatReturn(true, "密码重置成功！")
          } else {//验证码错误
            ctx.app.emit('error', VcodeError, ctx)
          }
        }
      } else {//未发送过验证码
        ctx.app.emit('error', VcodeValidError, ctx)
      }
    } else {
      ctx.app.emit('error', AccountDidNotRegisterError, ctx)
    }
  }
  //修改头像
  changeHeaderIcon() {

  }
}

module.exports = new UserHandler()