
const Router = require('koa-router')
const router = new Router({ prefix: '/table'})
  
const { getList,addDb } = require('../controller/table.controller.js')
const { getListMiddleware,addDbMiddleware } = require('../middleware/table.controller.js')

  
//获取数据库列表
router.post('/getList',getListMiddleware,getList)


//新建数据库
router.post('/addDb',addDbMiddleware,addDb)

module.exports = router 
