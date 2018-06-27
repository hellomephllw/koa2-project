const mysql = require('mysql');
const responseResult = require('../common/response/responseResult');//返回结果的json结构

/**数据库链接池*/
let pool;

/**初始化*/
function init() {
    //初始化数据库连接
    pool = mysql.createPool({
        host     : '127.0.0.1',
        user     : 'root',
        password : 'password',
        database : 'zhxj_game'
    });
    //方便访问
    global.db = execute;
    global.tran = transaction;
}

/**执行sql*/
function execute(sql, params) {
    const successJson = responseResult.success();
    const failJson = responseResult.fail();
    return new Promise(resolve => {
        //获取连接
        pool.getConnection(function(err, conn) {
            if (err) {
                failJson.msg = err.sqlMessage;
                resolve(failJson);
                //释放连接
                conn.release();
            } else {
                //执行sql
                conn.query(sql, params, function(err, rows) {
                    if (err) {
                        failJson.msg = err.sqlMessage;
                        resolve(failJson);
                    } else {
                        if (rows.message) rows = rows.message;
                        successJson.msg = rows;
                        resolve(successJson);
                    }

                    //释放连接
                    conn.release();
                });
            }
        });
    });
}

/**事务*/
function transaction() {

}

module.exports = {
    init
};