
const Router = require('koa-router')
const router = new Router({ prefix: '/user'})
  
const { getVerificationCode,registerWithMail,handleLogin,handleLogout,resetPassword } = require('../controller/user.controller.js')
const { getVerificationCodeMiddleware,registerWithMailMiddleware,handleLoginMiddleware,handleLogoutMiddleware,resetPasswordMiddleware } = require('../middleware/user.middleware.js')

  
//获取验证码
router.post('/getcode',getVerificationCodeMiddleware,getVerificationCode)


//注册
router.post('/register',registerWithMailMiddleware,registerWithMail)


//登录
router.post('/login',handleLoginMiddleware,handleLogin)


//退出登录
router.post('/logout',handleLogoutMiddleware,handleLogout)


//重置密码
router.post('/resetpassword',resetPasswordMiddleware,resetPassword)

module.exports = router 
