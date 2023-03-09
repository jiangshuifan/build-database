const Router = require('koa-router');
const { handleFieldTypes, handleTableAndFieldDic } = require("../controller/dic.controller")

const router = new Router({ prefix: '/dic' });
//类型
router.post('/field-types', handleFieldTypes);

//除当前表格外的表格-字段数据，用来设置外键
router.post('/table-fields', handleTableAndFieldDic);

module.exports = router;