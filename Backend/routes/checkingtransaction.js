var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database.js");



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("checkingtransactions.get");
  const username = req.session.username;
  
  let transaction_type = [];
  let value = [];
  console.log("username: ", username);
  let sql="Select * from transactions where username = ?";
  dbCon.query(sql,[username], function(err,transactions){
    if(err){
      throw err;
    }
    console.log("transactions: ", transactions);

    // Check if there are any transactions
    if (transactions.length === 0) {
      console.log("no transactions currently");
      transaction_type.push('No transactions available');
      value = '';
    } else {
      // Loop through each transaction and process accordingly
      transactions.forEach((transaction) => {
        console.log("Transaction: ", transaction);
        
        // Assuming you only want to show the first transaction as deposit type
        if (transaction.transaction_type_id == 1) {
          console.log("Transaction Type: Deposit");
          transaction_type.push('deposit');
          value.push('+$' + transaction.amount);
        } else {
          console.log("Transaction Type: Withdraw");
          transaction_type.push('withdraw');
          value.push('-$' + transaction.amount);
        }
      });
    }
    //need to retrieve user type as this page is shared by customer and employee but needs to look different
    let sql="Select * from users where username = ?";
      dbCon.query(sql,[username], function(err,users){
        if(err){
          throw err;
        }
        console.log("users: ", users);
      
    // Render the page with transactions, type, and value
    res.render('checkingtransaction', { transactions, transaction_type, value, users});
    });
  });
});







module.exports = router;