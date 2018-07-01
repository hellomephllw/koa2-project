class Token {
    constructor(key, openId, nickname) {
        this.key = key;
        this.openId = openId;
        this.nickname = nickname;
        this.auth = '';
    }
}

module.exports = Token;