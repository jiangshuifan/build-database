
const Router = require('koa-router')
const router = new Router({ prefix: '/field'})
  
const { getList,addField,updateField,removeField } = require('../controller/field.controller.js')
const { getListMiddleware,addFieldMiddleware,updateFieldMiddleware,removeFieldMiddleware } = require('../middleware/field.middleware.js')

  
//获取字段
router.post('/list',getListMiddleware,getList)


//新建字段
router.post('/add',addFieldMiddleware,addField)


//更新字段
router.post('/update',updateFieldMiddleware,updateField)


//移除字段
router.post('/remove',removeFieldMiddleware,removeField)

module.exports = router 
