const BusinessError = require('./BusinessError');

module.exports = function() {
    return async (ctx, next) => {
        let tmr = null;
        const timeout = 5000;//设置超时时间
        await Promise.race([
            new Promise(function(resolve, reject) {
                tmr = setTimeout(function() {
                    let e = new Error(BusinessError.businessTimeoutError.errorType);
                    reject(e);
                }, timeout);
            }),
            new Promise(function(resolve, reject) {
                //使用一个闭包来执行下面的中间件
                (async function() {
                    await next();
                    clearTimeout(tmr);
                    resolve();
                })();
            })
        ])
    };
};