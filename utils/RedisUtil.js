/**redis string*/
let string = {
    /**
     * 存入字符串
     * @param key 字符串的key
     * @param val 字符串值
     * @param expire 过期时间(单位:秒)，可不传入，使用默认时间
     */
    setString(key, val, expire) {
        if (!expire) expire = this.expireDefault;
        redisStore.client.setex(key, expire, val);
    },
    /**
     * 获取字符串
     * @param key 字符串的key
     */
    getString(key) {
        return redisStore.client.get(key);
    },
    removeString() {

    },
};

/**redis hash*/
let object = {
    setObject(key, Object) {

    },
    getObject(key) {

    },
    removeObject(key) {

    },
    setField(key, field, val, expire) {
        redisStore.client.hset(key, field, val);
        redisStore.client.expire(key, expire);
    },
    getField(key, field) {
        return redisStore.client.hget(key, field);
    },
    removeField(key, field) {
        redisStore.client.hdel(key, field);
    },
    hasField(key, field) {

    },
    getFieldNames(key) {

    },
};

/**redis list*/
let list = {
    setList() {

    },
    getList() {

    },
    removeList() {

    },
    getLength() {

    },
    push() {

    },
    pop() {

    },
    shift() {

    },
    slice() {

    },
    removeByIndex() {

    },
    getByIndex() {

    },
};

/**redis set*/
let set = {
    setSet() {

    },
    getSet() {

    },
    removeSet() {

    },
    getLength() {

    },
    add() {

    },
    remove() {

    },
    hasObject() {

    },
};

/**redis sort set*/
let sortSet = {
    addSortSet() {

    },
    getSortSet() {

    },
    removeSortSet() {

    },
    getLength() {

    },
    add() {

    },
    remove() {

    },
};

/**默认属性*/
let defaultFields = {
    /**默认过期时间*/
    // expireDefault: 60 * 60 * 24,
    expireDefault: 10,
};

module.exports = {
    ...defaultFields,
    string,
    object,
    list,
    set,
    sortSet,
};