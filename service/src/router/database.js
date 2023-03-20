
const Router = require('koa-router')
const router = new Router({ prefix: '/database'})
  
const { getList,addDb,updateDb,removeDb,getAllFieldRelation,downloadDb,downloadDbZip,fuzzyQueryDb } = require('../controller/database.controller.js')
const { getListMiddleware,addDbMiddleware,updateDbMiddleware,removeDbMiddleware,getAllFieldRelationMiddleware,downloadDbMiddleware,downloadDbZipMiddleware,fuzzyQueryDbMiddleware } = require('../middleware/database.middleware.js')

  
//获取数据库列表
router.post('/list',getListMiddleware,getList)


//新建数据库
router.post('/add',addDbMiddleware,addDb)


//更新数据库
router.post('/update',updateDbMiddleware,updateDb)


//移除数据库
router.post('/remove',removeDbMiddleware,removeDb)


//获取数据库字段所有关系
router.post('/field-relation',getAllFieldRelationMiddleware,getAllFieldRelation)


//生成并下载数据库
router.post('/download',downloadDbMiddleware,downloadDb)


//下载node初始化数据库的数据库表模型文件
router.post('/download-zip',downloadDbZipMiddleware,downloadDbZip)


//模糊查询
router.post('/fuzzy-query',fuzzyQueryDbMiddleware,fuzzyQueryDb)

module.exports = router 
