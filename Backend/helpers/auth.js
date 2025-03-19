const bcrypt = require('bcrypt');

//#region Salt/Hash
//generates a salt then hashes password with the salt
const hashPassword = (password) => {
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(12,(err,salt)=>{
            if(err){
                reject(err)
            }
            bcrypt.hash(password, salt, (err,hash)=>{
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}
//#endregion Salt/Hash

//#region Compare Passwords
//compare passwords for login authentication
const comparePasswords = (password, hashed) => {
   
    return bcrypt.compare(password, hashed)
}
//#endregion Compare Passwords


module.exports = {
    hashPassword,
    comparePasswords
}