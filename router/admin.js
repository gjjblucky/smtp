
const express = require('express');
const adminControllers = require('../controller/admin.js');
const {schemas,middlewareValidation} = require("../middelware/helper.js");

const router = express.Router();

router.post('/login',middlewareValidation(schemas.admin), adminControllers.SignIn);

module.exports = router;