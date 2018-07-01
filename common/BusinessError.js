const responseResult = require('./response/responseResult');

module.exports = {
    /**token失效*/
    tokenExpireError: {
        errorType: '0001',
        msg: 'token失效',
    },
    /**业务执行超时*/
    businessTimeoutError: {
        errorType: '0002',
        msg: '业务执行超时',
    },
    /**所有错误*/
    errorTypes: [],
    /**初始化*/
    init() {
        for (let field in this) {
            if (/Error$/.test(field)) {
                this.errorTypes.push(this[field]);
            }
        }
        return async (ctx, next) => {
            try {
                await next();
            } catch (e) {
                let error = this.errorTypes.find(type => type.errorType === e.message);
                if (error) {
                    let result = responseResult.fail();
                    result.msg = error.msg;
                    ctx.response.body = result;
                }
            }
        }
    },
};