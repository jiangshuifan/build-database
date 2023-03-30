
const {validateParams} =require("../utils/validate")


let getListMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["dbId"]
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



let getListByNameMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["dbName"]
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



let addTbMiddleware =async (ctx,next) =>{
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



let updateTbMiddleware =async (ctx,next) =>{
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



let removeTbMiddleware =async (ctx,next) =>{
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



let getTableTreeMiddleware =async (ctx,next) =>{
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



let fuzzyQueryTbMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let requiredParamsList = ["dbId","keyword"]
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
getListMiddleware,getListByNameMiddleware,addTbMiddleware,updateTbMiddleware,removeTbMiddleware,getTableTreeMiddleware,fuzzyQueryTbMiddleware
}
