
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



let addDbMiddleware =async (ctx,next) =>{
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



let updateDbMiddleware =async (ctx,next) =>{
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



let removeDbMiddleware =async (ctx,next) =>{
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
getListMiddleware,addDbMiddleware,updateDbMiddleware,removeDbMiddleware
}
