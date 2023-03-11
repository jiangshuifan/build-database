
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
  let requiredParamsList = ["name"]
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
    ctx.app.emit('error', '必要参数' + res.errParams + '缺失', ctx)
  }
}



let removeDbMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["id"]
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



let getAllFieldRelationMiddleware =async (ctx,next) =>{
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



let downloadDbMiddleware =async (ctx,next) =>{
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



let fuzzyQueryDbMiddleware =async (ctx,next) =>{
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
getListMiddleware,addDbMiddleware,updateDbMiddleware,removeDbMiddleware,getAllFieldRelationMiddleware,downloadDbMiddleware,fuzzyQueryDbMiddleware
}
