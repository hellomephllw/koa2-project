/**模块名称*/
let moduleName = {
    getLongTailModuleName(key) {
        return `longTail.${key}`;
    },
};

/**注册redis key*/
module.exports = {
    //testString
    longTailTestString: moduleName.getLongTailModuleName('testString'),
};