var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlockChargingPile = new Schema({
    CompName: String, //注册平台名字
    CompNum: String, //注册平台ID
    PilePlace: String, //充电桩所处位置
    PileNum: String, //充电桩编号
    PileDesc: String, //充电桩描述
    Position: String, //所处位置坐标
    //billingRulesDesc: String, //计费规则描述
    ParkingNum: String, //当前停车的车牌
    StateMark: String, //状态标记       0空闲，1正在使用,2维护
    RecordTime: String //上链时间
});
module.exports = mongoose.model('blockchargingpile', BlockChargingPile);