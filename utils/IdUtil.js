module.exports = {
    /**uuid*/
    getUUID() {
        let len = 32;//32长度
        let radix = 16;//16进制
        let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        let uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            let r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    /**用时间戳生成的id*/
    getTimestampId() {
        return new Date().getTime() + '';
    },
    /**用Math.random()生成的10位数id*/
    getRandomNumId() {
        return parseInt(Math.random() * 10000000000) + '';
    },
    /**timestamp-uuid格式的id*/
    getTimestampWithUUID() {
        return this.getTimestampId() + '-' + this.getUUID();
    },
};