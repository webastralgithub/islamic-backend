const router = require('express').Router();

const User = require('../models/User');
const verified = require('./verify-token');
const verify = require('../middlewares/admin.js');
const UserController = require("../controllers/user.js");
const BiographyController = require("../controllers/biography.js");
const TodoController = require("../controllers/todos.js");
const DailyUpdateController = require("../controllers/daily_update.js");
const PurificationController = require("../controllers/purification.js");
const DailyIbadahController = require("../controllers/daily_ibadah.js");
const MuhbasabahController = require("../controllers/muhasbah.js");
const GeneralController = require("../controllers/generals.js");
const GoalController = require("../controllers/goals.js");
const InformationController = require("../controllers/informations.js");
const TreeController = require("../controllers/tree.js");
const SettingController = require("../controllers/setting.js");
const ManualPrayerController = require("../controllers/manual_prayer.js");


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
router.patch('/changePin/:_id',UserController.changePin);


// Route for Edit,update User

router.get('/edit/:_id',verified,UserController.editProfile);
router.patch('/update/:_id',verified,UserController.updateProfile);
router.patch('/updateUserImage/:_id',verified,UserController.updateUserImage);
router.get('/checkToken/:token',UserController.checkResetToken);
router.get('/testapi',(req,res) => {
    console.log('tttttt');
    res.send('heyuyyyyishan12shivam');
})


/*-----------------------------------------------------------
| Biography Routes apis
|------------------------------------------------------------*/


router.post('/biography/create/',verified,BiographyController.create);
router.get('/biography/list',verified,BiographyController.list);
router.get('/biography/edit/:_id',verified,BiographyController.edit);
router.patch('/biography/update/:_id',verified,BiographyController.update);
router.delete('/biography/delete/:_id',verified,BiographyController.delete);

/*-----------------------------------------------------------
| 24 hours of my life categories Routes apis
|------------------------------------------------------------*/

router.post('/activityCategory/create',verified,DailyUpdateController.createCategory);
router.get('/activityCategory/list',verified,DailyUpdateController.CategoryList);
router.patch('/activityCategory/update/:_id',verified,DailyUpdateController.updateActivity);




/*-----------------------------------------------------------
| 24 hours of my life Routes apis
|------------------------------------------------------------*/


router.post('/dailyUpdate/create/',verified,DailyUpdateController.create);
router.get('/dailyUpdate/graph/',verified,DailyUpdateController.CategoryListGraph);
router.get('/dailyUpdate/list/',verified,DailyUpdateController.alllist);
router.get('/dailyUpdate/edit/:_id',verified,DailyUpdateController.edit);
router.patch('/dailyUpdate/update/:_id',verified,DailyUpdateController.update);
router.delete('/dailyUpdate/delete/:_id',verified,DailyUpdateController.delete);

/*-----------------------------------------------------------
| Send mail in contact us apis
|------------------------------------------------------------*/

router.post('/contactus',verified,UserController.contactUs);
router.post('/feedback',verified,UserController.feedback);


/*-----------------------------------------------------------
|Purification apis
|------------------------------------------------------------*/

router.post('/purification/create',verified,PurificationController.createPurification);
router.get('/purification/list/:type/:date',verified,PurificationController.list);
router.get('/purification/view/:_id/:date',verified,PurificationController.view);
router.post('/purification/type/create',verified,PurificationController.Typecreate);
router.patch('/purification/type/update/:_id',verified,PurificationController.updateType);
router.patch('/purification/update/:_id',verified,PurificationController.updatePurification);
router.post('/purification/daily/create',verified,PurificationController.create);




/*-----------------------------------------------------------
|Daily Ibadah apis
|------------------------------------------------------------*/

router.post('/daily_ibadah/create',verified,DailyIbadahController.createTypes);
router.post('/prayer/create',verified,DailyIbadahController.createPrayer);
router.patch('/prayer/update/:_id',verified,DailyIbadahController.updatePrayer);
router.post('/prayer/daily/create',verified,DailyIbadahController.createDailyPrayer);
router.post('/daily_ibadah/dashboard',verified,DailyIbadahController.dashboard);
router.get('/daily_ibadah/list/:type/:date',verified,DailyIbadahController.list);
router.get('/daily_ibadah/view/:_id/:date',verified,DailyIbadahController.view);


/*-----------------------------------------------------------
| Dashboard data Routes apis
|------------------------------------------------------------*/

router.post('/dashboard',verified,PurificationController.dashboard);
router.post('/dashboardRange',verified,PurificationController.dashboardRange);


/*-----------------------------------------------------------
| Todos Routes apis
|------------------------------------------------------------*/


router.post('/todo/create/',verified,TodoController.create);
router.get('/todo/list',verified,TodoController.list);
router.get('/todo/edit/:_id',verified,TodoController.edit);
router.patch('/todo/update/:_id',verified,TodoController.update);
router.delete('/todo/delete/:_id',verified,TodoController.delete);


/*-----------------------------------------------------------
| Moods/Muhasbah Routes apis
|------------------------------------------------------------*/


router.post('/moods/create/',verified,MuhbasabahController.createMood);
router.post('/moods/daily/create/',verified,MuhbasabahController.createDailyMood);
router.post('/myaction/daily/create/',verified,MuhbasabahController.createMyaction);
router.post('/conflict/daily/create/',verified,MuhbasabahController.createConflict);
router.get('/mymood/list/:date',verified,MuhbasabahController.list);
router.get('/myaction/list/:date',verified,MuhbasabahController.actionlist);
router.get('/myconflict/list/:date',verified,MuhbasabahController.conflictlist);
router.get('/moods/list',verified,MuhbasabahController.moodList);
router.get('/moodGraph',verified,MuhbasabahController.moodGraph);



/*-----------------------------------------------------------
| General Routes apis
|------------------------------------------------------------*/

router.post('/generalyou/create/',verified,GeneralController.createGeneral);
// router.post('/generalOptions/create/',verified,GeneralController.createGeneralOptions);
router.patch('/generalyou/update/:_id/',verified,GeneralController.update);
// router.patch('/generalOption/update/:_id/',verified,GeneralController.updateOptions);
router.get('/generalyou/list/:type',verified,GeneralController.List);
router.get('/generalOption/list/:type',verified,GeneralController.OptionList);

/*-----------------------------------------------------------
| Goals Route Apis
|------------------------------------------------------------*/

router.post('/goal/create/',verified,GoalController.create);
router.post('/goal/set/',verified,GoalController.setGoal);
router.get('/goal/view/:_id',verified,GoalController.view);
router.get('/goal/list',verified,GoalController.list);
router.patch('/goal/update/:_id',verified,GoalController.update);
router.post('/goalChart/',verified,GoalController.getChartData);
router.post('/setIncome/',verified,GoalController.setIncome);
router.get('/getIncome/',verified,GoalController.getIncome);

/*-----------------------------------------------------------
| Information Route Apis
|------------------------------------------------------------*/

router.post('/info/create/',verified,InformationController.create);
router.patch('/info/update/:_id',verified,InformationController.update);
router.get('/info/view/:_id',verified,InformationController.view);
router.get('/info/list/',verified,InformationController.list);
router.delete('/info/delete/:_id',verified,InformationController.delete);

/*-----------------------------------------------------------
|  Nafs Route Apis
|------------------------------------------------------------*/

router.get('/nafs/view/:_id',verified,UserController.viewNafs);
router.post('/nafs/create',verified,UserController.createNafs);
router.patch('/nafs/update/:_id',verified,UserController.updateNafs);

/*-----------------------------------------------------------
|  Family Tree Route Apis
|------------------------------------------------------------*/


router.post('/relation/create',verified,TreeController.createRelation);
router.get('/relationList',verified,TreeController.relationList);
router.post('/family/add',verified,TreeController.addFamilyMember);
router.get('/memberList',verified,TreeController.memberList);


// Settings Apis

router.post('/setting/create',verified,SettingController.create);
router.get('/setting/view/',verified,SettingController.edit);

// ManualPrayer apis

router.post('/manualprayer/create',verified,ManualPrayerController.createPrayer);
router.post('/manualprayertime/create',verified,ManualPrayerController.createManualTime);
router.put('/manualprayer/edit/:_id',verified,ManualPrayerController.updatePrayer);
router.put('/manualprayertime/edit/:_id',verified,ManualPrayerController.updatePrayerTime);
router.get('/manualprayers/list',verified,ManualPrayerController.prayerList);
router.get('/manualprayerstime/list',verified,ManualPrayerController.prayerTimeList);
router.get('/manualprayerstime/view/:user_id',verified,ManualPrayerController.viewTimeData);



module.exports = router;
