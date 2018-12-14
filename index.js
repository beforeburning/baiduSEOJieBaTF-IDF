/**
 User: burning <923398776@qq.com>
 Date: 2018年07月16日
 */

const fs = require('fs'),
    xlsx = require('xlsx'),
    start = require('./module/start');

//读取json文件
fs.readFile('./data/data.json', 'utf8', function (err, data) {
    if (!data){
        //没有json文件 读取xlsx
        readXlsx();
    } else {
        readJson(data);
    }
});

//创建json 写入数据
function readXlsx () {
    let workbook = xlsx.readFile('./data/data.xlsx'),
        jsonData = workbook.Strings,
        json = [];
    jsonData.forEach((val) => {
        let data = val.t;
        json.push(data);
    });

    fs.writeFile('./data/data.json', json, function (err) {
        if (err){
            return console.log(err);
        }
        readJson(json);
    });
}

function readJson (e) {
    start.start(e);
}
