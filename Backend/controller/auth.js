const {hashPassword, comparePasswords} = require('../helpers/auth.js');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
var dbCon = require('../lib/database');
const jwt = require('jsonwebtoken');

//#region register endpoint
const register =async(req,res)=>{
    console.log('recieved data: ',req.body);
    try{
        const {firstname,lastname, username, email,password} = req.body;
        //Check if name was entered
        if(!firstname || !lastname){
            return res.json({
                error: 'name fields are required'
            })
        };
        //check for password
        if(!password){
            return res.json({
                error: "password is required"
            })
        };
        //check email
        console.log('searching for email duplicates', {email});
        let sql ='SELECT email FROM users WHERE email = ?'
        const [emailFetch] = await dbCon.promise().query(sql,[email])
            if(emailFetch.length > 0){
                return res.json({
                    error: "username already exists"
                })
            }
            console.log("email did not exist");    
        

       //hash password for db check helper folder to view function
        const hashedPassword = await hashPassword(password);
        //create user in sql database
        sql = 'CALL register_user(?,?,?,?,?,@result); SELECT @result';
        const [registerUser] = await dbCon.promise().query(sql,
            [
            firstname,
            lastname,
            username,
            email,
            hashedPassword
        ])

        if(registerUser.length > 0){
            console.log('user created succesful', registerUser);
            return res.json(registerUser)
        }        
    }catch(error){
        console.log("error", error);
    }
}


//#region login endpoint
const loginUser =async(req,res) =>{
    try {
        const { username, password } = req.body;
        console.log(`Package:\n\tUsername: ${username}\n\tPassword: ${password}`);


        // Check if user exists
        const sql = "SELECT * FROM users WHERE username = ?";
        const [results] = await dbCon.promise().query(sql, [username]);

        if (results.length === 0) {
            return res.json({ error: `User ${username} not found.` });
        }

        const user = results[0]; // First row of the result
        const retrievedPass = user.hashed_password; // Get stored hashed password

        console.log(`Retrieved Pass: ${retrievedPass}\n hashed: ${password}`);

        // Compare hashed passwords
        const match = await comparePasswords(password,retrievedPass );

        if (match) {
            // Generate JWT token
            jwt.sign(
                {
                    email: user.email,
                    id: user.user_id,
                    username: user.username,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    user_type_id: user.user_type_id
                },
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie("token", token).json(user);
                }
            );
        } else {
            return res.json({ error: "Incorrect password" });
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    }

//#endregion login endpoint
//#region used to decode the cookie for userContext.jsx
const checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ loggedIn: false, error: "Not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ loggedIn: false, error: "Invalid token" });
        }
        res.json({ loggedIn: true, user: decoded }); // Send decoded user info
    });
};

//#region log out user
const logOutUser = (req,res) =>{
    res.clearCookie('token');
    return res.json({message: 'Logged out succesful'});
}
//#endregion log out user
module.exports={
    loginUser,
    register,
    checkAuth,
    logOutUser
}