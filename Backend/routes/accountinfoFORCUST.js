var express = require('express');
var router = express.Router();
dbCon = require("../lib/database");
/* GET home page. */
function retrieveName(username) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT CONCAT(firstname, ' ', lastname) AS 'name' FROM users WHERE username = ?";
    dbCon.query(sql, [username], function(err, results) {
      if (err) {
        return reject(err); // Reject the promise on error
      }
      if (results.length === 0) {
        return resolve(null); // Resolve with null if no user is found
      }
      console.log("results:", results);
      resolve(results[0].name); // Resolve with the user's name
    });
  });
}



router.get('/', async function(req, res, next) {
  console.log("accountinfoFORCUST.js get:");
  try {
    const username = req.session.username;
    const salt = req.session.salt;
    console.log("salt: ",salt);
    console.log("passing username:", username);

    if (!username) {
      return res.redirect("/login"); // Redirect if no username is in the session
    }

    const name = await retrieveName(username); // Await the async function

    res.render('accountinfoFORCUST', { name: name || "Guest",
                                       username: username,
                                       salt: salt

     }); // Render with the name
  } catch (err) {
    console.error("Error retrieving name:", err);
    res.status(500).send("Error processing request.");
  }
});
  
  
router.post('/', async function(req, res, next) {
  console.log("accountInforFORCUST.js post");
  
  if (req.body.hashedPassword) {
    // User is submitting user/password credentials
    const sessionusername = req.session.username;
    const name = await retrieveName(sessionusername);
    const bodyusername = req.body.currentusername;
    const hashedPassword = req.body.hashedPassword[0];
    const salt = req.session.salt;
    const hashedNew = req.body.hashedNew;
    console.log("hashed password: ", hashedPassword , '\n' , "hashedNew: ", hashedNew); // This should now be logged correctly

    try {
      // Retrieve all usernames except the current session username
      let sql = "SELECT username FROM users WHERE username != ?";
      const [results] = await dbCon.promise().query(sql, [sessionusername]); // Use promise-based query for async

      console.log("results: ", results);

      // Check if the new username is unique
      const isUnique = !results.some(row => row.username === bodyusername);

      if (isUnique) {
        console.log("Username is unique, proceeding with account update.");

        // Now check the hashed password
        sql = "SELECT hashed_password FROM users WHERE username = ?";
        const [passwordResults] = await dbCon.promise().query(sql, [sessionusername]);

        if (passwordResults.length === 0) {
          console.log("No user found with this username.");
          return res.render("accountinfoFORCUST", {
            message: "User not found."
          });
        }

        // Compare the provided hashed password with the stored hashed password
        if (hashedPassword === passwordResults[0].hashed_password) {
          console.log("The passwords match");
          // Proceed with the account update here
          console.log("Passing username to be set: ",bodyusername,'\n','Passing new hashed to be set: ',hashedNew, "\n", "on username: ", sessionusername);
          sql = "UPDATE users SET username = ?, hashed_password = ? where username = ?"//update user 
          dbCon.query(sql, [bodyusername,hashedNew,sessionusername], function(err,results){
            if(err){
              throw err;
            }
            console.log("User updated");
            res.redirect("/customer");
          });
        } else {
          console.log("The passwords do not match", hashedPassword, "submitted,", passwordResults[0].hashed_password,"expected");
          return res.render("accountinfoFORCUST", {
            name: name || "Guest",
            username: sessionusername,
            salt: salt,
            message: "Invalid password."
          });
        }

      } else {
        console.log("Username already exists.");
        return res.render("accountinfoFORCUST", {
          name: name || "Guest",
          username: sessionusername,
          salt: salt,
          message: "Username is already taken. Please choose a different username."
        });
      }

    } catch (err) {
      console.error("Error occurred during processing:", err);
      return res.render("accountinfoFORCUST", {
                                       name: name || "Guest",
                                       username: sessionusername,
                                       salt: salt,
                                       message: "An error occurred, please try again."
      });
    }
  }
});

  module.exports = router;