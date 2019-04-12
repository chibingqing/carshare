var CarModel = require('../../model/car');
var ChargingPileModel = require('../../model/chargingpile');
var BC = require('../../blockchain/bcoperation');
var assert = require('assert');
var CarSigner = require('../../model/createSign').CarSigner;
var UserSigner = require('../../model/createSign').UserSigner;
var chargingPileSigner = require('../../model/createSign').chargingPileSigner;
var orderModel = require('../../model/order');
var User = require('../../model/user');
var blockAccount = require('../../model/blockacc');
var blockchargingpile = require('../../model/blockchargingpile');
var blockcar = require('../../model/blockcar');
var blockorder = require('../../model/blockorder');
var UUID = require('uuid');
//添加车辆
function addCar(condition, callback) {
    try {
        var dateTemp = new Date().toLocaleString();
        var ID = UUID.v1();
        var app = new CarModel({
            compNum: condition.compNum, //所属公司ID
            compName: condition.compName, //所属公司名
            carNum: ID, //车辆唯一识别号
            plateNum: condition.plateNum, //车牌号
            carModel: condition.carModel, //车型
            seating: condition.seating, //座位数
            capacity: condition.capacity, //电池容量
            quantity: condition.quantity, //可用电量
            expectedMileage: condition.expectedMileage, //预计可行驶里程
            parkingchargingPile: condition.parkingchargingPile, //当前停车的充电桩
            billingRulesDesc: condition.billingRulesDesc, //计费规则描述
            stateMark: condition.stateMark, //状态标记
            // recordTime: dateTemp //上链时间
            recordTime: dateTemp
        });

        app.save(function(err, result) { //存入mongo数据库
            assert.equal(err, null);
            console.log(result);
            //生成req结构体
            var carreq = {
                compNum: condition.compNum, //所属公司ID
                compName: condition.compName, //所属公司名
                carNum: ID, //车辆唯一识别号
                plateNum: condition.plateNum, //车牌号
                carModel: condition.carModel, //车型
                seating: condition.seating, //座位数
                capacity: condition.capacity, //电池容量
                quantity: condition.quantity, //可用电量
                expectedMileage: condition.expectedMileage, //预计可行驶里程
                parkingchargingPile: condition.parkingchargingPile, //当前停车的充电桩
                billingRulesDesc: condition.billingRulesDesc, //计费规则描述
                stateMark: condition.stateMark, //状态标记
                // recordTime: dateTemp //上链时间
                recordTime: dateTemp
            };
            console.log(carreq);

            //生成签名
            var sign = CarSigner(carreq);
            //上链
            BC.addCar({ "req": carreq, "sign": sign }, function(error, data) {
                if (error == null) {
                    console.log("save in block");
                    console.log(data);

                    if (condition.parkingchargingPile != "") {
                        ChargingPileModel.update({ "pileNum": condition.parkingchargingPile }, { $set: { "parkingNum": ID, "stateMark": "2" } }, function(error1, up) {
                            ChargingPileModel.findOne({ "pileNum": condition.parkingchargingPile }, function(error1, up1) {

                                BC.chargingPileUpdate({ "req": up1, "sign": sign }, function(error, data) {
                                    if (error == null) {
                                        console.log("save in block");
                                        console.log(data);
                                        callback({
                                            states: 200,
                                            success: true
                                        });
                                    }
                                });
                                //assert.equal(err, null);  
                                console.log(result);
                            });
                        });
                    }

                } else {
                    console.log("error---------");
                    console.log(error);
                }

            });
        });
    } catch (err) {
        console.log(err);
    } finally {

    }
}

//添加充电桩
function addChargingPile(condition, callback) {
    try {
        var ID = UUID.v1();
        var dateTemp = new Date().toLocaleString();
        var app = new ChargingPileModel({
            compName: condition.compName, //所属公司名
            compNum: condition.compNum, //所属公司ID
            pilePlace: condition.pilePlace, //充电桩所处位置
            pileNum: ID, //充电桩编号
            pileDesc: condition.pileDesc, //充电桩描述
            position: condition.position, //所处位置坐标
            parkingNum: "", //当前停车的编号
            stateMark: condition.stateMark, //状态标记
            recordTime: dateTemp,
        });
        app.save(function(err, result) {
            console.log(err);
            // assert.equal(err, null);
            console.log(result);
            //生成req结构体
            var chargingpilereq = {
                compName: condition.compName, //所属公司名
                compNum: condition.compNum, //所属公司ID
                pilePlace: condition.pilePlace, //充电桩所处位置
                pileNum: ID, //充电桩编号
                pileDesc: condition.pileDesc, //充电桩描述
                position: condition.position, //所处位置坐标
                parkingNum: "", //当前停车的编号
                stateMark: condition.stateMark, //状态标记
                recordTime: dateTemp,
            };
            console.log(chargingpilereq);
            //生成签名
            var sign = chargingPileSigner(chargingpilereq);
            //上链
            BC.addChargingPile({ "req": chargingpilereq, "sign": sign }, function(error, data) {
                if (error == null) {
                    console.log("save in block");
                    console.log(data);
                    callback({
                        states: 200,
                        success: true
                    });
                } else {
                    console.log("error---------");
                    console.log(error);
                    callback({
                        states: 400,
                        status: error,
                        success: false
                    });
                }
            });
        })
    } catch (err) {
        console.log(err);
    } finally {}
}
//更新车辆信息
function updateCar(condition, callback) {
    CarModel.update({ "carNum": condition.carNum }, { $set: condition }, function(error1, up) {
        console.log(up);
        var carreq = {
            compNum: condition.compNum, //所属公司ID
            compName: condition.compName, //所属公司名
            carNum: condition.carNum, //车辆唯一识别号
            plateNum: condition.plateNum, //车牌号
            carModel: condition.carModel, //车型
            seating: condition.seating, //座位数
            capacity: condition.capacity, //电池容量
            quantity: condition.quantity, //可用电量
            expectedMileage: condition.expectedMileage, //预计可行驶里程
            parkingchargingPile: condition.parkingchargingPile, //当前停车的充电桩
            billingRulesDesc: condition.billingRulesDesc, //计费规则描述
            stateMark: condition.stateMark, //状态标记
            // recordTime: dateTemp //上链时间
            recordTime: condition.recordTime,
        };

        console.log(carreq);

        //生成签名
        var sign = CarSigner(carreq);
        //上链
        BC.carUpdate({ "req": carreq, "sign": sign }, function(error, data) {
            if (error == null) {
                console.log("save in block");
                console.log(data);
                callback({
                    states: 200,
                    success: true
                });

            }
        });
    });
}
//更新充电桩信息
function updateChargingPile(condition, callback) {
    ChargingPileModel.update({ "pileNum": condition.pileNum }, { $set: condition }, function(error1, up) {
        console.log(condition);
        //生成签名
        var sign = chargingPileSigner(condition);
        //更新链上数据
        BC.chargingPileUpdate({ "req": condition, "sign": sign }, function(error, data) {
            if (error == null) {
                console.log("save in block");
                console.log(data);
                callback({
                    states: 200,
                    success: true
                });
            } else {
                console.log("error---------");
                console.log(error);
                callback({
                    states: 400,
                    status: error,
                    success: false
                });
            }
        });
    });
}
//充电桩列表
function chargingPileList(condition, callback) {
    ChargingPileModel.find({ "compNum": condition.compNum }, function(err, result) {
        var a = [];
        for (var i = 0; i < result.length; i++) {
            var stateMark;
            if (result[i].stateMark == "1") {
                stateMark = "空闲";
            } else if (result[i].stateMark == "2") {

                stateMark = "正在使用";
            } else if (result[i].stateMark == "3") {

                stateMark = "维修";
            }
            var model = {
                pileNum: result[i].pileNum, //充电桩编号
                pilePlace: result[i].pilePlace, //充电桩所处位置
                pileDesc: result[i].pileDesc, //充电桩描述
                position: result[i].position, //所处位置坐标
                parkingNum: result[i].parkingNum, //当前停车的车号
                stateMark: stateMark, //状态标记       0空闲，1正在使用,2维护
                edit: "",
                //recordTime: condition. //上链时间
            };
            a.push(model)
        }
        callback(a);
    });
}
//车辆列表
function carList(condition, callback) {
    CarModel.find({ "compNum": condition.compNum }, function(err, result) {
        console.log(result.length)
        var a = [];
        for (var i = 0; i < result.length; i++) {
            var stateMark;
            if (result[i].stateMark == "1") {
                stateMark = "可使用";
            } else if (result[i].stateMark == "2") {

                stateMark = "正在使用";
            } else if (result[i].stateMark == "3") {

                stateMark = "维修";
            }

            var model = {
                carNum: result[i].carNum, //车辆唯一识别号
                plateNum: result[i].plateNum, //车牌号
                carModel: result[i].carModel, //车型
                seating: result[i].seating, //座位数
                capacity: result[i].capacity, //电池容量
                quantity: result[i].quantity, //可用电量
                expectedMileage: result[i].expectedMileage, //预计可行驶里程
                billingRulesDesc: result[i].billingRulesDesc, //计费规则描述
                parkingchargingPile: result[i].parkingchargingPile, //当前停车的充电桩
                stateMark: stateMark, //状态标记
                edit: "",
                // recordTime: dateTemp //上链时间
                //recordTime: dateTemp
            }
            a.push(model)
        }



        callback(a);
    });
}
//充电桩列表
function charingpileDetail(condition, callback) {
    blockchargingpile.findOne({ "PileNum": condition.PileNum }, function(err, result) {
        var app = {
            compName: result.CompName,
            compNum: result.CompNum,
            parkingNum: result.ParkingNum,
            pileDesc: result.PileDesc,
            pilePlace: result.PilePlace,
            pileNum: result.PileNum,
            position: result.Position,
            stateMark: result.StateMark
        };



        callback({
            states: 200,
            status: app,
        });
    });
}
//车辆详情
function carDetail(condition, callback) {
    blockcar.findOne({ "CarNum": condition.carNum }, function(err, result) {
        var app = {
            compName: result.CompName, //注册平台名字
            compNum: result.CompNum, //注册平台ID
            carNum: result.CarNum, //车辆唯一识别号
            plateNum: result.PlateNum, //车牌号
            carModel: result.CarModel, //车型
            seating: result.Seating, //座位数
            capacity: result.Capacity, //电池容量
            quantity: result.Quantity, //可用电量
            expectedMileage: result.ExpectedMileage, //预计可行驶里程
            billingRulesDesc: result.BillingRulesDesc, //计费规则描述，每分钟租车费用
            parkingchargingPile: result.ParkingchargingPile, //当前停车的充电桩
            stateMark: result.StateMark, //状态标记  0未使用1可使用2正在使用3维护
            recordTime: result.RecordTime, //上链时间
        }
        callback({
            states: 200,
            status: app,
        })

    });
}
//获取可使用充电桩
function carCharge(condition, callback) {
    ChargingPileModel.update({ "operatorName": condition.operatorName, "pileNum": condition.pileNum }, { $set: { "operatorName": condition.operatorName, "stateMark": condition.stateMark } }, function(error1, up) {
        console.log(up);
        var chargingpilereq = {
            pilePlace: condition.pilePlace, //充电桩所处位置
            pileNum: condition.pileNum, //充电桩编号
            pileDesc: condition.pileDesc, //充电桩描述
            position: condition.position, //所处位置坐标
            billingRulesDesc: condition.billingRulesDesc, //计费规则描述
            recordTime: dateTemp //上链时间
        };
    });
    CarModel.update({ "operatorName": condition.operatorName, "carNum": condition.carNum }, { $set: { "quantity": "100" } }, function(error1, up) {
        console.log(up);
        callback({
            states: 200,
            success: true
        });
    });
}
//下订单
function orderStart(condition, callback) {
    try {
        User.findOne({ "phone": condition.phone, compNum: condition.compNum }, function(err, userResult) {
            blockAccount.findOne({ "Idcard": userResult.idcard }, function(err, result) {
                if (result != null) {
                    if (result.FreezeMoney < 10000) {
                        callback({
                            states: 600,
                            status: "押金不足",

                        })


                    } else {
                        var timestamp = new Date().getTime();

                        var app = new orderModel({
                            orderId: "A" + timestamp,
                            carNum: condition.carNum,
                            phone: condition.phone,
                            startTime: timestamp,
                            compNum: condition.compNum, //所属公司ID
                            endTime: "",
                            startCharging: condition.pileNum, //离开的充电桩ID
                            endCharging: "",
                            money: 0
                        });
                        app.save(function(err, result) {
                            ChargingPileModel.update({ "pileNum": condition.pileNum, }, { $set: { "stateMark": "1", "parkingNum": "" } }, function(error1, up) { //更改充电桩状态

                                CarModel.update({ "carNum": condition.carNum, }, { $set: { "stateMark": "2", "parkingchargingPile": "" } }, function(error1, up) { //更改汽车状态
                                    assert.equal(err, null);
                                    console.log(result);
                                    //生成req结构体
                                    var orderreq = {
                                        orderId: "A" + timestamp,
                                        carNum: condition.carNum,
                                        phone: condition.phone,
                                        startTime: timestamp.toString(),
                                        compNum: condition.compNum, //所属公司ID
                                        endTime: "",
                                        startCharging: condition.pileNum,
                                        endCharging: "",
                                        money: 0
                                    };
                                    console.log(orderreq);

                                    //生成签名
                                    var sign = UserSigner(orderreq);

                                    BC.orderStart({ "req": orderreq, "sign": sign }, function(error, data) {
                                        if (error == null) {
                                            console.log("save in block");
                                            console.log(data);
                                            callback({
                                                states: 200,
                                                success: true
                                            });
                                        } else {
                                            console.log("error---------");
                                            console.log(error);
                                        }

                                    });


                                });
                            });


                        });


                    }
                } else {
                    callback({
                        states: 400,
                        status: "错误",
                        success: true
                    });
                }
            });
        });



    } catch (err) {
        console.log(err);
    } finally {

    }
}
//结束订单
function orderEnd(condition, callback) {
    try {
        var dateTemp = new Date().toLocaleString();

        var timestamp = new Date().getTime();
        blockorder.findOne({ "OrderId": condition.orderId, }, function(error1, orderresult) {
            blockcar.findOne({ "CarNum": orderresult.CarNum, }, function(err, carResult) {
                var duringTime = (((new Date().getTime()) - orderresult.StartTime) / 600).toFixed(0);
                var money = parseFloat(duringTime * parseFloat(carResult.BillingRulesDesc)).toFixed(0);
                var moneys = parseFloat(money);
                orderModel.update({ "orderId": condition.orderId, }, { $set: { "endTime": timestamp, "endCharging": condition.pileNum, "money": money } }, function(error1, up) {
                    console.log(up);
                    CarModel.update({ "carNum": orderresult.CarNum }, { $set: { "parkingchargingPile": condition.pileNum, "stateMark": "1" } }, function(error1, up) {
                        console.log(up);
                        ChargingPileModel.update({ "pileNum": condition.pileNum }, { $set: { "parkingNum": orderresult.CarNum, "stateMark": "2" } }, function(error1, up) {
                            blockchargingpile.findOne({ "PileNum": condition.pileNum }, function(error1, pileresult) {
                                orderresult["CarCompNum"] = carResult.CompNum;
                                orderresult["PileCompNum"] = pileresult.CompNum;
                                orderresult["Money"] = moneys;
                                orderresult["EndCharging"] = condition.pileNum;
                                orderresult["EndTime"] = timestamp;
                                var sign = UserSigner(orderresult);
                                BC.orderEnd({ "req": orderresult, "sign": sign }, function(error, data) {
                                    if (error == null) {
                                        console.log("save in block");
                                        console.log(data);
                                        callback({
                                            states: 200,
                                            success: true
                                        });
                                    } else {
                                        console.log("error---------");
                                        console.log(error);
                                        callback({
                                            states: 400,
                                            status: error,
                                            success: false
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.log(err);
    } finally {

    }
}
//可租用车辆列表
function carUseList(condition, callback) {
    var a = [];
    CarModel.find({ "stateMark": "1" }, function(err, result) {
        for (var i = 0; i < result.length; i++) {
            var model = {
                // operatorNum: condition.operatorNum,
                compNum: result[i].compNum,
                compName: result[i].compName,
                carNum: result[i].carNum, //车辆唯一识别号
                plateNum: result[i].plateNum, //车牌号
                carModel: result[i].carModel, //车型
                seating: result[i].seating, //座位数
                capacity: result[i].capacity, //电池容量
                quantity: result[i].quantity, //可用电量
                expectedMileage: result[i].expectedMileage, //预计可行驶里程
                billingRulesDesc: result[i].billingRulesDesc, //计费规则描述
                parkingchargingPile: result[i].parkingchargingPile, //当前停车的充电桩
                edit: "",
                //stateMark: result[i].stateMark, //状态标记
                // recordTime: dateTemp //上链时间
                //recordTime: dateTemp
            }
            a.push(model)

        }
        callback(a);



    });
}


//正在租用的车
function carUsingList(condition, callback) {

    blockorder.find({ "Phone": condition.username, "EndTime": "" }, function(err, result) {
        var model;
        var a = [];
        if (result.length > 0) {
            CarModel.find({ "CarNum": result[0].carNum, }, function(err, carResult) {
                var duringTime = ((new Date().getTime()) - result[0].StartTime) / 60000;
                var startTime = new Date(parseInt(result[0].StartTime));
                startTime = startTime.toLocaleDateString().replace(/\//g, "-") + " " + startTime.toTimeString().substr(0, 8);
                var money = (parseFloat(duringTime.toFixed(0)) * parseFloat(carResult[0].billingRulesDesc)).toString()
                model = {
                    //var dateTemp = new Date().toLocaleString();
                    orderId: result[0].OrderId,
                    plateNum: carResult[0].plateNum,
                    startTime: startTime,
                    //endTime: result[0].endTime,
                    //startCharging: carResult[0].pileNum,
                    duringTime: duringTime.toFixed(0),
                    money: money,
                    pile: "!",
                    edit: "",
                }
                a.push(model);
                callback(a);
            });

        } else {
            callback(a);
        }
    });
}
//可还充电桩列表
function useChargingPileList(condition, callback) {
    blockchargingpile.find({ "StateMark": "1" }, function(err, pileResult) {

        callback({
            states: 200,
            status: pileResult,
            success: true
        });

    });
}

//订单列表
function orderList(condition, callback) {
    var a = [];
    blockorder.find({ "Phone": condition.phone }, function(err, result) {
        for (var i = 0; i < result.length; i++) {
            var model = {
                orderId: result[i].OrderId,
                carNum: result[i].CarNum,
                startTime: new Date(parseInt(result[i].StartTime)).toLocaleString(),
                endTime: new Date(parseInt(result[i].EndTime)).toLocaleString(),
                startCharging: result[i].StartCharging,
                endCharging: result[i].EndCharging,
                money: result[i].Money / 100,
            }
            a.push(model)

        }
        callback(a);



    });
}
//对账列表
function orderRecordList(condition, callback) {
    var a = [];
    blockorder.find({}, function(err, result) {
        for (var i = 0; i < result.length; i++) {
            if (result[i]["CarCompNum"] == "1") {
                result[i]["CarCompNum"] = "挚达";
            } else {
                result[i]["CarCompNum"] = "八闽";
            }
            if (result[i]["PileCompNum"] == "1") {
                result[i]["PileCompNum"] = "挚达";
            } else {
                result[i]["PileCompNum"] = "八闽";
            }
            if (result[i]["CompNum"] == "1") {
                result[i]["CompNum"] = "挚达";
            } else {
                result[i]["CompNum"] = "八闽";
            }
            result[i].CarCompMoney = result[i].CarCompMoney / 100;
            result[i].PileCompMoney = result[i].PileCompMoney / 100;
            result[i].CompMoney = result[i].CompMoney / 100;
            result[i].Money = result[i].Money / 100;
        }
        callback(result);



    });
}
//获取余额
function getBalance(condition, callback) {

    blockAccount.findOne({ "Phone": condition.phone }, function(err, result) {
        result.Balance = result.Balance / 100;
        callback(result);



    });
}
//添加押金
function addFreezeMoney(condition, callback) {
    var a = [];
    User.findOne({ phone: condition.phone, compNum: condition.compNum }, function(err, result) {
        var freezeMoney = result.freezeMoney + 5000;
        result.freezeMoney = freezeMoney;
        User.update({ phone: condition.phone, compNum: condition.compNum }, { $set: { freezeMoney: freezeMoney } }, function(err, up) {
            BC.updateAccount({ "req": result, "sign": "" }, function(error, data) {
                if (error == null) {
                    console.log("save in block");
                    console.log(data);
                    callback({
                        states: 200,
                        status: "添加押金成功当前押金为:" + freezeMoney / 100 + "元",
                    })
                } else {
                    callback({
                        states: 400,
                        status: "添加押金失败",
                    })
                }

            });
        });

    });




}
exports.addCar = addCar;
exports.updateCar = updateCar;
exports.addChargingPile = addChargingPile;
exports.updateChargingPile = updateChargingPile;
exports.carList = carList;
exports.chargingPileList = chargingPileList;
exports.carCharge = carCharge;
exports.orderStart = orderStart;
exports.orderEnd = orderEnd;
exports.carUseList = carUseList;
exports.carUsingList = carUsingList;
exports.orderList = orderList;
exports.useChargingPileList = useChargingPileList;
exports.charingpileDetail = charingpileDetail;
exports.carDetail = carDetail;
exports.orderRecordList = orderRecordList;
exports.getBalance = getBalance;
exports.addFreezeMoney = addFreezeMoney;