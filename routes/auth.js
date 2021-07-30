const router = require('express').Router();

const User = require('../models/User');
const verified = require('./verify-token');
const verify = require('../middlewares/admin.js');
const UserController = require("../controllers/user.js");


router.post('/register',UserController.registerUser);
router.post('/login',UserController.login);
router.patch('/reset/:_id',UserController.resetPassword);
router.patch('/create_pin/:_id',verified,UserController.createPin);
router.get('/users',verified,UserController.UserList);
router.post('/pin_login',verified,UserController.loginByPin);
router.post('/forget_password',UserController.forgetPassword);
router.post('/forgetPin',UserController.forgetPin);
router.post('/me',verified,UserController.me);
router.patch('/changePassword/:_id',verified,UserController.chnagePassword);
router.patch('/resetPin/:_id',UserController.resetPin);



// Route for Edit,update User

router.get('/edit/:_id',verified,UserController.editProfile);
router.patch('/update/:_id',verified,UserController.updateProfile);
router.patch('/updateUserImage/:_id',verified,UserController.updateUserImage);
router.get('/checkToken/:token',UserController.checkResetToken);





module.exports = router;