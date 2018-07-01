const Koa = require('koa');
const app = new Koa();
const KoaBody = require('koa-body');
const database = require('./utils/Database');
const CorsHeader = require('./common/response/CorsHeader');
global.Session = require('./common/Session');
global.redisStore = require('koa-redis')();
global.router = require('./utils/Router');

const IO = require('koa-socket-2');
const io = new IO();
io.attach(app);

/**CORS处理*/
app.use(CorsHeader());
/**错误处理*/
app.use(async (ctx, next) => {
    console.log('=====');
    try {
        await next();
    } catch (e) {
        if (e.message === '110') {//token过期
            ctx.response.body = {
                msg: 'token已过期',
            };
        }
    }
});
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
require('./routes');



io.on('my other event', (ctx, data) => {
    ctx.socket.emit('news', { hello: 'world' });
});

io.on('connection', (ctx, data) => {
    console.log('conn', new Date().getTime());
    console.log(data);
});

io.on('disconnect', (ctx, data) => {
    console.log('disconn', new Date().getTime());
    console.log(data);
});

/**开启服务*/
app.listen(3601);
console.log('小游戏api的服务在3601端口开启！');