/**
 User: burning <923398776@qq.com>
 Date: 2018年07月12日
 */

const tfIdf = require('./tf-idf');

var trie = {},
    tempWords = {},
    res = [];

function tf (txt) {
    res = [...txt];
    res = res.join(',');
    res = res.replace(/,/g, '');
    res = res.replace(/[^\u4e00-\u9fa5]/g, '@');
    res = res.replace(/@+/g, ' ');
    split(res);
}

module.exports.frequency = tf;

function split (str) {
    str = str.split(' ');
    for (var i = 0; i < str.length; i++) {
        var words = str[i];
        if (words.length <= 1){
            continue;
        }

        //var wordsArr = [];
        if (words.length === 2){
            //wordsArr.push(words);
            wordsToTire(words);
        } else {
            for (var j = 0; j < words.length - 2; j++) {
                wordsToTire(words.substr(j, 4));
                //wordsArr.push(words.substr(j,4))
            }
        }
    }
    trieToWords();
    wordsToArrAndRank(function (e) {
        tfIdf.tf(e);
    });
}

function wordsToTire (str) {
    var words = str.split('');
    //在语言中有些词出现的频率过高没有实际意义，
    var stopWords = ["和", "与", "你", "我", "两", "这", "把", "那", "个", "他", "您", "它", "们", "是", "的", "一", "了", "在"]
    if (stopWords.indexOf(words[0]) !== -1){
        return false;
    }
    var temp = trie;

    for (var i = 0; i < words.length; i++) {
        temp = saveToTire(temp, words[i]);
    }

}

function saveToTire (obj, chart) {
    obj[chart] = obj[chart] || {len: 0}
    obj[chart].len += 1;
    return obj[chart];
}

function trieToWords () {
    var words = [];
    conmbin(trie, '');
}

function wordsToArrAndRank (callback) {
    var wordsArr = [];
    var keys = [];
    for (var i in tempWords) {
        keys.push(i);
    }
    keys = '|' + keys.join('|') + '|'
    for (var i in tempWords) {
        if (!RegExp('[^|]+' + i + '\\|').test(keys) && !RegExp('\\|+' + i + '[^|]+').test(keys)){
            wordsArr.push([i, tempWords[i]])
        }
    }
    wordsArr.sort(function (a, b) {
        return a[1] - b[1]
    })
    // console.log(JSON.stringify(wordsArr))
    // console.log('The Key list is', wordsArr)
    callback(wordsArr)
}

function conmbin (obj, str) {
    var retObj = [];
    var haveSone = false;
    var pow = obj.len;
    for (i in obj) {
        if (obj[i].len <= 9){
            continue;
        }
        if (i !== 'len'){
            //console.log(str+i);
            conmbin(obj[i], str + i);
        }
    }

    if (!haveSone && str.length >= 2){
        tempWords[str] = tempWords[str] || 0
        tempWords[str] = Math.max(tempWords[str], pow)
    }
}