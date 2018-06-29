/**redis string*/
let string = {
    /**分类名称*/
    keyCategory(key) {
        return `string.${key}`;
    },
    /**
     * 存入字符串
     * @param key 字符串key
     * @param val 字符串值
     * @param expire 过期时间(单位:秒)，如果不填，则没有过期时间，如果为-1，则使用默认时间
     */
    setString(key, val, expire) {
        redisStore.client.set(this.keyCategory(key), val);
        this.expire(key, expire);
    },
    /**
     * 获取字符串
     * @param key 字符串key
     * @return 字符串
     */
    getString(key) {
        return redisStore.client.get(this.keyCategory(key));
    },
    /**
     * 删除字符串
     * @param key 字符串key
     */
    removeString(key) {
        redisStore.client.del(this.keyCategory(key));
    },
    /**
     * 是否有string
     * @param key
     * @return bool
     */
    hasString: async function(key) {
        return (await redisStore.client.exists(this.keyCategory(key))) === 1;
    },
    /**
     * 更新过期时间
     * @param key 需要更新的key
     * @param expire 过期时间(单位:秒)，如果为-1，则使用默认时间
     */
    expire(key, expire) {
        if (expire !== null && expire !== undefined) {
            if (expire === -1) {
                expire = defaultFields.expireDefault;
            }
            redisStore.client.expire(this.keyCategory(key), expire);
        }
    },
};

/**redis hash*/
let object = {
    /**分类名称*/
    keyCategory(key) {
        return `object.${key}`;
    },
    /**
     * 存入对象
     * @param key 对象key
     * @param object 对象
     * @param expire 过期时间(单位:秒)，如果不填，则没有过期时间，如果为-1，则使用默认时间
     */
    setObject(key, object, expire) {
        for (let fieldName in object) {
            this.setField(key, fieldName, object[fieldName], expire);
        }
        this.expire(key, expire);
    },
    /**
     * 根据对象key获取对象
     * @param key 对象key
     * @return {Object}对象key对应的对象
     */
    getObject: async function(key) {
        let obj = {};
        let finalKey = this.keyCategory(key);
        let keys = await redisStore.client.hkeys(finalKey);

        for (let i = 0, len = keys.length; i < len; ++i) {
            let field = keys[i];
            obj[field] = await redisStore.client.hget(finalKey, field);
        }

        return keys.length === 0 ? null : obj;
    },
    /**
     * 根据对象key删除对象
     * @param key 对象key
     */
    removeObject(key) {
        redisStore.client.del(this.keyCategory(key));
    },
    /**
     * 为对象key存入属性键值对
     * @param key 对象key
     * @param field 对象属性名称
     * @param val 对象属性值
     */
    setField(key, field, val) {
        redisStore.client.hset(this.keyCategory(key), field, val);
    },
    /**
     * 根据对象key和属性名称获取属性值
     * @param key 对象key
     * @param field 属性名称
     * @return 属性值
     */
    getFieldVal(key, field) {
        return redisStore.client.hget(this.keyCategory(key), field);
    },
    /**
     * 根据对象key和属性名称删除属性
     * @param key 对象key
     * @param field 属性名称
     */
    removeField(key, field) {
        redisStore.client.hdel(this.keyCategory(key), field);
    },
    /**
     * 是否存在该对象
     * @param key 对象对应的key
     * @return bool
     */
    hasObject: async function(key) {
        return (await redisStore.client.exists(this.keyCategory(key))) === 1;
    },
    /**
     * 对象是否存在该属性
     * @param key key对象
     * @param field 对象属性名称
     * @return bool
     */
    hasField: async function(key, field) {
        return (await redisStore.client.hexists(this.keyCategory(key), field)) === 1;
    },
    /**
     * 获取改对象所有
     * @param key
     * @return {*}
     */
    getFieldNames(key) {
        return redisStore.client.hkeys(this.keyCategory(key));
    },
    /**
     * 更新过期时间
     * @param key 需要更新的key
     * @param expire 过期时间(单位:秒)，如果为-1，则使用默认时间
     */
    expire(key, expire) {
        if (expire !== null && expire !== undefined) {
            if (expire === -1) {
                expire = defaultFields.expireDefault;
            }
            redisStore.client.expire(this.keyCategory(key), expire);
        }
    },
};

/**redis list*/
let list = {
    /**分类名称*/
    keyCategory(key) {
        return `list.${key}`;
    },
    /**
     * 存入list
     * @param key list的key
     * @param list 队列
     * @param expire 过期时间(单位:秒)，如果不填，则没有过期时间，如果为-1，则使用默认时间
     */
    setList(key, list, expire) {
        if (list instanceof Array) {
            list.map(val => redisStore.client.rpush(this.keyCategory(key), val));
            this.expire(key, expire);
        }
    },
    /**
     * 获取list
     * @param key list的key
     */
    getList: async function(key) {
        let finalKey = this.keyCategory(key);
        let len = await redisStore.client.llen(finalKey);

        return len === 0 ? null : redisStore.client.lrange(finalKey, 0, len - 1);
    },
    /**
     * 删除list
     * @param key list的key
     */
    removeList(key) {
        redisStore.client.del(this.keyCategory(key));
    },
    /**
     * 获取list长度
     * @param key list的key
     */
    getLength(key) {
        redisStore.client.llen(this.keyCategory(key));
    },
    /**
     * 添加一个值在末尾
     * @param key list的key
     * @param val 值
     */
    push(key, val) {
        redisStore.client.rpush(this.keyCategory(key), val);
    },
    /**
     * 在数组头部添加一个值
     * @param key list的key
     * @param val 值
     */
    unshift(key, val) {
        redisStore.client.lpush(this.keyCategory(key), val);
    },
    /**
     * 删除并返回最后一个值
     * @param key list的key
     * @return 最后一个值
     */
    pop(key) {
        return redisStore.client.rpop(this.keyCategory(key));
    },
    /**
     * 删除并返回第一个值
     * @param key list的key
     * @return 第一个值
     */
    shift(key) {
        return redisStore.client.lpop(this.keyCategory(key));
    },
    /**
     * 剪裁list
     * @param key list的key
     * @param start 开始位置（闭区间）
     * @param stop 结束位置（闭区间）
     */
    trim(key, start, stop) {
        redisStore.client.ltrim(this.keyCategory(key), start, stop);
    },
    /**
     * 通过索引删除值
     * @param key list的key
     * @param index 索引
     */
    removeByIndex(key, index) {
        let tempStr = '__delete__';
        redisStore.client.lset(this.keyCategory(key), index, tempStr);
        redisStore.client.lrem(this.keyCategory(key), 0, tempStr);
    },
    /**
     * 通过索引获取值
     * @param key list的key
     * @param index 索引
     */
    getByIndex(key, index) {
        return redisStore.client.lindex(this.keyCategory(key), index);
    },
    /**
     * 是否存在该list
     * @param key list的key
     */
    hasList: async function(key) {
        return (await redisStore.client.exists(this.keyCategory(key))) === 1;
    },
    /**
     * 更新过期时间
     * @param key 需要更新的key
     * @param expire 过期时间(单位:秒)，如果为-1，则使用默认时间
     */
    expire(key, expire) {
        if (expire !== null && expire !== undefined) {
            if (expire === -1) {
                expire = defaultFields.expireDefault;
            }
            redisStore.client.expire(this.keyCategory(key), expire);
        }
    },
};

/**redis set*/
let set = {
    /**分类名称*/
    keyCategory(key) {
        return `set.${key}`;
    },
    /**
     * 添加set
     * @param key set的key
     * @param arr 添加的数组
     * @param expire 过期时间(单位:秒)，如果不填，则没有过期时间，如果为-1，则使用默认时间
     */
    setSet(key, arr, expire) {
        if (arr instanceof Array) {
            arr.map(val => redisStore.client.sadd(this.keyCategory(key), val));
            this.expire(key, expire);
        }
    },
    /**
     * 获取set
     * @param key set的key
     * @return set集合
     */
    getSet: async function(key) {
        let finalKey = this.keyCategory(key);
        let len = await redisStore.client.scard(finalKey);

        return len === 0 ? null : redisStore.client.smembers(finalKey);
    },
    /**
     * 删除set
     * @param key set的key
     */
    removeSet(key) {
        redisStore.client.del(this.keyCategory(key));
    },
    /**
     * 获取set长度
     * @param key
     * @return {*}
     */
    getLength(key) {
        return redisStore.client.scard(this.keyCategory(key));
    },
    /**
     * 添加值
     * @param key set的key
     * @param val 值
     */
    add(key, val) {
        redisStore.client.sadd(this.keyCategory(key), val);
    },
    /**
     * 移除值
     * @param key set的key
     * @param val 值
     */
    remove(key, val) {
        redisStore.client.srem(this.keyCategory(key), val);
    },
    /**
     * 是否有该set
     * @param key set的key
     * @return bool
     */
    hasSet: async function(key) {
        return (await redisStore.client.exists(this.keyCategory(key))) === 1;
    },
    /**
     * 更新过期时间
     * @param key 需要更新的key
     * @param expire 过期时间(单位:秒)，如果为-1，则使用默认时间
     */
    expire(key, expire) {
        if (expire !== null && expire !== undefined) {
            if (expire === -1) {
                expire = defaultFields.expireDefault;
            }
            redisStore.client.expire(this.keyCategory(key), expire);
        }
    },
};

/**redis sort set*/
let sortSet = {
    /**分类名称*/
    keyCategory(key) {
        return `sortSet.${key}`;
    },
    addSortSet() {
        //todo
    },
    getSortSet() {
        //todo
    },
    removeSortSet() {
        //todo
    },
    /**
     * 获取sortSet的长度
     * @param key sortSet的key
     */
    getLength(key) {
        redisStore.client.ZCARD(this.keyCategory(key));
    },
    add() {
        //todo
    },
    remove() {
        //todo
    },
    hasSortSet() {
        //todo
    },
    /**
     * 更新过期时间
     * @param key 需要更新的key
     * @param expire 过期时间(单位:秒)，如果为-1，则使用默认时间
     */
    expire(key, expire) {
        if (expire !== null && expire !== undefined) {
            if (expire === -1) {
                expire = defaultFields.expireDefault;
            }
            redisStore.client.expire(this.keyCategory(key), expire);
        }
    },
};

/**默认属性*/
let defaultFields = {
    /**默认过期时间*/
    expireDefault: 60 * 60 * 24,
};

module.exports = {
    string,
    object,
    list,
    set,
    sortSet,
};