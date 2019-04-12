//使用 express.Router 将不同的路由分离到不同的路由文件中。
var express = require('express');
//创建一个新的路由器
var router = express.Router(); 

var carInfoDAO = require('../DAO/carInfoDAO');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/addCar', function(req, res, next) {

    carInfoDAO.addCar(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/addChargingPile', function(req, res, next) {
    carInfoDAO.addChargingPile(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/charingpileDetail', function(req, res, next) {
    carInfoDAO.charingpileDetail(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/carDetail', function(req, res, next) {
    carInfoDAO.carDetail(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/del', function(req, res, next) {
    carInfoDAO.addChargingPile(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/useChargingPileList', function(req, res, next) {
    carInfoDAO.useChargingPileList(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/updateCar', function(req, res, next) {
    carInfoDAO.updateCar(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/updateChargingPile', function(req, res, next) {

    carInfoDAO.updateChargingPile(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/carList', function(req, res) {
    carInfoDAO.carList(req.body, function(result) {
        res.json(result);
    });
});
router.post('/chargingPileList', function(req, res) {
    carInfoDAO.chargingPileList(req.body, function(result) {
        res.json(result);
    });
});
router.post('/orderStart', function(req, res, next) {
    carInfoDAO.orderStart(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/orderEnd', function(req, res, next) {
    carInfoDAO.orderEnd(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/carUseList', function(req, res, next) {
    carInfoDAO.carUseList(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/carUsingList', function(req, res, next) {
    carInfoDAO.carUsingList(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/orderList', function(req, res, next) {
    carInfoDAO.orderList(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/orderRecordList', function(req, res, next) {
    carInfoDAO.orderRecordList(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/getBalance', function(req, res, next) {
    carInfoDAO.getBalance(req.body, function(result) {
        res.json(result);
    }, next);
});
router.post('/addFreezeMoney', function(req, res, next) {
    carInfoDAO.addFreezeMoney(req.body, function(result) {
        res.json(result);
    }, next);
});



module.exports = router;