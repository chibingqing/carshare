var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var assert = require('assert');
var dbs = require('./model/datebase');
var sender = require('./model/sender');
var userModel = require('./model/user');
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var url = config.mongoUrl;
var BC = require('./blockchain/bcoperation');
dbs.on('error', console.error.bind(console, 'connection error: '));
dbs.once('open', function() {
 console.log("----------------------------");
    User.findOne({ phone: "adminA" }, function(err, result) {//查找mongo数据库的User信息
        console.log(result)
        if (result == null) {
            console.log(222)
            var app = new User({
                phone: "adminA",
                password: "123123",
                role: "1",
                compNum: "1",
                compName: "挚达",
                name: "挚达",
                idcard: "adminA",
                freezeMoney: 0,
                balance: 0,
            });
            var account = {
                phone: "adminA",
                password: "123123",
                role: "1",
                compNum: "1",
                compName: "挚达",
                name: "挚达",
                idcard: "adminA",
                freezeMoney: 0,
                balance: 0,


            }
            app.save(function(err, result) {
                assert.equal(err, null);
                console.log(result);

                BC.register({ "req": account, "sign": "" }, function(err, data) {
                    console.log(data);


                    app = new User({
                        phone: "adminB",
                        password: "123123",
                        role: "1",
                        compNum: "2",
                        compName: "八闽",
                        name: "八闽",
                        idcard: "adminB",
                        freezeMoney: 0,
                        balance: 0,
                    });

                    account = {
                        phone: "adminB",
                        password: "123123",
                        role: "1",
                        compNum: "2",
                        compName: "八闽",
                        name: "八闽",
                        idcard: "adminB",
                        freezeMoney: 0,
                        balance: 0,
                    }
                    app.save(function(err, result) {
                        assert.equal(err, null);
                        console.log(result);
                        BC.register({ "req": account, "sign": "" }, function(err, data) {
                            console.log(data);

                        });
                    });

                });



            });

        }
    });
    // routers.
});
var carInfo = require('./js/routers/carInfo');
var users = require('./js/routers/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//passport config
var User = require('./model/user');
// app.use(passport.initialize());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'ui')));

app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// use routers.
routs();

function routs() {
    setTimeout(async() => {
        getBlock("ac", "blockaccs");
        setTimeout(async() => {
            getBlock("car", "blockcars");
            setTimeout(async() => {
                getBlock("cp", "blockchargingpiles");
                setTimeout(async() => {
                    getBlock("or", "blockorders");
                    routs();
                }, 1000);

            }, 1000);

        }, 3000);
    }, 100);
}
app.use('/users', users);
app.use('/carInfo', carInfo);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

async function getBlock(search, table) {
    try {
        sender.SearchGetter(search, function(error, data) {
            if (JSON.parse(data).Data != null) {
                MongoClient.connect(url, function(err, db) {
                    var results = JSON.parse(data).Data;
                    let list = [];
                    let updatelist = [];
                    let addlist = [];
                    let flg = false;

                    for (let key in results) {
                        let a = JSON.parse(results[key]);
                        a["_id"] = key;
                        //list.push(a);
                        list.push(Object.assign({ _id: key }, a));
                    }
                    db.collection(table).deleteMany({},
                        function(err, obj) {
                            if (err) throw err;
                            console.log("删除成功 ");
                            db.collection(table).insertMany(list, function(err, res) {
                                if (err) throw err;
                                console.log("插入成功 ");

                            });
                        });

                });
            }


        });
    } catch (err) {
        return;
    }

}


module.exports = app;