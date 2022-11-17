const express = require('express');
const domainControllers = require('../controller/domain.js');
const {schemas,middlewareValidation} = require("../middelware/helper.js");

const router = express.Router();

router.post('/addDomain', middlewareValidation(schemas.domain),domainControllers.POST);
router.get('/companyId/:id',domainControllers.GET);

module.exports = router;