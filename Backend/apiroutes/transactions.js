const express = require('express');
const router = express.Router();

const cors = require('cors');
const {deposit, withdraw, getHistory} = require('../controller/transactions');

//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3001'
    })
)

router.post('/deposit', deposit);

router.post('/withdraw', withdraw);

router.get('/history', getHistory);

module.exports = router;