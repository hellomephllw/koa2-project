const Koa = require('koa');
const app = new Koa();
const KoaBody = require('koa-body');
global.router = require('./utils/Router');

/**
 * 信任往前第一个代理：可以正确取出客户端ip
 */
app.set('trust proxy', 1);
/**
 * application/x-www-urlencoded
 * multipart/form-data
 * application/json
 * file uploads
 */
app.use(KoaBody());
/**路由*/
app.use(router.routes());
app.use(router.allowedMethods());
/**加载所有路由*/
require('./routes');

/**开启服务*/
app.listen(3601);
console.log('小游戏api的服务在3601端口开启！');