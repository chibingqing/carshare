var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
    orderId: String, //订单Id
    carNum: String, //车辆id
    phone: String, //用户帐号
    compNum: String, //租车的平台
    startTime: String, //订单开始时间
    endTime: String, //订单结束时间
    startCharging: String, //离开的充电桩
    endCharging: String, //订单结束时的充电桩
    money: Number //订单金额
});

module.exports = mongoose.model('Order', Order);