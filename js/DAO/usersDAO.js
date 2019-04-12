var passport = require('passport');
var User = require('../../model/user');
var blockUser = require('../../model/blockacc');
var assert = require('assert');
var BC = require('../../blockchain/bcoperation');
var UserSigner = require('../../model/createSign').UserSigner;
var Getter = require('../../model/sender').Getter;
//登陆
function login(condition, callback) {
    try {
        User.findOne({//数据库查找登陆的信息是否正确
            "phone": condition.phone,
            "password": condition.password,
            "compNum": condition.compNum,
        }, function(err, result) {
            if (result == null) {//查找无结果，则错误
                //  callback.set('Access-Control-Allow-Origin', '*');
                callback({
                    status: 400,
                    err: '用户名或密码错误！'
                });
            } else {//查找有结果，返回查找结果的信息
                callback({
                    phone: result.phone,
                    compNum: result.compNum,
                    role: result.role,
                    compName: result.compName,
                    success: true
                });
            }
        });
    } catch (err) {
        console.log(err);
    } finally {

    }
}

function register(condition, callback) {
    console.log("phone:" + condition.phone);
    var compName;
    if (condition.comp == "1") {
        compName = "挚达";
    } else if (condition.comp == "2") {
        compName = "八闽";
    }

    //查找注册的手机号与公司名是否之前注册过
    User.find({ "phone": condition.phone, compNum: condition.comp }, function(err, result) {
        if (result.length == 0) {//查询结果没有，则注册该用户

            var app = new User({ //model初始化
                phone: condition.phone,
                password: condition.password,
                role: "2",
                compNum: condition.comp,
                compName: compName,
                name: condition.name,
                idcard: condition.idcard,
                freezeMoney: 0,
                balance: 0,
            });
            app.save(function(err, result) {
                assert.equal(err, null);
                console.log(result);

                var accountreq = {
                    phone: condition.phone,
                    password: condition.password,
                    role: "2",
                    compNum: condition.comp,
                    compName: compName,
                    name: condition.name,
                    idcard: condition.idcard,
                    freezeMoney: 0,
                    balance: 0,
                };
                //生成签名
                var sign = UserSigner(accountreq);
                BC.register({ "req": accountreq, "sign": sign }, function(err, data) {
                    console.log(data);
                    blockUser.find({ "Idcard": condition.idcard }, function(err, result) {
                        if (result.length == 0) {
                            callback({
                                states: 200,
                                success: true
                            });
                        } else {
                            callback({
                                states: 600,
                                status: "注册成功！PS：此身份证在别的平台注册过",
                                success: false
                            });
                        }



                    });
                });

            });
        } else {//用户已经注册
            callback({
                states: 400,
                status: "重复注册",
                success: false
            });
        }

    });

}




exports.register = register;
exports.login = login;