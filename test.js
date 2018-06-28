let koaRedis = require('koa-redis');

let redisStore = koaRedis();


let RedisUtil = require('./utils/RedisUtil');
// console.log(RedisUtil);

async function test() {
    // redisStore.client.hset('temp', 'name', 'hahahha');
    // redisStore.client.expire('temp', 10);
    // let val = await redisStore.client.hget('temp', 'name');
    // console.log(val);

    // redisStore.client.hdel('temp', 'name');
    // console.log(await redisStore.client.hget('temp', 'name'));
    let val = await redisStore.client.sscan('myset1', 0);
    console.log(val);
    val = await redisStore.client.zrange('page_rank', 0, 1, 'WITHSCORES');
    console.log(val);
}

test();
