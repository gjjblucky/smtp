const express = require('express');
const userControllers = require('../controller/user.js');
const {schemas,middlewareValidation} = require("../middelware/helper.js");

const router = express.Router();

router.post('/addUser', middlewareValidation(schemas.user),userControllers.SignUp);
router.post('/userLogin',userControllers.Login);
router.get('/companyId/:id',userControllers.GET);
router.post('/forgotPassword', middlewareValidation(schemas.forgot),userControllers.forgot);
router.post('/resetPassword', middlewareValidation(schemas.reset),userControllers.reset);
router.post('/changePassword',middlewareValidation(schemas.change),userControllers.changePassword);
router.post('/deleteUser/:id',userControllers.delete)

module.exports = router;