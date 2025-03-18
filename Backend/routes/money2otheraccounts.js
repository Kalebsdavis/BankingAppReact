var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database.js");

router.get('/', async (req, res) => {
    console.log("user2user.js get: ");
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
    res.render('money2otheraccounts', {checkBalance, saveBalance});
 });


 



 router.post('/', async (req, res) => {
    console.log("user2user.js post: "); 
    try{
    const recipient = req.body.recipient;
     const from_account=req.body.from_account;
      const amount = parseFloat(req.body.amount).toFixed(2);
      const memo = req.body.memo;
      const username = req.session.username; 
      const time = new Date();
      let account_type_id = 1;
    message = "";
    //first verify existence of username
    console.log(username);
    const[userResults] = await dbCon.promise().query(
      "Select * from users where username = ?;",
      [recipient]
    );
    console.log("user results: ", userResults);

    if(userResults.length === 0){
      console.log("user didnt exist");
      message = "user does not exist";
      res.render('money2otheraccounts', {message});
    }else{
      //retrieve recipients account
      console.log("attempting to retrieve recipients account");
      const[recipientBalance] = await dbCon.promise().query(
        "Select balance from accounts where username = ? AND account_type_id = 1",
        [recipient]
      );
      console.log("recipient balance: ", recipientBalance[0].balance);
      const recipient_balance = recipientBalance[0].balance;

      
      //retrieve users account
      console.log("account type: ",from_account);
      if(from_account == 'checkings'){
         account_type_id = 1;
      }else{
         account_type_id = 2;
      }
      console.log("account_type_id set to : " ,account_type_id);
      const[user] = await dbCon.promise().query(
        "Select balance from accounts where username = ? AND account_type_id = ?",
        [username, account_type_id]
      );
      console.log("user balance: ", user[0].balance);
      const user_balance = user[0].balance;

      const newUserBalance = user_balance - amount;
      console.log("new user balance: ", newUserBalance);
      
      
      const newRecipientBalance = parseFloat(recipient_balance) + parseFloat(amount);
      console.log("new recipient balance: ", newRecipientBalance);
      const [updateRecipientChecking] = await dbCon.promise().query(
        "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 1",
        [newRecipientBalance, recipient]
    );

    console.log("new checking balance: ", updateRecipientChecking);

      if(from_account == 'checkings'){
        console.log("updating checking for user");
        const [updateUserChecking] = await dbCon.promise().query(
          "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 1",
          [newUserBalance, username]
      );
  
      console.log("new checking balance: ", updateUserChecking);
      }
      else if(from_account == 'savings'){
        console.log("updating checking for user");
        const [updateUserChecking] = await dbCon.promise().query(
          "UPDATE accounts SET balance = ? WHERE username = ? AND account_type_id = 2",
          [newUserBalance, username]
      );
  
      console.log("new checking balance: ", updateUserChecking);
      }
    }

    // Execute  2 times for transactions on both ends the query and wait for it to complete
    const [results] = await dbCon.promise().query(
      "CALL add_transaction(?,?,?,?,?,?,@result);",
      [username, amount, memo, time, 2, account_type_id]
      );
      console.log("results: ", results);

      const [recipientTransaction] = await dbCon.promise().query(
        "CALL add_transaction(?,?,?,?,?,?,@result);",
        [recipient, amount, memo, time, 1, account_type_id]
        );
        console.log("results: ", recipientTransaction);

      res.redirect('/customer');
    } catch (err) {
      console.error("Error running transaction procedure", err);
    }
  });
    ////////////////////////////////////
   
  
  
  module.exports = router;