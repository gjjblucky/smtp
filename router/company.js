const express = require('express');
const companyControllers = require('../controller/company.js');
const {schemas,middlewareValidation} = require("../middelware/helper.js");

const router = express.Router();

router.post('/addCompany', middlewareValidation(schemas.company),companyControllers.POST);
router.get('/getList',companyControllers.GET);

module.exports = router;