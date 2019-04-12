var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    phone: String, //手机号
    password: String, //密码
    compName: String, //注册平台名字
    compNum: String, //注册平台ID
    idcard: String, //身份证
    role: String, //身份1company,2user
    freezeMoney: Number, //冻结资金
    balance: Number, //平台资金
    recordTime: String, //注册时间
});
//User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);