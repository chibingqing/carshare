var Poster = require("../model/sender").Poster;
var CMessageOY = require('../model/message').CMessageOY;
var carVersion = "1.0"
var carName = "car"
function addCar(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "addCar", [JSON.stringify(body.req), String(body.sign)]);

    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}


function carQueryByPrefix(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "carQueryByPrefix", [JSON.stringify(body.req), String(body.sign)]);

    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function carQuery(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "carQuery", [JSON.stringify(body.req), String(body.sign)]);

    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function carUpdate(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "carUpdate", [JSON.stringify(body.req), String(body.sign)]);

    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function addChargingPile(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "addChargingPile", [JSON.stringify(body.req), String(body.sign)]);

    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}



function chargingPileUpdate(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "chargingPileUpdate", [JSON.stringify(body.req), String(body.sign)]);
    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function register(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "addAccount", [JSON.stringify(body.req), String(body.sign)]);
    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function orderEnd(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "orderEnd", [JSON.stringify(body.req), String(body.sign)]);
    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function orderStart(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "orderStart", [JSON.stringify(body.req), String(body.sign)]);
    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function updateAccount(data, callback) {
    var body = data;
    var msg = new CMessageOY(carName, carVersion, "updateAccount", [JSON.stringify(body.req), String(body.sign)]);
    Poster(msg, function(err, resdata) {
        if (err != null) {
            callback(err, null);
        }
        callback(null, resdata);
    });
}

module.exports = {
    addCar: addCar,
    carQueryByPrefix: carQueryByPrefix,
    carQuery: carQuery,
    carUpdate: carUpdate,
    addChargingPile: addChargingPile,
    chargingPileUpdate: chargingPileUpdate,
    register: register,
    orderStart: orderStart,
    orderEnd: orderEnd,
    updateAccount: updateAccount,
};