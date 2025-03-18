var express = require('express');
var router = express.Router();

// Function to retrieve accounts balance based on username
async function retrieveAccounts(req, res, username) {
  let accountbalance = {};

  // Query to retrieve checking account balance
  const getCheckingBalance = new Promise((resolve, reject) => {
    const sql = "SELECT balance FROM accounts WHERE username = ? AND account_type_id = 1";
    dbCon.query(sql, [username], (err, rows) => {
      if (err) return reject(err);
      accountbalance.checking = rows.length > 0 ? rows[0].balance : 0;
      resolve();
    });
  });

  // Query to retrieve savings account balance
  const getSavingsBalance = new Promise((resolve, reject) => {
    const sql = "SELECT balance FROM accounts WHERE username = ? AND account_type_id = 2";
    dbCon.query(sql, [username], (err, rows) => {
      if (err) return reject(err);
      accountbalance.savings = rows.length > 0 ? rows[0].balance : 0;
      resolve();
    });
  });

  // Await both balance queries
  await Promise.all([getCheckingBalance, getSavingsBalance]);

  // Render the customer page
  res.render('employeeaccountview', { accountbalance });
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  const username = req.session.username;

  try {
    // Check if the user exists in the database
    const [rows] = await dbCon.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // If user doesn't exist, destroy the session and redirect to login
    if (rows.length === 0) {
      console.log("Username not found, destroying session.");
      req.session.destroy((err) => {
        if (err) {
          console.error("Failed to destroy session:", err);
          return res.status(500).send("Server Error");
        }
        return res.redirect('/login'); // Redirect to login after destroying session
      });
    } else {
      // Retrieve accounts with valid username
      await retrieveAccounts(req, res, username);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});


module.exports = router;