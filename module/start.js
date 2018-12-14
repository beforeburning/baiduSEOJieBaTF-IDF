/**
 User: burning <923398776@qq.com>
 Date: 2018年07月12日
 */

// async 异步
const async = require('async'),
    //cheerio 分析网页
    cheerio = require('cheerio'),
    //superagent 抓取网页
    superagent = require('superagent'),
    //https
    https = require('https'),
    //编码
    iconv = require('iconv-lite'),
    //文件
    fs = require('fs'),
    // 词频
    frequency = require('./tf');

//修改json
function writeJson (e) {
    let data = e.shift();
    fs.writeFile('../data/data.json', data, function (err) {
        if (err){
            return console.log(err);
        }
    });
}

//数据
let arr = [],
    //一级当前
    arrcurrent = 0,
    //二级当前
    arrcurrent2 = 0,
    //临时数据
    temporary = [],
    //结果
    results = [];

function start (e) {
    let eTO = e.toString(),
        data = eTO.split(',');
    arr = data;
    // 递归请求数量
    forNext(arrcurrent);
}

module.exports.start = start;

//数组去重
function unique (arr) {
    return [...new Set(arr)];
}


//一级递归循环
function forNext (i) {
    console.log(arr);
    if (i >= arr.length){
        //递归结束
        console.log('递归结束 开始计算tf-idf');
        frequency.frequency(results);
    } else {
        console.log(`开始搜索${arr[arrcurrent]}`);
        sear(arr[arrcurrent]);
    }
}

//二级
function forNext2 (i) {
    results = [...results, ...i];
    if (arrcurrent2 >= i.length){
        arrcurrent += 1;
        arrcurrent2 = 0;
        //修改json文件 记录进度
        // writeJson(arr);
        forNext(arrcurrent);
    } else {
        console.log(`开始搜索${i[arrcurrent2]}`);
        sear(i[arrcurrent2]);
        arrcurrent2 += 1;
    }
}

// 下拉方法
function drop (url, callback) {
    process.nextTick(() => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += iconv.decode(chunk, 'GBK');
            });
            res.on('end', () => {
                let substring = data.substring(19, data.length),
                    substring2 = substring.substring(0, substring.length - 2),
                    json = JSON.parse(substring2);
                callback(json.s);
            });
        }).on("error", (err) => {
            return err;
        });
    });
}

//相关方法
function related (url, res, callback) {
    process.nextTick(function () {
        superagent.get(url).end(function (err, sres) {
                if (err){
                    callback(err);
                }
                let $ = cheerio.load(sres.text),
                    arr = [];
                $('.rw-list a').each((idx, data) => {
                    arr.push(data.children[0].data)
                });
                let setArr = unique(arr);
                let arr2 = [...res, ...setArr];
                callback(arr2);
            }
        )
    })
}

//异步
function sear (e) {
    async.waterfall([
        function (callback) {
            //下拉框
            let url = `https://m.baidu.com/su?pre=1&json=1&from=wise_web&callback=jsonp1&sugmode=2&wd=${encodeURI(e)}`;
            drop(url, function (result) {
                callback(null, result)
            });
        },
        function (res, callback) {
            if (!res){
                callback(null, res)
            }
            //相关
            let url = `https://m.baidu.com/s?word=${encodeURI(e)}`;
            related(url, res, function (result) {
                callback(null, result)
            });
        }
    ], function (err, result) {
        return forNext2(result);
    });
}