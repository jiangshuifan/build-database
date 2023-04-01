
class UserError {
  ExecuteError = "执行报错"
  AccountExistError = "账号已注册，请直接登录"
  GetVCodeTooManyTimesError = "当前设备获取验证码次数过多！"
  IpChange = "当前账户在短时间内于不同ip进行注册，请注意账户安全！"
  AccountRegisteredError = "账号已注册，请直接登录"
  VcodeExpiredError = "验证码过期，请重新获取"
  VcodeError = "验证码错误，请重新输入"
  VcodeValidError = "验证码无效，请先获取验证码"
}
module.exports = new UserError()