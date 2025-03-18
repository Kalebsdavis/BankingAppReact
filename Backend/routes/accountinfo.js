var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database.js");

/* GET home page. */

router.get('/', function(req, res, next) {
  const username = req.session.username; // Assuming username is set in session
  const salt = req.session.salt; // Assuming salt is set in session
  console.log("username: ", username, "\nsalt: ",salt);
  // Query to get user information based on username
  let sql = "SELECT * FROM users WHERE username = ?";
  dbCon.query(sql, [username], function(err, results) {
    if (err) {
      console.log("There is an issue with the SQL call.");
      return next(err);
    }

    console.log("results: ", results);

    // Ensure `results` is passed as an object with a named property
    res.render('accountinfo', { username, salt,  users: results[0] }); // Pass only the first result
  });
});

/*post home page*/
router.post('/', async function(req, res, next) {
    console.log("accouninfo.js post");
    const username = req.session.username;
    const salt = req.body.salt;
    const firstname = req.body.firstname;
    const lastname  = req.body.lastname;
    const promotion =req.body.promote;
    let promote_type_id = 1;
    const hashedPassword = req.session.hashedPassword;
    if(promotion=='employee'){
      promote_type_id = 2;
      const[userchangeResults] = await dbCon.promise().query(  
        "UPDATE users SET firstname = ?, lastname =?, user_type_id=? WHERE username = ?",
         [firstname,lastname,promote_type_id,username]
          ); 
          console.log("user results: ", userchangeResults);
          
    }
    else if(promotion == 'admin'){
      promote_type_id = 3;
      const[userchangeResults] = await dbCon.promise().query(  
        "UPDATE users SET firstname = ?, lastname =?, user_type_id=? WHERE username = ?",
        [firstname,lastname,promote_type_id,username]
          ); 
          console.log("user results: ", userchangeResults);

      const[removeMoney] = await dbCon.promise().query(
        "UPDATE accounts SET balance = 0.00 WHERE username = ? AND user_type_id=?",
          [username,promote_type_id]
      );
          
    }
    else{
        //no promotion 
        const[userchangeResults] = await dbCon.promise().query(  
          "UPDATE users SET firstname = ?, lastname =?, user_type_id=? WHERE username = ?",
          [firstname,lastname,promote_type_id,username]
            ); 
            console.log("user results: ", userchangeResults);
    }   

    //second handle password change
    if(hashedPassword === undefined){
      console.log("no password change neccesary.");
      res.redirect('/adminselect');
    }
    else{
    const[Results] = await dbCon.promise().query(
      "UPDATE users SET hashedpassword = ? where username =?",
      [username]
      );
      console.log("user results: ", Results);
      
    }

   


      
});


module.exports = router;