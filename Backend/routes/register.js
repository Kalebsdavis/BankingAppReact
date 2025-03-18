var express = require('express');
var router = express.Router();
dbCon = require("../lib/database");
/* GET login page. */
router.get('/', function(req, res, next) {
console.log("register.js: GET");
  res.render('register', {  });
  
});


/* POST register page. */
router.post('/', function(req, res, next) {
    console.log("register.js POST");
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const salt = req.body.salt;
    const hash = req.body.hash;
    var username = "";
    for(var i = 0; i<=7; i++){
        
        username+= Math.floor(Math.random() * (10 - 0) + 0);
    }
    console.log("username generator check: ", username);
    let sql="CALL register_user(?,?,?,?,?,@result); SELECT @result";
    dbCon.query(sql,[firstname,lastname,hash,username.toString(),salt], function(err,rows){
        if(err){
            throw err;
        }
        if(rows[1][0]['@result'] == 0){
            //succesfule registration
            //set the session variables/cookies
            req.session.username = username;
            req.session.loggedIn = true;

            req.session.save(function(err){
                if(err){
                    throw err;
                }
                console.log("registration.js: Successful registration, a session field is: "+ req.session.username);

                //redirect the user to home page. Let that redirect the user to the next correct spot.
                 res.redirect('/register_confirmed');
            });
        }else{
            //this user already exists
            console.log("This account already exists. Reload register page with that message");
            res.render('register',{message: "The username'" + username + "'already  exists"});
        }
    });
   
      });
    


module.exports = router;