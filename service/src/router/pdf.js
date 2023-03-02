const Router = require('koa-router');
const { download } = require("../controller/pdf.controller")

const router = new Router({ prefix: '/pdf' });
//生成pdf文件
router.post('/download', download);

module.exports = router;