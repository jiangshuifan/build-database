
const Router = require('koa-router')
const router = new Router({ prefix: '/data'})
  
const { getList,addDb } = require('../controller/data.controller.js')
const { getListMiddleware,addDbMiddleware } = require('../middleware/data.middleware.js')

  
//获取数据库列表
router.post('/list',getListMiddleware,getList)


//新建数据库
router.post('/add',addDbMiddleware,addDb)

module.exports = router 
