const express = require('express');
const router = express.Router();

const cors = require('cors');
const {getContainers} = require('../controller/containers')
//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3001'
    })
)

router.get('/:username', getContainers);

module.exports = router;