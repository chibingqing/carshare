/*新建一个car的Schema*/
//Mongoose是在nodejs环境中对MongoDB数据库操作的封装
//一种对象模型工具，可以将数据库中的数据转换为javascript对象供我们使用。
var mongoose = require('mongoose'); //使用mongoose

//Schema是一种以文件形式存储的数据库模型骨架，不具备对数据库操作的能力仅仅只是数据库在程序片段中的一种表现，可以理解为表结构。
//允许使用的SchemaTypes有如下类型：String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array

//Schema定义，不对数据库有操作能力
var Schema = mongoose.Schema;

var Car = new Schema({
    compNum: String,
    compName: String,
    carNum: String, //车辆唯一识别号
    plateNum: String, //车牌号
    carModel: String, //车型
    seating: String, //座位数
    capacity: String, //电池容量
    quantity: String, //可用电量
    expectedMileage: String, //预计可行驶里程
    billingRulesDesc: String, //计费规则描述，每分钟租车费用
    parkingchargingPile: String, //当前停车的充电桩
    stateMark: String, //状态标记  1可使用2正在使用3维修
    recordTime: String, //上链时间
});
//创建一个模型：model是由schema生成的模型，对数据库有操作能力
//mongoose.model(modelName, schema);
module.exports = mongoose.model('car', Car);　//module.exports才是真正的接口