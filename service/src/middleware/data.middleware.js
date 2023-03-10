
const {validateParams} =require("../utils/validate")


let getListMiddleware =async (ctx,next) =>{
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



let addDbMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["name","type","isPrivate"]
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
getListMiddleware,addDbMiddleware
}
