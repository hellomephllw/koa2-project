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

router.get('/session/count', ctx => {
    if (ctx.session.count) {
        ctx.session.count++;
    } else {
        ctx.session.count = 1;
    }

    ctx.body = ctx.session.count;
});