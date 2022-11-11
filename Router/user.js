const express = require('express');
const clientControllers = require('../controller/user.js');
const router = express.Router();

router.post('/Add-user', clientControllers.SignUp);
router.post('/login', clientControllers.Login);

module.exports = router;