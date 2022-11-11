const express = require('express');
const domainControllers = require('../controller/domain.js');
const router = express.Router();

router.post('/', domainControllers.dm);

module.exports = router;