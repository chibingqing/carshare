var crypto = require('crypto');
var fs = require('fs');//获取fs模块

var path = require('path');

//生成车辆的签名
function CarSigner(req) {

    var msg = JSON.stringify(req);//将 JavaScript 值转换为 JSON 字符串
    var sign = crypto.createSign('SHA256');//使用给定的SHA256算法创建并返回一个签名器对象。
    //提供数字签名算法功能。数字签名用于确保数字数据的验证和完整性。

    var privatePem = fs.readFileSync(path.join(__dirname, "../pem/comp-key.pem"), "utf-8");//同步读取公司密钥
    //fs.readFileSync(filename, [encoding])   
    var key = privatePem.toString();//转化为String


    sign.update(msg);//使用msg参数更新签名器对象。当使用流数据时可能会多次调用该方法。

    sig = sign.sign(key, 'base64');//signer.sign(private_key, output_format='binary')
    //对所有传入签名器的数据计算其签名。private_key为字符串，它包含了PEM编码的用于签名的私钥。返回签名，其output_format输出可以为'binary', 'hex' 或者'base64'。
    console.log(sig);
    return sig;
}
//资产凭证的签名
function chargingPileSigner(req) {

    var msg = JSON.stringify(req);
    var sign = crypto.createSign('SHA256');

    var privatePem = fs.readFileSync(path.join(__dirname, "../pem/comp-key.pem"), "utf-8");
    var key = privatePem.toString();


    sign.update(msg);

    sig = sign.sign(key, 'base64');
    console.log(sig);
    return sig;
}
//资产凭证的签名
function UserSigner(req) {

    var msg = JSON.stringify(req);
    var sign = crypto.createSign('SHA256');

    var privatePem = fs.readFileSync(path.join(__dirname, "../pem/comp-key.pem"), "utf-8");
    var key = privatePem.toString();


    sign.update(msg);

    sig = sign.sign(key, 'base64');
    console.log(sig);
    return sig;
}
module.exports = {
    CarSigner: CarSigner,
    chargingPileSigner: chargingPileSigner,
    UserSigner: UserSigner,
};