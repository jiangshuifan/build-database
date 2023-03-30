
const Router = require('koa-router')
const router = new Router({ prefix: '/table'})
  
const { getList,getListByName,addTb,updateTb,removeTb,getTableTree,fuzzyQueryTb } = require('../controller/table.controller.js')
const { getListMiddleware,getListByNameMiddleware,addTbMiddleware,updateTbMiddleware,removeTbMiddleware,getTableTreeMiddleware,fuzzyQueryTbMiddleware } = require('../middleware/table.middleware.js')

  
//获取表格列表
router.post('/list',getListMiddleware,getList)


//获取表格列表通过数据库名称
router.post('/list-byname',getListByNameMiddleware,getListByName)


//新建数据库表
router.post('/add',addTbMiddleware,addTb)


//更新数据库表
router.post('/update',updateTbMiddleware,updateTb)


//移除数据库表
router.post('/remove',removeTbMiddleware,removeTb)


//表格+字段树结构
router.post('/tree',getTableTreeMiddleware,getTableTree)


//模糊查询表格
router.post('/fuzzy-query',fuzzyQueryTbMiddleware,fuzzyQueryTb)

module.exports = router 
