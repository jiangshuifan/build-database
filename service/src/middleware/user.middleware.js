
const {validateParams} =require("../utils/validate")


let getVerificationCodeMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["email"]
  let res = {
    success:true
  }
  if(requiredParamsList.length>0){
    res =await validateParams(params,requiredParamsList)
  }
  if (res.success) {
    await next()
  } else {
    ctx.app.emit('error', '必要参数' + res.errParams + '缺失', ctx)
  }
}



let registerWithMailMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["email","password","code"]
  let res = {
    success:true
  }
  if(requiredParamsList.length>0){
    res =await validateParams(params,requiredParamsList)
  }
  if (res.success) {
    await next()
  } else {
    ctx.app.emit('error', '必要参数' + res.errParams + '缺失', ctx)
  }
}



let handleLoginMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["email","password"]
  let res = {
    success:true
  }
  if(requiredParamsList.length>0){
    res =await validateParams(params,requiredParamsList)
  }
  if (res.success) {
    await next()
  } else {
    ctx.app.emit('error', '必要参数' + res.errParams + '缺失', ctx)
  }
}



let handleLogoutMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = []
  let res = {
    success:true
  }
  if(requiredParamsList.length>0){
    res =await validateParams(params,requiredParamsList)
  }
  if (res.success) {
    await next()
  } else {
    ctx.app.emit('error', '必要参数' + res.errParams + '缺失', ctx)
  }
}

module.exports = {
getVerificationCodeMiddleware,registerWithMailMiddleware,handleLoginMiddleware,handleLogoutMiddleware
}
