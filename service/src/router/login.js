const Router = require('koa-router');
const {login,getValidateCode,logout,registerWithMail,resetPassword,changeHeaderIcon} =require("../controller/user.controller")
const router = new Router({ prefix: '/user' });
//登录
router.post('/login', login);
//验证码
router.post('/getValidateCode', getValidateCode);
//退出登录
router.post('/logout', logout);
//注册
router.post('/regist', registerWithMail);
//重置密码
router.post('/resetPassword', resetPassword);
//修改头像
router.post('/changeHeaderIcon', changeHeaderIcon);

module.exports = router;
