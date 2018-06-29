let koaRedis = require('koa-redis');

global.redisStore = koaRedis();

let RedisUtil = require('./utils/RedisUtil');

let RedisNames = require('./utils/RedisNames');

async function test() {
    RedisUtil.set.setSet(RedisNames.longTailTestString, ['zhangsan', true, 123, {name: 'tom'}], -1);

    let obj = await RedisUtil.set.getSet(RedisNames.longTailTestString);

    console.log(obj);
}

test();
