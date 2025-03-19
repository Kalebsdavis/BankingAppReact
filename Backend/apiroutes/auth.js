const express = require('express');
const router = express.Router();

const cors = require('cors');
const {loginUser, register} = require('../controller/auth')
//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:4000'
    })
)

router.post('/register', register);

router.post('/login', loginUser);



module.exports = router;
