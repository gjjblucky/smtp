const express = require('express');
const domainControllers = require('../management.js');

const router = express.Router();

router.get('/usersData',domainControllers.Users);
router.get('/userAccessData',domainControllers.USERACCESS);
router.get('/authClientsData',domainControllers.OauthClients);
router.get('/loginsData',domainControllers.Logins);


module.exports = router;