
const {validateParams} =require("../utils/validate")


let getListMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let res = validateParams(params, requiredParamsList)
  if (res.success) {
    next()
  } else {
    throw new Error('必要参数' + res.errParams + '缺失')
  }
}



let addDbMiddleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let res = validateParams(params, requiredParamsList)
  if (res.success) {
    next()
  } else {
    throw new Error('必要参数' + res.errParams + '缺失')
  }
}

module.exports = {
getListMiddleware,addDbMiddleware
}
