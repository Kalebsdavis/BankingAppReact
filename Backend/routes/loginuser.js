var express = require('express');
var router = express.Router();
var dbCon = require('../lib/database');
/* GET login page. */
router.get('/', function(req, res, next) {
console.log("loginuser.js: GET");
  
res.render('loginuser', {  });
  
});


// Route to retrieve salt for the entered username
router.post('/get_salt', function (req, res) {
  const username = req.body.username;
  const sql = "CALL get_salt(?)";
  dbCon.query(sql, [username], function (err, results) {
      if (err){
        console.log("retrieved ", results);
        throw err;
        
      }
      
      if (results[0][0]) {
          const salt = results[0][0].salt;
          req.session.salt = salt; // Optional, if needed later
          res.json({ success: true, salt });
      } else {
          res.json({ success: false, message: `User '${username}' not found.` });
      }
  });
});


/* Main POST login page. */
router.post('/', async function (req, res) {
  console.log("loginuser.js Main Post");
  const { username, hashedPassword } = req.body;
  
  const [results] = await dbCon.promise().query(sql =
     "CALL check_credentials(?, ?)",
     [username,hashedPassword]
    );
 
      console.log("results:", results);
      if (results[0][0] && results[0][0].result === 1) {
       
          req.session.loggedIn = true;
          req.session.username = username;
          



          const[userTypeRetrieve] = await dbCon.promise().query(  
            "SELECT user_type_id from users WHERE username = ?",
              [username]
              ); 
              console.log("user results: ", userTypeRetrieve[0].user_type_id);
              req.session.user_type_id = userTypeRetrieve[0].user_type_id; 
              const user_type_id = req.session.user_type_id;
          
           // Redirect based on user_type_id
      if (user_type_id === 1) {
        res.redirect('/customer');
      } else if (user_type_id === 2) {
        res.redirect('/employee');
      } else if (user_type_id === 3) {
        res.redirect('/adminselect');
      } else {
        res.redirect('/loginuser'); // Unexpected user_type_id
      }
    } else {
      // Login failed
      res.render('loginuser', { message: "Invalid username or password." });
    }
      
  });






module.exports = router;
