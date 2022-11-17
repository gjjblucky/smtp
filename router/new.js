const express = require('express');
const domainControllers = require('../new.js');

const router = express.Router();

router.get('/getUser',domainControllers.GET);

module.exports = router;