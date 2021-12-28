const express = require('express');
const ManualPrayerModal = require("../models/ManualPrayer");
const ManualPrayerTimeModal = require("../models/ManualPrayerTime");
const jwt = require("jsonwebtoken");
const exp = require('constants');

exports.createPrayer = async (req,res) =>{


    const prayers =  new ManualPrayerModal({
        title:req.body.title,

    });

    try {
        const savePrayers = await prayers.save();
        res.status(200).json(savePrayers);
        } catch (error) {
            res.status(400).send(error);
        }


}


exports.updatePrayer = async (req,res) =>{


    try {
        const updatePrayer =  await ManualPrayerModal.findByIdAndUpdate(req.params._id, req.body, { new: true });
        return res.json({data:updatePrayer,msg:"Prayer updated successfully"});
     
    } catch (error) {
      return res.status(400).json(error);
    }


}


exports.createManualTime = async (req,res) =>{

    // await ManualPrayerTimeModal.remove({})
    // return false;
    const checkData = await ManualPrayerTimeModal.find({user_id:req.body.user_id});

    const prayers =  new ManualPrayerTimeModal({
        type1:req.body.type1,
        type2:req.body.type2,
        type3:req.body.type3,
        type4:req.body.type4,
        type5:req.body.type5,
        type6:req.body.type6,
        user_id:req.body.user_id,    
        set_alarm:req.body.set_alarm,    

    });
    if (checkData.length == 0)  {
        try {
            const savePrayers = await prayers.save();
            res.status(200).json({data: savePrayers,msg:"Manual Prayer time Created"});
            } catch (error) {
                res.status(400).send(error);
            }
    } else {
        const Id = checkData[0]._id;
        try {
            const updatePrayer =  await ManualPrayerTimeModal.findByIdAndUpdate(Id, req.body, { new: true });
            return res.json({data:updatePrayer,msg:"Manual Prayer time updated successfully"});
         
        } catch (error) {
          return res.status(400).json(error);
        }
    }
    

}


exports.updatePrayerTime = async (req,res) =>{


    try {
        const updatePrayer =  await ManualPrayerTimeModal.findByIdAndUpdate(req.params._id, req.body, { new: true });
        return res.json({data:updatePrayer,msg:"Manual Prayer time updated successfully"});
     
    } catch (error) {
      return res.status(400).json(error);
    }


}




exports.prayerList = async (req,res) =>{


    try {
        const prayerlist =  await ManualPrayerModal.find();
        return res.json({data:prayerlist,msg:"Prayer Listed successfully"});
     
    } catch (error) {
      return res.status(400).json(error);
    }


}



exports.prayerTimeList = async (req,res) =>{
    var authorization = req.header('auth-token');

    if (authorization) {
        var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
        var userId = decoded._id;
      try {
        //await ManualPrayerTimeModal.remove();
        const prayerlist =  await ManualPrayerTimeModal.find({user_id:userId}).populate('type1.type').populate('type2.type').populate('type3.type').populate('type4.type').populate('type5.type');
        return res.json({data:prayerlist,msg:"Prayer Listed successfully"});
     
    } catch (error) {
      return res.status(400).json(error);
    }
    }

}



exports.viewTimeData = async (req,res) =>{
console.log(req.params.user_id);

    try {
        const manualPrayerData =  await ManualPrayerTimeModal.find({user_id:req.params.user_id});
        return res.json({data:manualPrayerData,msg:"Prayer Listed successfully"});
     
    } catch (error) {
      return res.status(400).json('error');
    }


}