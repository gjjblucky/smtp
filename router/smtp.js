const express = require('express');
const smtpControllers = require('../controller/smtp.js');

const router = express.Router();

router.get('/', smtpControllers.DATA);
router.get('/getLogData', smtpControllers.FetchAllData);

router.get('/pagination',smtpControllers.PAGE)

module.exports = router;