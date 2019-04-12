var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BlockCar = new Schema({
    CompName: String, //注册平台名字
    CompNum: String, //注册平台ID
    CarNum: String, //车辆唯一识别号
    PlateNum: String, //车牌号
    CarModel: String, //车型
    Seating: String, //座位数
    Capacity: String, //电池容量
    Quantity: String, //可用电量
    ExpectedMileage: String, //预计可行驶里程
    BillingRulesDesc: String, //计费规则描述，每分钟租车费用
    ParkingchargingPile: String, //当前停车的充电桩
    StateMark: String, //状态标记  0未使用1可使用2正在使用3维护
    RecordTime: String, //上链时间
});
module.exports = mongoose.model('blockcar', BlockCar);