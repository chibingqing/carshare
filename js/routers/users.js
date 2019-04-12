var express = require('express');
var router = express.Router();

var usersDAO = require('../DAO/usersDAO');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });
router.post('/login', function(req, res, next) {
    usersDAO.login(req.body, function(result) {
        res.json(result);
    }, next);
});
router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});
router.post('/register', function(req, res) {
    usersDAO.register(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;