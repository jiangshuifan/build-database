
const Router = require('koa-router')
const router = new Router({ prefix: '/database'})
  
const { getList,addDb,updateDb,removeDb } = require('../controller/database.controller.js')
const { getListMiddleware,addDbMiddleware,updateDbMiddleware,removeDbMiddleware } = require('../middleware/database.middleware.js')

  
//获取数据库列表
router.post('/list',getListMiddleware,getList)


//新建数据库
router.post('/add',addDbMiddleware,addDb)


//更新数据库
router.post('/update',updateDbMiddleware,updateDb)


//移除数据库
router.post('/remove',removeDbMiddleware,removeDb)

module.exports = router 
