var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlockOrder = new Schema({
    OrderId: String, //订单Id
    CarNum: String, //车辆id
    Phone: String, //用户帐号
    StartTime: String, //订单开始时间
    EndTime: String, //订单结束时间
    CompNum: String, //租车的平台
    StartCharging: String, //离开的充电桩
    EndCharging: String, //订单结束时的充电桩
    Money: Number, //订单金额
    CarCompNum: String,
    PileCompNum: String,
    CarCompMoney: Number,
    PileCompMoney: Number,
    CompMoney: Number,
});

module.exports = mongoose.model('blockorder', BlockOrder);