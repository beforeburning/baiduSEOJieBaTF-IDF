/**
 User: burning <923398776@qq.com>
 Date: 2018年07月13日
 */

const mysql = require('mysql');

let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '5201314',
    database: 'burning'
});

function sql (e, callback) {
    // //插入sql
    let sqlD = ``;
    e.forEach(function (val) {
        sqlD += `('${val.val}', ${val.idf}, '${val.frequency}'),`
    });
    let sql = `INSERT INTO jieba (val,idf,frequency) VALUES ${sqlD}`,
        s = sql.substring(0, sql.length - 1);
    connection.query(s, (err) => {
        if (err) throw err;
        callback();
    });
}

module.exports.sql = sql;