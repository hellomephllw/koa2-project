const Koa = require('koa');
const app = new Koa();
const KoaBody = require('koa-body');
const database = require('./utils/Database');
global.router = require('./utils/Router');

/**
 * application/x-www-urlencoded
 * multipart/form-data
 * application/json
 * file uploads
 */
app.use(KoaBody());
/**初始化数据库连接*/
database.init();
/**支持X-Forwarded-Proto*/
app.proxy = true;
/**路由*/
app.use(router.routes());
app.use(router.allowedMethods());
/**加载所有路由*/
require('./routes');

/**开启服务*/
app.listen(3601);
console.log('小游戏api的服务在3601端口开启！');