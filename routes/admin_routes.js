const router = require('express').Router();

const User = require('../models/User');
const verified = require('./verify-token');
const verify = require('../middlewares/admin.js');
const AdminController = require("../controllers/admin/user.js");
const JournalController = require("../controllers/admin/journal.js");

/*-----------------------------------------------------------
| Admin Auth Routes apis
|------------------------------------------------------------*/


router.post('/login',AdminController.login);
router.get('/users',verify.isAdmin,AdminController.UserList);
router.patch('/user/changeStatus/:_id',verify.isAdmin,AdminController.changeStatus);
router.delete('/user/delete/:_id',verify.isAdmin,AdminController.delete);
router.get('/viewuser/:_id',verify.isAdmin,AdminController.viewUser);


/*-----------------------------------------------------------
| Admin Journal Routes apis
|------------------------------------------------------------*/

router.get('/journal/list',verify.isAdmin,JournalController.journal);
router.post('/journal/create',verify.isAdmin,JournalController.create);
router.get('/journal/edit/:_id',verify.isAdmin,JournalController.editJournal);
router.patch('/journal/update/:_id',verify.isAdmin,JournalController.updateJournal);
router.delete('/journal/delete/:_id',verify.isAdmin,JournalController.deleteJournal);



module.exports = router;