module.exports = IOHelper('/longTail')(io => {
    io.on('my other event', async (ctx, data) => {
        console.log(data);
        ctx.socket.emit('news', { hello: 'world' });
        ctx.socket.broadcast.emit('news', { info: 'longTail' });
    });

    io.on('connection', (ctx, data) => {
        console.log('conn', new Date().getTime());
        console.log(data);
    });

    io.on('disconnect', (ctx, data) => {
        console.log('disconn', new Date().getTime());
        console.log(data);
    });
});