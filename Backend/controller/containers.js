var dbCon = require('../lib/database');

const getContainers = async(req, res) =>{
    //retrieve containers based on user id
    console.log('req:',req.params.username);
    const username = req.params.username;
    console.log(`username: ${username}`);

    const sql  = 'SELECT * FROM accounts WHERE username = ?';
    const [accounts] = await dbCon.promise().query(sql,[username]);

    console.log(`accounts retrieved: ${accounts}`);
    if(accounts.length ===0 ){
        console.log('no accounts retrieved');
    }
    res.json({
        accounts
    })
}
module.exports ={
    getContainers
}