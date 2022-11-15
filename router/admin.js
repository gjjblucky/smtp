
const express = require('express');
const adminControllers = require('../controller/admin.js');
const router = express.Router();
const {schemas,middlewareValidation} = require("../middelware/helper.js");

router.post('/login',middlewareValidation(schemas.admin), adminControllers.SignIn);

module.exports = router;