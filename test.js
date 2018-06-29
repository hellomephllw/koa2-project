let koaRedis = require('koa-redis');

global.redisStore = koaRedis();

let RedisUtil = require('./utils/RedisUtil');

global.RedisNames = require('./utils/RedisNames');

async function test() {
    console.log(await RedisUtil.set.hasSet(RedisNames.longTailTestString));

    RedisUtil.set.setSet(RedisNames.longTailTestString, [1, 1, 1, 5, 6, 7, 8, 9, 10, 11, 12, 13], -1);

    console.log(await RedisUtil.set.hasSet(RedisNames.longTailTestString));

    let result = await RedisUtil.set.getSet(RedisNames.longTailTestString);

    console.log(result);

    RedisUtil.set.removeSet(RedisNames.longTailTestString);

    result = await RedisUtil.set.getSet(RedisNames.longTailTestString);

    console.log(result);
}

test();
