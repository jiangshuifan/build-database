const Router = require('koa-router');
const { handleFieldTypes } = require("../controller/dic.controller")

const router = new Router({ prefix: '/dic' });

router.post('/field-types', handleFieldTypes);

module.exports = router;