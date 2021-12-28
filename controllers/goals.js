const express = require('express')
const Goals = require("../models/Goals.js");
const SetGoals = require("../models/SetGoal.js");
const UserIncome = require("../models/UserIncome.js");
const path = require("path")
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  
const jwt = require("jsonwebtoken");

exports.create = async(req,res) => {
  
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
                  cb(null, './uploads/goals');
                },
                filename: function (req, file, cb) {
                  cb(null, file.originalname);
              }
      });
      var upload = multer({
        storage: storage
      }).any();
      
      upload(req, res, async function(err) {
        if (err) {
            return res.end('Error');
        } else {
            const goal = new Goals({
                name: req.body.name,
                required_money: req.body.required_money,
                steps: req.body.steps,
                user_id: req.body.user_id,
                progress: req.body.progress,
                image:req.files[0].originalname,
            });
            try {
                const savegoals = await goal.save();
                return res.status(200).json(savegoals);
                } catch (error) {
                    res.status(400).send(error);
                }
       
        }
      }); 
}

exports.view = (req,res) =>{

    Goals.findById(req.params._id)
    .then(goals => {
        if(!goals) {
            return res.status(404).send({
                message: "Goals not found with id " + req.params._id
            });
        }
        return res.json(goals);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Goals not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find Goals with id " + req.params._id
        });
    });
  }


  exports.list = async (req, res) => {

    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
        //    await Goals.remove({})
        //    await this.setGoal.remove({})
        const goals = await Goals.find({user_id:userId});
        return res.status(200).json(({data:goals,msg:"goals listed Successfully."}));
    } catch (error) {
        return res.status(400).send(error);
    }
  }
}

  exports.update = (req,res) =>{
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
                cb(null, './uploads/goals');
              },
              filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
    });
    var upload = multer({
      storage: storage
    }).any();
    
    upload(req, res, async function(err) {
      if (err) {
          return res.end('Error');
      } else {
          const imageData = req.files && req.files.length ? req.files[0].originalname :req.body.image;
              Goals.findByIdAndUpdate(req.params._id, {
                name: req.body.name,
                required_money: req.body.required_money,
                steps: req.body.steps,
                user_id: req.body.user_id,
                progress: req.body.progress,
                image:imageData,
              }, {new: true})
              .then(goals => {
                  if(!goals) {
                      return res.status(404).send({
                          message: "Goals not found with id " + req.params._id
                      });
                  }
                  return res.status(200).json({data:goals,msg:"Goal updated successfully."});
              });
     
      }
    })
    }

exports.setGoal = async (req,res) => {
  
    try {
        const goalsData = await SetGoals.find({age:req.body.age,user_id:req.body.user_id});
        
        if(goalsData.length > 0){
            var Id = goalsData[0]._id;
            SetGoals.findByIdAndUpdate(Id, {
                age:req.body.age,
                financial_needed:req.body.financial_needed,
                user_id:req.body.user_id,
                goals:req.body.goals,
              }, {new: true})
              .then(goals => {
                  if(!goals) {
                      return res.status(404).send({
                          message: "Goals not found with id " + req.params._id
                      });
                  }
                  return res.status(200).json({data:goals,msg:"Set Goal updated successfully."});
              });
        }else{
            const goaldata = new SetGoals({
                age:req.body.age,
                financial_needed:req.body.financial_needed,
                user_id:req.body.user_id,
                goals:req.body.goals,
            });
            const setgoal = await goaldata.save();
            return res.status(200).json(setgoal);
        }
       
    } catch (error) {
        return res.status(400).send({error});
    }
}

exports.getGoals = async (req,res) => {
    try {

        const goals = await Goals.find();
        return res.status(200).json(goals);
        
    } catch (error) {
        return res.status(400).send({error});
    }
}

exports.getChartData = async (req,res) => {
    try {

        const goals = await SetGoals.find({user_id:req.body.user_id}).populate('goals').populate('age');
        return res.status(200).json({data:goals});
        
    } catch (error) {
        return res.status(400).send({error});
    }
}

exports.setIncome = async (req,res) => {
    try {
        
        const income = new UserIncome({
            age:req.body.age,
            income:req.body.income,
            user_id:req.body.user_id
        });

        const checkData =  await UserIncome.find({age:req.body.age,user_id:req.body.user_id});

        if (checkData.length ===0) {

            const saveIncome = await income.save();
            return res.status(200).json(saveIncome);
        }
        else{
            const Id =  checkData[0]._id;
            const udpateData =  await UserIncome.findByIdAndUpdate(Id, req.body, { new: true });
            return res.status(200).json({udpateData:udpateData,msg:"Updated successfully."});
        }

    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.getIncome = async(req,res) =>{

    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            const userIncome =  await UserIncome.find({user_id:userId});
            // await SetGoals.remove( { } )
            return res.status(200).json({userIncome:userIncome,msg:"userIncome listed successfully."});

    } catch (error) {
        return res.status(400).json(error);
    }
}

}