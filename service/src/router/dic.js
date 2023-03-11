const Router = require('koa-router');
const { handleFieldTypes, handleTableAndFieldDic, handleSupportedDBType } = require("../controller/dic.controller")

const router = new Router({ prefix: '/dic' });
//类型
router.post('/field-types', handleFieldTypes);

//除当前表格外的表格-字段数据，用来设置外键
router.post('/table-fields', handleTableAndFieldDic);

//支持的数据库类型
router.post('/database-types', handleSupportedDBType);

module.exports = router;