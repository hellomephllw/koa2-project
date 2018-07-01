const Token = require('../common/Token');
const MD5Util = require('../utils/Md5Util');
const IDUtil = require('../utils/IdUtil');
const TokenUtil = require('../utils/TokenUtil');
const RedisUtil = require('../utils/RedisUtil');
const BusinessError = require('./BusinessError');

module.exports = {
    /**key的前缀*/
    prefix: 'game-session-',
    /**过期时间(单位:秒)*/
    maxAge: 60 * 20,
    request: null,
    response: null,
    /**初始化session*/
    init() {
        return async (ctx, next) => {
            this.request = ctx.request;
            this.response = ctx.response;
            await next();
        };
    },
    /**
     * 在session中存放键值对
     * @param field 属性名称
     * @param val 属性值
     */
    set: async function (field, val) {
        let token = await this._getToken();
        this._setTokenFieldAndVal(token.key, field, val);
    },
    /**
     * 根据属性名称获取属性值
     * @param field 属性名称
     * @return {Promise}属性值
     */
    get: async function (field) {
        let token = await this._getToken();

        return this._getTokenVal(token.key, field);
    },
    /**
     * 更新session过期时间
     * @param second
     */
    refresh: async function (second) {
        if (second === undefined || second === null) {
            second = this.maxAge;
        }
        let token = await this._getToken();

        RedisUtil.object.expire(token.key, second);
    },
    /**
     * 更新过期时间
     * @param key token的key
     * @private
     */
    _refresh: async function (key) {
        RedisUtil.object.expire(key, this.maxAge);
    },
    /**
     * 创建session
     * @param openId
     * @param nickname
     * @return {string}token的key
     */
    create(openId, nickname) {
        let key = this.prefix + MD5Util.encode(IDUtil.getTimestampWithUUID());

        let token = new Token(key, openId, nickname);

        RedisUtil.object.setObject(key, token, this.maxAge);

        return token.key;
    },
    /**
     * 获取token
     * @return {Promise}token
     * @private
     */
    _getToken: async function () {
        let token = await TokenUtil.getTokenByRequest(this.request);
        if (token === null) {
            throw new Error(BusinessError.tokenExpireError.errorType);
        }
        this._refresh(token.key);

        return token;
    },
    /**
     * 存入键值对
     * @param key token的key
     * @param field 属性名称
     * @param val 属性值
     * @private
     */
    _setTokenFieldAndVal(key, field, val) {
        RedisUtil.object.setField(key, field, val);
    },
    /**
     * 获取值
     * @param key token的key
     * @param field 属性名称
     * @return {Promise}token的属性值
     * @private
     */
    _getTokenVal(key, field) {
        return RedisUtil.object.getFieldVal(key, field);
    },
    /**
     * 获取存入Session的Token对象
     * @return {Promise}
     */
    getSession: async function() {
        let token = await this._getToken();

        return RedisUtil.object.getObject(token.key);
    }
};