const express = require('express')
const companyControllers = require('../controller/company.js')
const { schemas, middlewareValidation } = require('../middelware/helper.js')

const router = express.Router()

router.post('/addCompany', middlewareValidation(schemas.company), companyControllers.POST)
router.get('/companyId/:id', companyControllers.GET)
router.get('/getAllList', companyControllers.AllList)

module.exports = router
