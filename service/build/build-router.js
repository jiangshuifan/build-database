const fs = require('fs');
const path = require('path');
const render = require('json-templater/string');
let endOfLine = require('os').EOL;

let API_PUBLIC_PATH = '../controller';
let API_JSON_PATH = path.join(__dirname, '../src/apis');
let API_Middleware_PATH = "../middleware"
//l俩输出路径

let Out_Middleware_PATH = path.join(__dirname, "../src/middleware");
let OUT_PUT_PATH = path.join(__dirname, "../src/router");
let fileList = fs.readdirSync(API_JSON_PATH);

const MIDDLEWARE_TEMPLATE = `
{{middleware}}
module.exports = {
{{outPutMiddleware}}
}
`;
const MIDDLEWARE_METHOD = `

let {{api}}Middleware =async (ctx,next) =>{
  let params = ctx.request.body;
  let res = validateParams(params, requiredParamsList)
  if (res.success) {
    next()
  } else {
    throw new Error('必要参数' + res.errParams + '缺失')
  }
}
`;

const IMPORT_TEMPLATE = `
const { {{methods}} } = require('${API_PUBLIC_PATH}/{{apiFile}}')
const { {{middleware}} } = require('${API_Middleware_PATH}/{{apiFile}}')
`;
const ROUTER_Template = `
const Router = require('koa-router')
const router = new Router({ prefix: '/{{prefixName}}'})
  {{import}}
  {{include}}
module.exports = router 
`;
const ROUTE_TEMPLATE = `
//{{annotation}}
router.post('/{{routeName}}',{{middleware}},{{routeName}})
`;

for (let file of fileList) {
  let fileName = file.split('.')[0];
  let routeTemplate = [];
  let methodsTemplate = [];
  let middlewareList = [];
  let middlewareTemplate = [];

  middlewareTemplate.push('const {validateParams} =require("../utils/validate")')

  let routeList = JSON.parse(
    fs.readFileSync(path.join(API_JSON_PATH + '\\' + file))
  );
  //路由列表循环
  for (let route of routeList) {
    let paramsList = route['requiredParams'];
    let currentRoute = render(ROUTE_TEMPLATE, {
      annotation: route['desc'],
      routeName: route['api'],
      middleware: route['api'] + 'Middleware',
    });
    let currentMiddleware = render(MIDDLEWARE_METHOD, {
      api: route['api'].toString(),
      requiredParams: JSON.stringify(paramsList),
    });
    routeTemplate.push(currentRoute);
    methodsTemplate.push(route['api']);
    middlewareList.push(route['api'] + 'Middleware');
    middlewareTemplate.push(currentMiddleware);
  }

  //导入方法的模板渲染
  let importTemplate = render(IMPORT_TEMPLATE, {
    methods: methodsTemplate.join(',', endOfLine),
    apiFile: fileName + '.controller.js',
    middleware: middlewareList.join(',', endOfLine),
  });

  //生成路由模板，写入文件
  let template = render(ROUTER_Template, {
    prefixName: fileName,
    include: routeTemplate.join(endOfLine),
    import: importTemplate,
  });
  //中间件文件
  let middlewareFileContent = render(MIDDLEWARE_TEMPLATE, {
    middleware: middlewareTemplate.join(endOfLine),
    outPutMiddleware: middlewareList.join(',', endOfLine),
  });
  fs.writeFileSync(path.join(OUT_PUT_PATH + '\\' + fileName + '.js'), template);
  fs.writeFileSync(
    path.join(Out_Middleware_PATH, '\\' + fileName + '.middleware.js'),
    middlewareFileContent
  );
}
