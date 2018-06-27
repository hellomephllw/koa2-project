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