module.exports = function (IO, app) {
    /**加载所有路由*/
    require('./TestRouter');
    require('./websocket/LongTailSocket')(IO, app);
};