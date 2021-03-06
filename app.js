const Koa = require('koa');
const app = new Koa();
const KoaBody = require('koa-body');
const IO = require('koa-socket-2');
const database = require('./utils/Database');
const CorsHeader = require('./common/response/CorsHeader');
const BusinessError = require('./common/BusinessError');
const BusinessTimeout = require('./common/BusinessTimeout');
global.Session = require('./common/Session');
global.redisStore = require('koa-redis')();
global.router = require('./utils/Router');
global.WSHelper = require('./utils/WSHelper');

/**错误处理*/
app.use(BusinessError.init());
/**超时处理*/
app.use(BusinessTimeout());
/**CORS处理*/
app.use(CorsHeader());
/**初始化session*/
app.use(Session.init());
/**application/x-www-urlencoded、multipart/form-data、application/json、file uploads*/
app.use(KoaBody());
/**初始化数据库连接*/
database.init();
/**支持X-Forwarded-Proto*/
app.proxy = true;
/**路由*/
app.use(router.routes());
app.use(router.allowedMethods());
/**加载所有路由*/
require('./routes')(IO, app);

/**开启服务*/
app.listen(3601);
console.log('小游戏api的服务在3601端口开启！');