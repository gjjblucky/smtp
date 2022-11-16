const express = require('express');
const userControllers = require('../controller/user.js');

const router = express.Router();
const {schemas,middlewareValidation} = require("../middelware/helper.js");

router.post('/addUser', middlewareValidation(schemas.user),userControllers.SignUp);
router.post('/userLogin',userControllers.Login);
router.get('/getList',userControllers.GET);

router.post('/forgotPassword', userControllers.forgot);
router.post('/resetPassword', userControllers.reset);

router.post('/changePassword',userControllers.changePassword);
// router.post('/updatePassword',userControllers.updatePassword);

module.exports = router;