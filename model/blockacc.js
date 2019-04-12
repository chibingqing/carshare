var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var BlockAcc = new Schema({
    Phone: String, //手机号
    password: String, //密码
    CompName: String, //注册平台名字
    CompNum: String, //注册平台ID
    Idcard: String, //身份证
    Role: String, //身份1company,2user
    FreezeMoney: Number, //冻结资金
    Balance: Number, //平台资金
    RecordTime: String, //注册时间
});
module.exports = mongoose.model('blockacc', BlockAcc);