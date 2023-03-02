

class UserHandler{
  //登录
  login(ctx){
    console.log(ctx.request.body)
    ctx.body={
      success:true,
      info:'登录成功！'
    }
  }
  //获取验证码
  getValidateCode(){

  }
  //退出
  logout(){

  }
  //邮箱注册
  registerWithMail(){
    
  }
  //重置密码
  resetPassword(){

  }
  //修改头像
  changeHeaderIcon(){

  }
}

module.exports =new UserHandler()