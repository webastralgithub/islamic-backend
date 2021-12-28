const express = require('express')
const DailyIbadahTypes = require("../models/DailyIbadahTypes");
const DailyPrayer = require("../models/DailyPrayer");
const PrayerModel = require("../models/Prayers");
const jwt = require("jsonwebtoken");

exports.createTypes = async (req, res) => {

    const types =  new DailyIbadahTypes ({
        name:req.body.name,
        purification:req.body.purification,
        type:req.body.type,
    })

}

exports.createPrayer = async (req, res) => {

    const Prayers =  new PrayerModel ({
        title:req.body.title,
        type:req.body.type,
        default_options:req.body.default_options,
    })
    try {
        const savePrayers = await Prayers.save();
        res.status(200).json(savePrayers);
        } catch (error) {
            res.status(400).send(error);
        }
}

exports.createDailyPrayer = async (req, res) => {

    const DailyPrayers =  new DailyPrayer ({
        prayer:req.body.prayer,
        type:req.body.type,
        options:req.body.options,
        user_id:req.body.user_id,
        date:req.body.date,
        rating:req.body.rating,
    })
    const Checkdata = await DailyPrayer.find({user_id:req.body.user_id,date:req.body.date,type:req.body.type,prayer:req.body.prayer });
       if (Checkdata.length === 0) {
        try {
        
            const saveDailyPrayers = await DailyPrayers.save();
            res.status(200).json(saveDailyPrayers);
            } catch (error) {
                res.status(400).send(error);
            }
       }
       else{
        var Id= Checkdata[0]._id;
        try {
            const purification =  await DailyPrayer.findByIdAndUpdate(Id, req.body, { new: true });
            return res.json({data:purification,msg:"DailyPrayer updated successfully"});
         
        } catch (error) {
          return res.status(400).json(error);
        }

       }
   

}

exports.dashboard = async (req,res) => {
    var authorization = req.header('auth-token');
 
    if (authorization) {
      var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
      var userId = decoded._id;
      try {
        const docs = await DailyPrayer.aggregate(
          [
          
          { $match : {date:req.body.date,user_id:userId} },
          
             { $group: {
                "_id": "$type",
               totalRatings: { $sum: "$rating", },
               count: { $sum: 1 },
              }
            }
          ]
        
          );
  
      // const count = await PrayerModel.countDocuments();
  
          return res.json({data:docs,numberofSegment:8, msg:"dashboard data displayed."});
    } catch (error) {
      return res.status(400).json(error);
    }
      }
      
}

exports.list = async (req, res) => {
    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            const PrayerListData = await PrayerModel.find({type:req.params.type});
            await DailyPrayer.find({type:req.params.type,date:req.params.date,user_id:userId}).populate({
              path: 'prayer',
             // match: { date:req.params.date,user_id:userId }
          }).exec(function (err, data) {
                if (err) return handleError(err);
               return res.status(200).json(({data:data,PrayerListData:PrayerListData,msg:"Data listed Successfully."}));
            });
                     
        } catch (e) {
          console.log(e);
            return res.status(401).json(e);
        }
      }
  
  }
  

  exports.view = async (req,res) => {

    try {
  
      var authorization = req.header('auth-token');
      var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
      var userId = decoded._id;
      const dailyprayer = await DailyPrayer.find({ prayer: req.params._id,user_id:userId,date:req.params.date});
      if(dailyprayer.length === 0){
  
        const prayerlist = await DailyPrayer.find({ prayer: req.params._id,user_id:userId}).sort({'date': -1}).limit(1);
        return res.status(200).json(({data: prayerlist.length == 0 ? await PrayerModel.find({_id:req.params._id}):prayerlist,msg:"purification data Successfully."}));
      }
      return res.status(200).json(({data:dailyprayer,msg:"dailyprayer data Successfully."}));
    } catch (error) {
       return res.status(400).json(error);
    }
      
  }

  exports.updatePrayer = async(req,res) => {
    const prayer =  await PrayerModel.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.json({data:prayer,msg:"Prayer updated successfully"});
  }