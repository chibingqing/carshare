var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChargingPile = new Schema({
    compNum: String,
    compName: String,
    pilePlace: String, //充电桩所处位置
    pileNum: String, //充电桩编号
    pileDesc: String, //充电桩描述
    position: String, //所处位置坐标
    //billingRulesDesc: String, //计费规则描述
    parkingNum: String, //当前停车的车牌
    stateMark: String, //状态标记       1空闲，2正在使用,3维护
    recordTime: String //上链时间
});
module.exports = mongoose.model('chargingPile', ChargingPile);