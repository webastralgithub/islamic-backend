const router = require('express').Router();

const User = require('../models/User');
const verified = require('./verify-token');
const verify = require('../middlewares/admin.js');
const AdminController = require("../controllers/admin/user.js");
const JournalController = require("../controllers/admin/journal.js");
const BookController = require("../controllers/admin/books/book.js");
const ChapterController = require("../controllers/admin/books/chapters.js");
const PurificationController = require("../controllers/admin/books/chapters.js");
const NewsController = require("../controllers/admin/News/news.js");
const BlogController = require("../controllers/admin/blogs/blog.js");
const TvController = require("../controllers/admin/Tv/tv.js");

/*-----------------------------------------------------------
| Admin Auth Routes apis
|------------------------------------------------------------*/


router.post('/login',AdminController.login);
router.get('/users',verify.isAdmin,AdminController.UserList);
router.patch('/user/changeStatus/:_id',verify.isAdmin,AdminController.changeStatus);
router.delete('/user/delete/:_id',verify.isAdmin,AdminController.delete);
router.get('/viewuser/:_id',verify.isAdmin,AdminController.viewUser);


/*-----------------------------------------------------------
| Journal Routes apis
|------------------------------------------------------------*/

router.get('/journal/list',JournalController.journal);
router.post('/journal/create',JournalController.create);
router.get('/journal/edit/:_id',JournalController.editJournal);
router.patch('/journal/update/:_id',JournalController.updateJournal);
router.delete('/journal/delete/:_id',JournalController.deleteJournal);


/*-----------------------------------------------------------
| Book Routes apis
|------------------------------------------------------------*/

router.get('/book/list',verified,BookController.list);
router.post('/book/create',verified,BookController.create);
router.get('/book/view/:_id',verified,BookController.edit);
router.patch('/book/update/:_id',verified,BookController.update);
router.delete('/book/delete/:_id',verify.isAdmin,BookController.delete);




/*-----------------------------------------------------------
| Book Routes apis
|------------------------------------------------------------*/

router.post('/chapter/create',verify.isAdmin,ChapterController.create);
router.get('/chapter/:book_id/list',ChapterController.list);
router.delete('/chapter/delete/:_id',verify.isAdmin,ChapterController.delete);
router.get('/chapter/view/:_id',ChapterController.edit);
router.patch('/chapter/update/:_id',verify.isAdmin,ChapterController.update);

/*-----------------------------------------------------------
| Purification Routes
|------------------------------------------------------------*/

router.post('/purification/create',verified,PurificationController.create);



/*-----------------------------------------------------------
| Blog Routes apis
|------------------------------------------------------------*/

router.get('/blog/list',verified,BlogController.list);
router.post('/blog/create',verified,BlogController.create);
router.get('/blog/view/:_id',verified,BlogController.edit);
router.patch('/blog/update/:_id',verified,BlogController.update);
router.delete('/blog/delete/:_id',verify.isAdmin,BlogController.delete);



/*-----------------------------------------------------------
| News Routes apis
|------------------------------------------------------------*/

router.get('/news/list',verified,NewsController.list);
router.post('/news/create',verified,NewsController.create);
router.get('/news/view/:_id',verified,NewsController.edit);
router.patch('/news/update/:_id',verified,NewsController.update);
router.delete('/news/delete/:_id',verify.isAdmin,NewsController.delete);



/*-----------------------------------------------------------
| News Routes apis
|------------------------------------------------------------*/

router.get('/tv/list',verified,TvController.list);
router.post('/tv/create',verified,TvController.create);
router.get('/tv/view/:_id',verified,TvController.edit);
router.patch('/tv/update/:_id',verified,TvController.update);
router.delete('/tv/delete/:_id',verify.isAdmin,TvController.delete);


module.exports = router;