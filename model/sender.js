var http = require('http');
var config = require('../config');

//通过后端调用梧桐链的SDK来将前端的数据传递给梧桐链
//即可以调用所写的智能合约的函数
//发送 http Post 请求
//有待修改
function Poster(reqData, callback) {
    var postData = JSON.stringify(reqData);
    var options = {              //调用SDK
        hostname: config.bchost, //SDK的localhost
        port: config.bcport,     //SDK的post
        path: "/createnewtransaction",//创建交易
        method: 'POST',          //前端传递表单
        headers: {
            "Content-Type": 'application/json',//Data Format，json格式
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    var req = http.request(options, function(res) {
        console.log('Status:', res.statusCode);
        res.setEncoding('utf-8');
        res.on('data', function(chun) {

            var chun_data = JSON.parse(chun.toString()).Data.Figure;
            callback(null, chun_data);
        });
        res.on('end', function() {
            // console.log('No more data in response.********');
        });
    });
    req.on('error', function(err) {
        console.error(err);
        callback(err, null);
    });
    req.write(postData);
    req.end();
}
//HTTP GET 请求
function Getter(txid, callback) {
    http.get("http://" + config.bchost + ":" + config.bcport + "/gettransaction?hashData=" + String(encodeURIComponent(txid)), function(res) {
        var size = 0;
        var chunks = [];
        res.on('data', function(chunk) {
            size += chunk.length;
            chunks.push(chunk);
            console.log(chunk);
        });
        res.on('end', function() {
            var data = Buffer.concat(chunks, size);
            console.log(data.toString());
            //var resdata = JSON.parse(data.toString());
            callback(null, data.toString());
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(e, null);
    });
}
//HTTP GET 请求
function SearchGetter(condition, callback) {
    http.get("http://" + config.bchost + ":" + config.bcport + "/search/byprefix?prefix=" + condition + "&cn=car", function(res) {
        var size = 0;
        var chunks = [];
        res.on('data', function(chunk) {
            size += chunk.length;
            chunks.push(chunk);
            console.log(chunk);
        });
        res.on('end', function() {
            var data = Buffer.concat(chunks, size);
            console.log(data.toString());
            //var resdata = JSON.parse(data.toString());
            callback(null, data.toString());
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(e, null);
    });
}
module.exports = {
    Poster: Poster,
    Getter: Getter,
    SearchGetter: SearchGetter,
};