
const express = require('express');

const adminControllers = require('../controller/admin.js');

const router = express.Router();

router.post('/signup', adminControllers.SignUp);
router.post('/login', adminControllers.Login);

module.exports = router;