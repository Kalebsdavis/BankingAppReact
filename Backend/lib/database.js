let mysql = require("mysql2");

var dbConnectionInfo = require('./connection');

var con = mysql.createConnection({
    host: dbConnectionInfo.host,
    user: dbConnectionInfo.user,
    password: dbConnectionInfo.password,
    port: dbConnectionInfo.port,
    multipleStatements: true
});

con.connect(function(err){
    if(err){
        throw err;
    }
    else{
        console.log("database.js: Connected to server!");
        con.query("CREATE DATABASE IF NOT EXISTS banking_application", function(err,result){
            if(err){
                console.log(err.message);
                throw err;
            }
            console.log("database.js:banking_application database created");
            selectDatabase();
        });
    }
});

function selectDatabase() {
    let sql = "USE banking_application";
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: Selected banking_application database");
        createTables();
        createStoredProcedures();
        addTableData();
      }
    });
}

function createTables() {
    //creating user_types table
        let sql = "CREATE TABLE IF NOT EXISTS user_types (\n" +
        "user_type_id INT NOT NULL AUTO_INCREMENT, \n" +
        "user_type VARCHAR(25) NOT NULL,\n" +
        "PRIMARY KEY (user_type_id)\n" +
        ");";
        con.execute(sql, function(err, results, fields) {
        if (err) {
        console.log(err.message);
        throw err;
        } else {
        console.log("database.js: table user_types created if it didn't exist");
        }
        });
    
    //creating account_types table
        sql = "CREATE TABLE IF NOT EXISTS account_types (\n" +
        "account_type_id INT NOT NULL AUTO_INCREMENT, \n" +
        "account_type VARCHAR(25) NOT NULL,\n" +
        "PRIMARY KEY (account_type_id)\n" +
        ");";
        con.execute(sql, function(err, results, fields) {
        if (err) {
        console.log(err.message);
        throw err;
        } else {
        console.log("database.js: table account_types created if it didn't exist");
        }
        });
    
     // create user table
    sql = "CREATE TABLE IF NOT EXISTS users (\n" +
    "user_id INT NOT NULL AUTO_INCREMENT,\n" +
    "firstname VARCHAR(255) NOT NULL,\n" +
    "lastname VARCHAR(255) NOT NULL,\n" +
    "hashed_password VARCHAR(255) NOT NULL,\n" +
    "user_type_id int NOT NULL,\n"+
    "salt VARCHAR(255) NOT NULL,\n" +
    "username VARCHAR(255) NOT NULL UNIQUE,\n" +
    "PRIMARY KEY (user_id),\n" +
    "FOREIGN KEY (user_type_id) REFERENCES user_types(user_type_id)\n" +
    ");";
    con.execute(sql, function(err, results, fields) {
    if (err) {
    console.log(err.message);
    throw err;
    } else {
    console.log("database.js: table users created if it didn't exist");
    }
    });
        // create account table
    sql = "CREATE TABLE IF NOT EXISTS accounts (\n" +
    "account_id INT NOT NULL AUTO_INCREMENT,\n" +
    "username VARCHAR(255) NOT NULL,\n" +
    "account_type_id int NOT NULL,\n"+
    "balance decimal(10,2) NOT NULL,\n"+
    "PRIMARY KEY (account_id),\n" +
    "FOREIGN KEY (username) REFERENCES users(username),\n" +
    "FOREIGN KEY (account_type_id) REFERENCES account_types(account_type_id)\n" +
    ");";
    con.execute(sql, function(err, results, fields) {
    if (err) {
    console.log(err.message);
    throw err;
    } else {
    console.log("database.js: table accounts created if it didn't exist");
    }
    });

    sql = "CREATE TABLE IF NOT EXISTS transaction_types (\n" +
    "transaction_type_id INT NOT NULL AUTO_INCREMENT, \n" +
    "transaction_type VARCHAR(25) NOT NULL,\n" +
    "PRIMARY KEY (transaction_type_id)\n" +
    ");";
    con.execute(sql, function(err, results, fields) {
    if (err) {
    console.log(err.message);
    throw err;
    } else {
    console.log("database.js: table transaction_types created if it didn't exist");
    }
    });

    sql = "CREATE TABLE IF NOT EXISTS transactions (\n" +
    "transaction_id INT NOT NULL AUTO_INCREMENT,\n" +
    "username VARCHAR(255) NOT NULL,\n" +
    "amount decimal(10,2) NOT NULL,\n"+
    "memo VARCHAR(255) NOT NULL,\n"+
    "time DATETIME NOT NULL,\n"+
    "transaction_type_id int NOT NULL, \n"+
    "account_type_id int NOT NULL,\n"+
    "PRIMARY KEY (transaction_id),\n" +
    "FOREIGN KEY (username) REFERENCES users(username),\n" +
    "FOREIGN KEY (account_type_id) REFERENCES account_types(account_type_id),\n" +
    "FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(transaction_type_id)\n" +
    ");";
    con.execute(sql, function(err, results, fields) {
    if (err) {
    console.log(err.message);
    throw err;
    } else {
    console.log("database.js: table transactions created if it didn't exist");
    }
    });

}

function createStoredProcedures(username){
    //insert user type procedure
            let sql = "CREATE PROCEDURE IF NOT EXISTS `insert_user_type`(\n" +
            "IN user_type VARCHAR(45)\n" +
            ")\n" +
            "BEGIN\n" +
            "INSERT INTO user_types (user_type)\n" +
            "SELECT user_type FROM DUAL\n" +
            "WHERE NOT EXISTS (\n" +
            "SELECT * FROM user_types\n" +
            "WHERE user_types.user_type=user_type LIMIT 1\n" +
            ");\n" +
            "END;";

            con.query(sql, function(err, results, fields) {
            if (err) {
            console.log(err.message);
            throw err;
            } else {
            console.log("database.js: procedure insert_user_type created if it didn't exist");
            }
            });
            //insert transaction types
            sql = "CREATE PROCEDURE IF NOT EXISTS `insert_transaction_type`(\n" +
            "IN transaction_type VARCHAR(45)\n" +
            ")\n" +
            "BEGIN\n" +
            "INSERT INTO transaction_types (transaction_type)\n" +
            "SELECT transaction_type FROM DUAL\n" +
            "WHERE NOT EXISTS (\n" +
            "SELECT * FROM transaction_types\n" +
            "WHERE transaction_types.transaction_type=transaction_type LIMIT 1\n" +
            ");\n" +
            "END;";

            con.query(sql, function(err, results, fields) {
            if (err) {
            console.log(err.message);
            throw err;
            } else {
            console.log("database.js: procedure insert_transaction_type created if it didn't exist");
            }
            });

            sql = "CREATE PROCEDURE IF NOT EXISTS `insert_account_type`(\n" +
            "IN account_type VARCHAR(45)\n" +
            ")\n" +
            "BEGIN\n" +
            "INSERT INTO account_types (account_type)\n" +
            "SELECT account_type FROM DUAL\n" +
            "WHERE NOT EXISTS (\n" +
            "SELECT * FROM account_types\n" +
            "WHERE account_types.account_type=account_type LIMIT 1\n" +
            ");\n" +
            "END;";

            con.query(sql, function(err, results, fields) {
            if (err) {
            console.log(err.message);
            throw err;
            } else {
            console.log("database.js: procedure insert_account_type created if it didn't exist");
            }
            });

            
    //change user type to employee procedure 
            sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_type_to_employee`(\n" +
            "IN username VARCHAR(45)\n"+
            ")\n" +
            "BEGIN\n"+
            "UPDATE users\n"+
            "SET user_type_id = 2\n"+
            "WHERE users.username = username; \n"+
            "END;";
            
            con.query(sql, function(err, results, fields) {
            if (err) {
            console.log(err.message);
            throw err;
            } else {
            console.log("database.js: procedure change_user_type_to_employee created if it didn't exist");
            }
            });
    //change user type to admin procedure 
            sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_type_to_admin`(\n" +
            "IN username VARCHAR(45)\n"+
            ")\n" +
            "BEGIN\n"+
            "UPDATE users\n"+
            "SET user_type_id = 3\n"+
            "WHERE users.username = username; \n"+
            "END;";
            
            con.query(sql, function(err, results, fields) {
            if (err) {
            console.log(err.message);
            throw err;
            } else {
            console.log("database.js: procedure change_user_type_to_admin created if it didn't exist");
            }
            });

    //create accounts for when user registers
                sql = "CREATE PROCEDURE IF NOT EXISTS `create_accounts`(IN `username` varchar(45))\n" +
                "BEGIN\n" +
                "    INSERT INTO accounts (username, account_type_id, balance)\n" +
                "    VALUES (username, 1, 0.00);\n" +
                "    INSERT INTO accounts (username, account_type_id, balance)\n" +
                "    VALUES (username, 2, 0.00);\n" +
                "END;";

            con.query(sql, function(err, results, fields) {
            if (err) {
                console.log(err.message);
                throw err;
            } else {
                console.log("database.js: procedure create_accounts created if it didn't exist");
            }
            });
    
            //get_salt
                    sql = "CREATE PROCEDURE IF NOT EXISTS `get_salt`(\n" +
                    "IN username VARCHAR(255)\n" +
                ")\n" +
                "BEGIN\n" +
                    "SELECT salt FROM users\n" +
                    "WHERE users.username = username\n" +
                    "LIMIT 1;\n" +
                "END;";

                con.query(sql, function(err, results, fields) {
                    if (err) {
                    console.log(err.message);
                    throw err;
                    } else {
                    console.log("database.js: procedure get_salt created if it didn't exist");
                    }
                });
               
               //check credentials
                sql = "CREATE PROCEDURE IF NOT EXISTS `check_credentials`(\n" +
                "IN username VARCHAR(255),\n" +
                "IN hashed_password VARCHAR(255)\n" +
                ")\n" +
                "BEGIN\n" +
                    "SELECT EXISTS(\n" +
                    "SELECT * FROM users\n" +
                    "WHERE users.username = username AND users.hashed_password = hashed_password\n" +
                    ") AS result;\n" +
                "END;";
    
                con.query(sql, function(err, results, fields) {
                    if (err) {
                    console.log(err.message);
                    throw err;
                    } else {
                    console.log("database.js: procedure check_credentials created if it didn't exist");
                    }
                });
            
            
                // create register user procedure set user as customer.
            
            sql = "CREATE PROCEDURE IF NOT EXISTS `register_user`(\n" +
            "IN  firstname VARCHAR(255), \n" +
            "IN  lastname VARCHAR(255), \n" +
            "IN  hashed_password VARCHAR(255), \n" +
            "IN  username VARCHAR(8), \n" +
            "IN  salt VARCHAR(255), \n" +
            "OUT result INT\n" +
            ")\n" +
            "BEGIN\n" +
                "DECLARE nCount INT DEFAULT 0;\n" +
                "SET result = 0;\n" +
                "INSERT INTO users (firstname, lastname, hashed_password, user_type_id, username, salt)\n" +
                    `VALUES (firstname, lastname, hashed_password, 1,username, salt);\n` +
                "CALL create_accounts(username);\n"+
            "END;"
            con.query(sql, function(err, results, fields) {
            if (err) {
            console.log(err.message);
            throw err;
            } else {
            console.log("database.js: procedure register_user created if it didn't exist");
            }
            });

            sql = "CREATE PROCEDURE IF NOT EXISTS `add_transaction`(\n" +
            "IN  username VARCHAR(255), \n" +
            "IN  amount DECIMAL(10,2), \n" +
            "IN  memo VARCHAR(255), \n" +
            "IN  time DATETIME, \n" +
            "IN transaction_type_id int, \n" +
            "IN account_type_id int, \n" +
            "OUT result INT\n" +
            ")\n" +
            "BEGIN\n" +
                "DECLARE nCount INT DEFAULT 0;\n" +
                "SET result = 0;\n" +
                "INSERT INTO transactions (username, amount, memo, time, transaction_type_id, account_type_id)\n" +
                    `VALUES (username, amount, memo, time,transaction_type_id, account_type_id);\n` +
            "END;"
            con.query(sql, function(err, results, fields) {
            if (err) {
            console.log(err.message);
            throw err;
            } else {
            console.log("database.js: procedure register_user created if it didn't exist");
            }
            });

}

function addTableData(){
    //calling user type procedure to get to default.
    sql = "CALL insert_user_type('customer');";
    con.query(sql,function(err,rows){
      if(err){
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added 'customer' to user_type")
    });

    sql = "CALL insert_user_type('employee');";
    con.query(sql,function(err,rows){
      if(err){
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added 'employee' to user_type")
    });

    sql = "CALL insert_user_type('admin');";
    con.query(sql,function(err,rows){
      if(err){
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added 'admin' to user_type")
    });

    sql = "CALL insert_transaction_type('deposit');";
    con.query(sql,function(err,rows){
      if(err){
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added 'deposit' to transaction_type")
    });

    sql = "CALL insert_transaction_type('withdraw');";
    con.query(sql,function(err,rows){
      if(err){
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added 'withdraw' to transaction_type")
    });

    

    sql = "CALL insert_account_type('checking');";
    con.query(sql,function(err,rows){
      if(err){
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added 'checking' to transaction_type")
    });
    sql = "CALL insert_account_type('savings');";
    con.query(sql,function(err,rows){
      if(err){
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added 'savings' to transaction_type")
    });


    

    // //#region added user
        
    //     console.log("adding first user");
    //     sql = `CALL register_user('Kaleb', 'Davis','1a2b3c4d6e','65423487','245678', @result);`
    //     con.execute(sql,function(err,rows){
    //         if(err){
    //         console.log(err.message);
    //         throw err;
    //         }
        
    //     });

    //     // Check the result from the stored procedure
    //     con.query("SELECT @result AS result", function(err, resultRows) {
    //         if (err) {
    //             console.error('Error retrieving result:', err.message);
    //             return res.status(500).render('register', { error: 'Registration failed. Please try again.' });
    //         }

    //         const result = resultRows[0].result;

    //         if (result === 0) {
    //             console.log('User 1 registered successfully');
    //         } else if (result === 1) {
    //             console.log('Username already exists');
    //         }
    //     }); 
    
//#endregion
    
//#region added another user
   
    // console.log("adding second user");
   
    // sql = `CALL register_user('Austin', 'Roach','3a2b5n67', '49856472','098761', @result);`
    // con.execute(sql,function(err,rows){
    //     if(err){
    //       console.log(err.message);
    //       throw err;
    //     }
       
    //   });

      // Check the result from the stored procedure
    //   con.query("SELECT @result AS result", function(err, resultRows) {
    //     if (err) {
    //         console.error('Error retrieving result:', err.message);
    //         return res.status(500).render('register', { error: 'Registration failed. Please try again.' });
    //     }

    //     const result = resultRows[0].result;

    //     if (result === 0) {
    //         console.log('User 2 registered successfully');
    //     } else if (result === 1) {
    //         console.log('Username already exists');
    //     }
    // }); 
    




    //#endregion
    
    //#region third user
    // console.log("adding third user");
    // sql = `CALL register_user('MC', 'Mason','547892','78932457','326578', @result);`
    // con.execute(sql,function(err,rows){
    //     if(err){
    //       console.log(err.message);
    //       throw err;
    //     }
       
    //   });

      // Check the result from the stored procedure
    //   con.query("SELECT @result AS result", function(err, resultRows) {
    //     if (err) {
    //         console.error('Error retrieving result:', err.message);
    //         return res.status(500).render('register', { error: 'Registration failed. Please try again.' });
    //     }

    //     const result = resultRows[0].result;

    //     if (result === 0) {
    //         console.log('User 3 registered successfully');
    //     } else if (result === 1) {
    //         console.log('Username already exists');
    //     }
    // }); 
    
//#endregion
}
function random(){
    var username="";
    for(let i = 0; i<8; i++){
        var char = Math.floor(Math.random() * 10);
        username += char;
}
return username;
}


module.exports = con;