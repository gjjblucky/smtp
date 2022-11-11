
const express = require('express');
const adminControllers = require('../controller/admin.js');
const router = express.Router();

router.post('/', adminControllers.SignUp);

module.exports = router;