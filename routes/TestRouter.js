const TokenUtil = require('../utils/TokenUtil');
const IDUtil = require('../utils/IdUtil');

router.get('/', async ctx => {
    console.log(ctx.query);
    ctx.response.body = ctx.query;
});

router.post('/', ctx => {
    console.log(ctx.request.body);
    ctx.response.body = ctx.request.body;
});

router.get('/db', async ctx => {
    let result = await db('select * from Test');
    console.log(result);
    ctx.response.body = result;
});

router.get('/tran', async ctx => {
    ctx.response.body = await tran(async conn => {
        let tests = await db('select * from Test', [], conn);

        console.log(tests);

        return tests;
    });
});

router.post('/login', async ctx => {
    //获取tokenKey
    let tokenKey = TokenUtil.getTokenKeyFromParams(ctx.request);
    //没有tokenKey或过期，生成新token
    if (!tokenKey || await TokenUtil.alreadyExpire(tokenKey)) {
        tokenKey = TokenUtil.createToken(IDUtil.getRandomNumId(), 'tom');
    } else {//有tokenKey并没过期，刷新时间
        TokenUtil.refresh(tokenKey);
    }

    ctx.response.body = {
        token: tokenKey
    };
});

router.post('/session/count', async ctx => {
    let count = await Session.get('count');
    let openId = await Session.get('openId');

    console.log(count, openId);
    console.log(await Session.getSession());

    if (!count) {
        count = 1;
        await Session.set('count', 1);
    } else {
        await Session.set('count', ++count);
    }

    ctx.response.body = {
        count,
        openId,
    }
});