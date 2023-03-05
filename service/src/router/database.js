const Router = require('koa-router');
const { handleGetDatabaseList, handleAddNewDatabase } = require("../controller/database.controller")

const router = new Router({ prefix: '/database' });

router.post('/list', handleGetDatabaseList);
router.post('/add', handleAddNewDatabase);

module.exports = router;