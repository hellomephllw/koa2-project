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
function execute(sql, params, tranConn) {
    const successJson = responseResult.success();
    const failJson = responseResult.fail();
    return new Promise(resolve => {
        if (tranConn) {//事务连接
            tranConn.query(sql, params, (err, rows) => {
                if (err) {
                    failJson.msg = err.sqlMessage;
                    resolve(failJson);
                    tranConn.rollback(function (err) {
                        console.error('事物回滚发生错误，' + err);
                        tranConn.release();
                    });
                } else {
                    if (rows.message) rows = rows.message;
                    successJson.msg = rows;
                    resolve(successJson);
                }
            });
        } else {//非事务连接
            //获取连接
            pool.getConnection((err, conn) => {
                if (err) {
                    failJson.msg = err.sqlMessage;
                    resolve(failJson);
                    //释放连接
                    conn.release();
                } else {
                    //执行sql
                    conn.query(sql, params, (err, rows) => {
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
        }
    });
}

/**事务*/
function transaction(callback) {
    const successJson = responseResult.success();
    const failJson = responseResult.fail();
    //获取连接
    return new Promise(resolve => {
        pool.getConnection((err, conn) => {
            if (err) {
                failJson.msg = err.sqlMessage;
                resolve(failJson);
                //释放连接
                conn.release();
            } else {
                //打开事务
                conn.beginTransaction(async err => {
                    if (err) {
                        failJson.msg = err.sqlMessage;
                        resolve(failJson);
                        //回滚
                        rollback();
                    } else {
                        //返回连接给回调
                        let result = await callback(conn);
                        if (result.code === undefined || result.code === null) {
                            successJson.msg = result;
                            result = successJson;
                        }
                        //执行完毕后提交
                        commit();
                        //结束promise
                        resolve(result);
                    }

                    /**提交函数*/
                    function commit() {
                        conn.commit(err => {
                            if (err) {
                                console.error('执行事务失败，' + err);
                                rollback();
                            } else {
                                conn.release();
                            }
                        });
                    }
                    /**回滚*/
                    function rollback() {
                        conn.rollback(err => {
                            console.error('事物回滚发生错误，' + err);
                            conn.release();
                        });
                    }
                });
            }
        });
    });
}

module.exports = {
    init
};