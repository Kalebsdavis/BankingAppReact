const dbCon = require('../lib/database');


const getAmount = async(username, accountType) =>{
    console.log(`inside getAmount helper with username: ${username} \n accountType: ${accountType}`);
    const sql = 'SELECT balance FROM accounts WHERE username = ? AND account_type_id = ?';
    
    try{
    const balance = await dbCon.promise().query(sql,[username, accountType]);

    console.log('balance', balance[0][0].balance);

    return balance[0][0].balance;
    }
    catch(error){
        throw error;
    }
    
}

const addTransaction = async(username, amount, memo, transactionType, accountType)=>{
    let now = new Date();
    // Add leading zeros for single-digit months, days, hours, minutes, and seconds
    const pad = (num) => num.toString().padStart(2, '0');

    // Format the date into MySQL-compatible format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    console.log(`addTransaction function in helpers ${username}${amount}${memo}${transactionType}${accountType}`);
    const sql = 'CALL add_transaction(?,?,?,?,?,?,@result)';
    try{
    const results = await dbCon.promise().query(sql,[username,amount,memo, formattedDate, transactionType, accountType ]);

    console.log(`results: ${results}`);

    if(results[0].affectedRows>0){
        console.log('transaction added');
    }

    }
    catch(error){
        throw error;
    }
}

module.exports = {
    getAmount,
    addTransaction
}