var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database.js");

router.get('/', async (req, res) => {
    console.log("transfer.js get: ");
    const username = req.session.username;
    const accountType = req.query.accountType;
    console.log("username: \n", username ,"\nretrieved accountType: ", accountType);
    const [checkingbalance] = await dbCon.promise().query(
    "Select balance from accounts where account_type_id = 1 AND username = ?",
      [username]
      );
      console.log('checkings balance: ', checkingbalance);
      const checkBalance = checkingbalance[0].balance;
      console.log('checkings balance: ', checkBalance);
      const [savingsbalance] = await dbCon.promise().query(
        "Select balance from accounts where account_type_id = 2 AND username = ?",
          [username]
          );
          console.log('savings balance: ', savingsbalance);
          const saveBalance = savingsbalance[0].balance;
      console.log('checkings balance: ', saveBalance);  
    res.render('transfer', {checkBalance, saveBalance});
 });

 router.post('/', async (req, res) => {
    console.log("transfer.js post: "); 
    try { 
      const username = req.session.username;
      const amount = parseFloat(req.body.deposit);
      const memo = req.body.memo;
      const from_account = req.body.from_account;
      const to_account = req.body.to_account;
      const accountType = req.query.accountType;
      let transaction_type_id = 1;
      let time = new Date();
      let message = ""
      
      //retrieve current amount first
            
      const [checkingBalanceResult] = await dbCon.promise().query(
        "SELECT balance FROM accounts WHERE account_type_id = 1 AND username = ?",
        [username]
    );
    
    // Retrieve the balance from the query result
    const checkingBalance = parseFloat(checkingBalanceResult[0].balance);  // Ensure it's a number
    
    
    console.log('Checking balance:', checkingBalance);
    console.log('Transfer amount:', amount);
    
    if (isNaN(amount) || isNaN(checkingBalance)) {
        console.error("Invalid amount or balance value.");
        return res.status(400).send("Invalid amount or balance.");
    }
    
    /// now for savings 
    const [savingsBalanceResult] = await dbCon.promise().query(
        "SELECT balance FROM accounts WHERE account_type_id = 2 AND username = ?",
        [username]
    );
    
    // Retrieve the balance from the query result
    const savingsBalance = parseFloat(savingsBalanceResult[0].balance);  // Ensure it's a number
      
    
    console.log('Current balance:', savingsBalance);
    console.log('Transaction amount:', amount);
    
    if (isNaN(amount) || isNaN(savingsBalance)) {
        console.error("Invalid amount or balance value.");
        return res.status(400).send("Invalid amount or balance.");
    }
      
    let newChecking = 0.00;
    let newSavings = 0.00;

    if(from_account == "checkings" && to_account == 'savings'){
        //take away from checkings and add to savings
        newChecking = checkingBalance - amount;
        newSavings = savingsBalance + amount;

        const [updateChecking] = await dbCon.promise().query(
            "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 1",
            [newChecking, username]
        );

        console.log("new checking balance: ", updateChecking);

        const [updateSavings] = await dbCon.promise().query(
            "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 2",
            [newSavings, username]
        );

        console.log("new checking balance: ", updateSavings);
    }
    else if (from_account == "savings" && to_account == 'checkings'){
        //take away from savings add to checkings.
        newChecking = checkingBalance + amount;
        newSavings = savingsBalance - amount;

        const [updateChecking] = await dbCon.promise().query(
            "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 1",
            [newChecking, username]
        );

        console.log("new checking balance: ", updateChecking);

        const [updateSavings] = await dbCon.promise().query(
            "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 2",
            [newSavings, username]
        );

        console.log("new checking balance: ", updateSavings);

    }
    
    
        // Execute the query and wait for it to complete
        const [results] = await dbCon.promise().query(
            "CALL add_transaction(?,?,?,?,?,?,@result);",
            [username, amount, memo, time, transaction_type_id, accountType]
        );
        console.log("results: ", results);
    
    res.redirect('/customer');
    
    
    
    //////////////////////////////////////////////////////////////
      
 } catch (err) {
      console.error("Error running transaction procedure", err);
    }
  });
  
  
  module.exports = router;