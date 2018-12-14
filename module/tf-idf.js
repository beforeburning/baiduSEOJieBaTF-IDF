/**
 User: burning <923398776@qq.com>
 Date: 2018年07月13日
 */

const nodejieba = require('nodejieba'),
    sql = require('./sql');

function tf (txt) {
    console.log(txt);
    let res = [];
    txt.forEach((val) => {
        let len = txt.length;
        let idf = nodejieba.extract(val[0], 1);
        if (idf == ''){
            return false
        } else {
            let tfIdf = `${val[1] * idf[0].weight / len}`
            let arr = {
                val: val[0],
                idf: tfIdf,
                frequency: val[1]
            };
            res.push(arr);
        }
    });
    sql.sql(res, () => {
        console.log('计算结束 入库成功');
    });
}

module.exports.tf = tf;