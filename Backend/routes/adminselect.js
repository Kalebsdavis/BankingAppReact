var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  console.log("adminselect.js get: ");
  
  let sql="Select * from users ";
  dbCon.query(sql,function(err,users){
    if(err){
      throw err;
    }
    console.log("users: ", users);

  res.render('adminselect', {users });
});

});

router.post('/', function(req,res,next){
  console.log("adminselect.js post: ");
  const username = req.body.username;
  console.log("username: ", username);
  const firstname = req.body.username;
  const lastname = req.body.usernam;

  req.session.username = username;
  req.session.firstname = firstname;
  req.session.lastname =lastname;

  res.redirect('/accountinfo');

});


module.exports = router;
