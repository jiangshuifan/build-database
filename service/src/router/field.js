
const Router = require('koa-router')
const router = new Router({ prefix: '/field'})
  
const { getList,addDb } = require('../controller/field.controller.js')
const { getListMiddleware,addDbMiddleware } = require('../middleware/field.controller.js')

  
//获取数据库列表
router.post('/getList',getListMiddleware,getList)


//新建数据库
router.post('/addDb',addDbMiddleware,addDb)

module.exports = router 
