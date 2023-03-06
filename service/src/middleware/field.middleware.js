
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
    throw new Error('必要参数' + res.errParams + '缺失')
  }
}



let addFieldMiddleware =async (ctx,next) =>{
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
    throw new Error('必要参数' + res.errParams + '缺失')
  }
}



let updateFieldMiddleware =async (ctx,next) =>{
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
    throw new Error('必要参数' + res.errParams + '缺失')
  }
}



let removeFieldMiddleware =async (ctx,next) =>{
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
    throw new Error('必要参数' + res.errParams + '缺失')
  }
}

module.exports = {
getListMiddleware,addFieldMiddleware,updateFieldMiddleware,removeFieldMiddleware
}
