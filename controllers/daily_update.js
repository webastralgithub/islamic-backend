const express = require('express')
const DailyUpdate = require("../models/DailyUpdate");
const ActivityCategory = require("../models/ActivityCategory");
const jwt = require("jsonwebtoken");


exports.alllist = async (req, res) => {
    var authorization = req.header('auth-token');
    if (authorization) {
    var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    var userId = decoded._id;
    // await DailyUpdate.remove({})
    }
    DailyUpdate.
    find({user_id:userId}).
    populate('activitycategories').
    exec(function (err, dailyUpdate) {
        if (err) return handleError(err);
        return res.status(200).json(({data:dailyUpdate,msg:"dailyUpdate listed Successfully."}));
    });
}
 
exports.create = async (req, res) => {

    var authorization = req.header('auth-token');
    if (authorization) {
    var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    var userId = decoded._id;
    }
    var date = new Date();
    const today = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    const dailyUpdate = new DailyUpdate({
        description:req.body.description,
        consumed_hrs:req.body.consumed_hrs,
        activitycategories:req.body.activitycategories,
        user_id:userId,
        date:today
    });
    const count =  await DailyUpdate.aggregate(
        [{
           $match: {
              created_at: {
                 $lte: new Date(),
              }
           }
        }, {
     $group: {
         _id:null,
        totalHours: {
           $sum: "$consumed_hrs"
        },
        data_count: {
           $sum: 1
        }
     }
     }]
     );
     
 
    const CheckData = await DailyUpdate.find({"date":today,"activitycategories":req.body.activitycategories});
    if (CheckData.length === 0) {
        try {
            // if((count[0].totalHours +req.body.consumed_hrs) > 24) return res.status(400).json('Please decresse hours time');
             const saveDailyUpdate = await dailyUpdate.save();
             return res.status(200).json(saveDailyUpdate);
        } catch (error) {
            res.status(400).send(error);
        }
    
    } else {
    //    if((count[0].totalHours + CheckData[0].consumed_hrs) > 24) return res.status(400).json('Please descrease hours time');
       
    const Id = CheckData[0]._id;
        DailyUpdate.findByIdAndUpdate(Id, {
            description: req.body.description || false,
            consumed_hrs:req.body.consumed_hrs || false,
            activitycategories:req.body.activitycategories,
            date:today,
        }, {new: true})
        .then(dailyUpdate => {
            if(!dailyUpdate) {
                return res.status(404).send({
                    message: "DailyUpdate not found with id " + req.params._id
                });
            }
            return res.status(200).json({data:dailyUpdate,msg:"updated successfully"});
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "DailyUpdate not found with id " + req.params._id
                });                
            }
            return res.status(500).send({
                message: "Error updating DailyUpdate with id " + req.params._id
            });
        });
    }


}


exports.edit = (req,res) =>{

    DailyUpdate.findById(req.params._id)
    .then(dailyUpdate => {
        if(!dailyUpdate) {
            return res.status(404).send({
                message: "DailyUpdate not found with id " + req.params._id
            });
        }
        res.json(dailyUpdate);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "DailyUpdate not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find DailyUpdate with id " + req.params._id
        });
    });
}


exports.update = (req,res) =>{
    DailyUpdate.findByIdAndUpdate(req.params._id, {
        // title: req.body.title || false,
        description: req.body.description || false,
        consumed_hrs:req.body.consumed_hrs || false,
        activitycategories:req.body.activitycategories
    }, {new: true})
    .then(dailyUpdate => {
        if(!dailyUpdate) {
            return res.status(404).send({
                message: "DailyUpdate not found with id " + req.params._id
            });
        }
        res.send(dailyUpdate);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "DailyUpdate not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating DailyUpdate with id " + req.params._id
        });
    });
}



exports.delete = async (req,res) => {

    DailyUpdate.findByIdAndRemove(req.params._id)
    .then(dailyUpdate => {
        if(!dailyUpdate) {
            return res.status(404).send({
                message: "DailyUpdate not found with id " + req.params._id
            });
        }
        res.send({message: "DailyUpdate deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "DailyUpdate not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete DailyUpdate with id " + req.params._id
        });
    });
  }

  exports.createCategory = async (req, res) => {

    const DailyUpdateCategory = new ActivityCategory({
        title:req.body.title,
        color:req.body.color,
    });


    try {
        const saveDailyUpdateCategory = await DailyUpdateCategory.save();
        res.status(200).json(saveDailyUpdateCategory);
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.CategoryList = async (req, res) => {

    try {
        const DailyUpdate = await ActivityCategory.find();
        res.status(200).json(({data:DailyUpdate,msg:"ActivityCategory listed Successfully."}));
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.CategoryListGraph = async (req,res) => {
    const count =  await DailyUpdate.aggregate(
        [{
           $match: {
              created_at: {
                 $lte: new Date(),
              }
           }
        }, {
     $group: {
         _id:null,
        totalHours: {
           $sum: "$consumed_hrs"
        },
        data_count: {
           $sum: 1
        }
     }
     }]
     );
     const CategoryList = await ActivityCategory.find();
    const DailyUpdateData = await DailyUpdate.find({"created_at":{"$lte":new Date()}}).populate('activitycategories')
      res.status(200).json(({data:DailyUpdateData,info:count,CategoryList:CategoryList}));
}


exports.updateActivity = async(req,res) =>{

    try {
        const activityCategory =  await ActivityCategory.findByIdAndUpdate(req.params._id, req.body, { new: true });
        return res.json({data:activityCategory,msg:"general updated successfully"});
     
    } catch (error) {
      return res.status(400).json(error);
    }
}
