const RedisUtil = require('./RedisUtil');

module.exports = {
    /**
     * 从请求头中获取token的key
     * @param request 请求
     * @return token的key
     */
    getTokenKeyFromHeader(request) {
        return request.get('token');
    },
    /**
     * 根据key获取token对象
     * @param key token的key
     * @return Promise(token对象)
     */
    getTokenByKey(key) {
        return RedisUtil.object.getObject(key);
    },
    /**
     * 根据request获取token对象
     * @param request 请求
     * @return Promise(token对象)
     */
    getTokenByRequest(request) {
        let key = this.getTokenKeyFromHeader(request);
        return RedisUtil.object.getObject(key);
    },
    /**
     * 创建新的token，并返回token的key
     * @param openId 应用openId
     * @param nickname 昵称
     * @return {*}Token的key
     */
    createToken(openId, nickname) {
        return Session.create(openId, nickname);
    },
    /**
     * token已经过期
     * @param key token的key
     * @return Promise(bool)
     */
    alreadyExpire: async function (key) {
        return !(await RedisUtil.object.hasObject(key));
    },
    /**
     * 刷新token时间
     * @param key token的key
     * @param second 存在时间，如为空则使用默认时间
     */
    refresh(key, second) {
        if (second === undefined || second === null) second = Session.maxAge;
        RedisUtil.object.expire(key, second);
    },
};