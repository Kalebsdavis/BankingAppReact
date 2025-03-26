var dbCon = require('../lib/database');
const {getAmount, addTransaction} = require('../helpers/transactions');


const deposit = async(req,res) => {
    console.log(`made it to deposit controller\n req.body: ${req.body.amount} ${req.body.username}`);
    const amount =  parseFloat(req.body.amount);
    const username = req.body.username;
    const accountType = req.body.accountType;
    const transactionType = 1;
    const memo = req.body.memo;
    
    const amountRecieved = await getAmount(username, accountType);

    //combine balances then update table

    const newBalance = (amount + parseFloat(amountRecieved)).toFixed(2);
    console.log(`new balance ${newBalance}`);
    const sql = 'Update accounts set balance = ? WHERE username = ? AND account_type_id = ?';
    const deposit =  await dbCon.promise().query(sql, [newBalance, username, accountType]);

    console.log(deposit[0].affectedRows);
    if (deposit[0].affectedRows>0){
        console.log('update succesful adding transaction to transaction history')
        const addToHistory = await addTransaction(username,amount, memo, transactionType, accountType);
        res.json({
            success: true,
            message: 'Deposit successful!',
            newBalance: newBalance
        });
    }
    else{
        res.json({
            error: 'unable to deposit right now'
        })
    }

}

const withdraw = async(req,res) => {
    console.log(`made it to deposit controller\n req.body: ${req.body.amount} ${req.body.username}`);
    const amount =  parseFloat(req.body.amount);
    const username = req.body.username;
    const accountType = req.body.accountType;
    const transactionType = 2;
    const memo = req.body.memo;
    
    const amountRecieved = await getAmount(username, accountType);

    //combine balances then update table

    const newBalance = (parseFloat(amountRecieved)-amount).toFixed(2);
    console.log(`new balance ${newBalance}`);
    const sql = 'Update accounts set balance = ? WHERE username = ? AND account_type_id = ?';
    const deposit =  await dbCon.promise().query(sql, [newBalance, username, accountType]);

    console.log(deposit[0].affectedRows);
    if (deposit[0].affectedRows>0){
        console.log('update succesful adding transaction to transaction history')
        const addToHistory = await addTransaction(username,amount, memo, transactionType, accountType);
        res.json({
            success: true,
            message: 'Withdraw successful!',
            newBalance: newBalance
        });
    }
    else{
        res.json({
            error: 'unable to deposit right now'
        })
    }

}

const getHistory =async(req,res) =>{
    console.log('retrieving transaction history');

    try{
    let sql = 'SELECT * FROM transactions';
    const result = await dbCon.promise().query(sql);
    console.log(result[0]);
    res.json({
        data: result[0]
    })
    }
    catch(error){
        res.status(500).json({ error: 'An error occurred while retrieving transaction history.' }); // Send a meaningful error message to the client
    }


}

module.exports = {
    deposit,
    withdraw,
    getHistory
}