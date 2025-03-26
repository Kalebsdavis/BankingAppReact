const express = require('express');
const router = express.Router();

const cors = require('cors');
const {loginUser, register, checkAuth, logOutUser} = require('../controller/auth')
//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3001'
    })
)

router.post('/register', register);

router.post('/login', loginUser);

router.get('/logged_in', checkAuth);

router.post('/logout', logOutUser);



module.exports = router;
