var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database.js");

router.get('/', async (req, res) => {
    const username = req.session.username;
    const accountType = req.query.accountType;
    console.log("retrieved accountType: ", accountType);
    const [balance] = await dbCon.promise().query(
    "Select balance from accounts where account_type_id = 1 AND username = ?",
      [username]
      );
      console.log('balance: ', balance);
      //retrieve user type for navigation purposes
      let sql="Select * from users where username = ?";
      dbCon.query(sql,[username], function(err,users){
        if(err){
          throw err;
        }
        console.log("users: ", users);
    res.render('ATMinterface', {balance, users});
      });
 });

 router.post('/', async (req, res) => {
    console.log("ATMinterface.js post: "); 
    try { 
      const username = req.session.username;
      const amount = parseFloat(req.body.deposit);
      const memo = req.body.memo;
      const transaction_type = req.body.transaction_type;
      const accountType = req.query.accountType;
      let transaction_type_id = 1;
      let time = new Date();
      
      if (transaction_type === 'deposit') {
        transaction_type_id = 1;
      } else if (transaction_type === 'withdraw') {
        transaction_type_id = 2;
      }
      
      // Log input
      console.log("Passing the following into procedure\n" +
        "username: ", username, "\namount: ", amount, "\nmemo: ", memo, "\ntime: ", time,
        "\ntransaction_type_id: ", transaction_type_id
      );
      
      if(accountType ==1){
            // Execute the query and wait for it to complete
            const [results] = await dbCon.promise().query(
                "CALL add_transaction(?,?,?,?,?,?,@result);",
                [username, amount, memo, time, transaction_type_id, 1]
            );
            //Add or take away the funds.
            //retrieve current amount first
            
            const [balanceResult] = await dbCon.promise().query(
                "SELECT balance FROM accounts WHERE account_type_id = 1 AND username = ?",
                [username]
            );
            
            // Retrieve the balance from the query result
            const currentBalance = parseFloat(balanceResult[0].balance);  // Ensure it's a number
            
            
            console.log('Current balance:', currentBalance);
            console.log('Transaction amount:', amount);
            
            if (isNaN(amount) || isNaN(currentBalance)) {
                console.error("Invalid amount or balance value.");
                return res.status(400).send("Invalid amount or balance.");
            }
            
            // Check transaction type
            if (transaction_type_id === 1) {
                // Deposit
                const newBalance = currentBalance + amount;
                const [updateResult] = await dbCon.promise().query(
                    "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 1",
                    [newBalance, username]
                );
            
                console.log('New balance after deposit:', newBalance);
            
            } else if (transaction_type_id === 2) {
                // Withdraw
                if (currentBalance >= amount) {
                    const newBalance = currentBalance - amount;
                    const [updateResult] = await dbCon.promise().query(
                        "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 1",
                        [newBalance, username]
                    );
            
                    console.log('New balance after withdrawal:', newBalance);
            
                } else {
                    console.log("Insufficient balance for withdrawal.");
                    return res.status(400).send("Insufficient balance for withdrawal.");
                }
            }
    
                    // Redirect back to the transactions page
                    res.redirect('/checkingtransaction');
    }else if(accountType ==2){
        const [results] = await dbCon.promise().query(
            "CALL add_transaction(?,?,?,?,?,?,@result);",
            [username, amount, memo, time, transaction_type_id, 2]
          );
            //Add or take away the funds.
      //retrieve current amount first
      
      const [balanceResult] = await dbCon.promise().query(
        "SELECT balance FROM accounts WHERE account_type_id = 2 AND username = ?",
        [username]
    );
    
    // Retrieve the balance from the query result
    const currentBalance = parseFloat(balanceResult[0].balance);  // Ensure it's a number
      
    
    console.log('Current balance:', currentBalance);
    console.log('Transaction amount:', amount);
    
    if (isNaN(amount) || isNaN(currentBalance)) {
        console.error("Invalid amount or balance value.");
        return res.status(400).send("Invalid amount or balance.");
    }
    
    // Check transaction type
    if (transaction_type_id === 1) {
        // Deposit
        const newBalance = currentBalance + amount;
        const [updateResult] = await dbCon.promise().query(
            "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 2",
            [newBalance, username]
        );
    
        console.log('New balance after deposit:', newBalance);
    
    } else if (transaction_type_id === 2) {
        // Withdraw
        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;
            const [updateResult] = await dbCon.promise().query(
                "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 2",
                [newBalance, username]
            );
    
            console.log('New balance after withdrawal:', newBalance);
    
        } else {
            console.log("Insufficient balance for withdrawal.");
            return res.status(400).send("Insufficient balance for withdrawal.");
        }
    }
    
    // Redirect back to the transactions page
    res.redirect('/savingstransaction');
    }
      
 } catch (err) {
      console.error("Error running transaction procedure", err);
    }
  });
  
  
  module.exports = router;