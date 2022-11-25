const express = require('express')
const managementControllers = require('../controller/management.js')

const router = express.Router()

router.get('/usersData', managementControllers.Users)
router.get('/userAccessData', managementControllers.userAccess)
router.get('/authClientsData', managementControllers.OauthClients)
router.get('/loginsData', managementControllers.Logins)

router.get('/AliasesData', managementControllers.Aliases)
router.get('/DomainsData', managementControllers.Domains)
router.get('/MetaDataData', managementControllers.MetaData)
router.get('/OauthAuthorizationsData', managementControllers.OauthAuthorizations)
router.get('/OauthRefreshTokensData', managementControllers.OauthRefreshTokens)
router.get('/OauthTokensData', managementControllers.OauthTokens)
router.get('/apisessionsData', managementControllers.apisessions)
router.get('/demoData', managementControllers.demo)

module.exports = router
