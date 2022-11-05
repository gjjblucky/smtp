
const express = require('express');

const userControllers = require('../controller/smtp.js');

const router = express.Router();

router.get('/', userControllers.DATA);
router.get('/fetchalldata', userControllers.FetchAllData);

module.exports = router;