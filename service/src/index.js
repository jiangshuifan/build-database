const { PORT } = require('../config');
const Koa = require('koa');
const path = require('path')
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const staticResource = require("koa-static")
const app = new Koa();

app.use(staticResource(path.resolve(__dirname, "../public")));
app.use(cors());
app.use(KoaBody());


// 路由配置
const router = require('./router');
app.use(router.routes()).use(router.allowedMethods());
//出错时
app.on('error', (err, ctx) => {
  ctx.status = 500;
  ctx.body = {
    success: false,
    data: {
      message: err
    }
  };
});
//监听端口
app.listen(PORT, () => {
  console.log('server is running on http://localhost:' + PORT);
});
