
const Router = require('koa-router')
const router = new Router({ prefix: '/table'})
  
const { getList,addTb,updateTb,removeTb } = require('../controller/table.controller.js')
const { getListMiddleware,addTbMiddleware,updateTbMiddleware,removeTbMiddleware } = require('../middleware/table.middleware.js')

  
//获取表格列表
router.post('/list',getListMiddleware,getList)


//新建数据库表
router.post('/add',addTbMiddleware,addTb)


//更新数据库表
router.post('/update',updateTbMiddleware,updateTb)


//移除数据库表
router.post('/remove',removeTbMiddleware,removeTb)

module.exports = router 
