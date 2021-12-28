const express = require('express');
const SettingModel = require("../models/Setting");
const jwt = require("jsonwebtoken");
const exp = require('constants');


exports.create = async (req,res) =>{
    const settings =  new SettingModel({
        city:req.body.city,
        country:req.body.country,
        go_to:req.body.go_to,
        timing:req.body.timing,
        high_lat_method:req.body.high_lat_method,
        prayer_method:req.body.prayer_method,
        asr_method:req.body.asr_method,
        user_id:req.body.user_id,

    });

    const checkData = await SettingModel.find({user_id:req.body.user_id});
    // return false;

    if(checkData.length === 0){


        try {
            const savesettings = await settings.save();
            res.status(200).json(savesettings);
            } catch (error) {
                res.status(400).send(error);
            }

    }
    else{
        const Id = checkData[0]._id;
        try {
            const updatesettings =  await SettingModel.findByIdAndUpdate(Id, req.body, { new: true });
            return res.json({data:updatesettings,msg:"Setting updated successfully"});
         
        } catch (error) {
          return res.status(400).json(error);
        }
    }

}

exports.edit = async (req,res) => {
    var authorization = req.header('auth-token');
 
    if (authorization) {
      var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
      var userId = decoded._id;
    try {

    const checkData = await SettingModel.find({user_id:userId});

        return res.status(200).json(checkData);

    } catch (error) {

          return res.status(400).json(error);
        
    }
}

}


