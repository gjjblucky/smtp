const express = require('express');
const domainControllers = require('../controller/domain.js');
const router = express.Router();
const {schemas,middlewareValidation} = require("../middelware/helper.js");

router.post('/addDomain', middlewareValidation(schemas.domain),domainControllers.POST);
router.get('/getList',domainControllers.GET);

module.exports = router;