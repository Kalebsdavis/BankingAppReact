var express = require('express');
var router = express.Router();
dbCon = require("../lib/database");
/* GET login page. */
router.get('/', function(req, res, next) {
console.log("register.js: GET");
    let username = req.session.username;
    res.render('register_confirmed', { username });
  
});

module.exports = router;