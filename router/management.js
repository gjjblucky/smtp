const express = require('express');
const domainControllers = require('../management.js');

const router = express.Router();

router.get('/usersData',domainControllers.Users);
router.get('/userAccessData',domainControllers.USERACCESS);
router.get('/authClientsData',domainControllers.OauthClients);
router.get('/loginsData',domainControllers.Logins);

router.get('/AliasesData',domainControllers.Aliases);
router.get('/DomainsData',domainControllers.Domains);
router.get('/MetaDataData',domainControllers.MetaData);
router.get('/OauthAuthorizationsData',domainControllers.OauthAuthorizations);
router.get('/OauthRefreshTokensData',domainControllers.OauthRefreshTokens);
router.get('/OauthTokensData',domainControllers.OauthTokens);
router.get('/apisessionsData',domainControllers.apisessions);
router.get('/demoData',domainControllers.demo);


module.exports = router;