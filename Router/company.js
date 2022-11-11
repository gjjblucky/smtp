const express = require('express');
const companyControllers = require('../controller/company.js');
const router = express.Router();

router.post('/', companyControllers.cmp);

module.exports = router;