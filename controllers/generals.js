const express = require('express');
const GeneralModel = require("../models/GeneralYou");
const GeneralOptionsModel = require("../models/GeneralOptions");
const jwt = require("jsonwebtoken");

exports.createGeneral = async(req,res) =>{

    const generalyou =  new GeneralModel({
        name:req.body.name,
        type:req.body.type,
        text1:req.body.text1,
        text2:req.body.text2,
        text3:req.body.text3,
        text4:req.body.text4,
        user_id:req.body.user_id
    })


    try {
        const savegeneralyou = await generalyou.save();
        res.status(200).json(generalyou);
        } catch (error) {
            res.status(400).send(error);
        }

}

// exports.createGeneralOptions = async(req,res) =>{

//     const generalOptions =  new GeneralOptionsModel({
//         title:req.body.title,
//         generals:req.body.generals,
//         type:req.body.type,
//         user_id:req.body.user_id,
//         order:req.body.order,
//     })


//     try {
//         const saveGeneralOptions = await generalOptions.save();
//         res.status(200).json({data:saveGeneralOptions});
//         } catch (error) {
//             res.status(400).send(error);
//         }

// }

exports.List = async(req,res) =>{
    try {
        var authorization = req.header('auth-token');
        var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
        const generalData = await GeneralModel.find({type:req.params.type})
        res.status(200).json(generalData);
        } catch (error) {
            res.status(400).send(error);
        }
}

exports.OptionList = async(req,res) =>{
    try {
        var authorization = req.header('auth-token');
        var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
        const generalData = await GeneralModel.find({type:req.params.type})
        const generalOptionData = await GeneralOptionsModel.find({user_id:userId,type:req.params.type})
        // await GeneralOptionsModel.remove({})
        res.status(200).json({generalData:generalData,generalOptionData:generalOptionData});
        } catch (error) {
            res.status(400).send(error);
        }
}

exports.update = async(req,res) => {
    try {
        const general =  await GeneralModel.findByIdAndUpdate(req.params._id, req.body, { new: true });
        return res.json({data:general,msg:"general updated successfully"});
     
    } catch (error) {
      return res.status(400).json(error);
    }
}

// exports.updateOptions = async(req,res) => {
//     try {
//         const general =  await GeneralOptionsModel.findByIdAndUpdate(req.params._id, req.body, { new: true });
//         return res.json({data:general,msg:"GeneralOptions updated successfully"});
     
//     } catch (error) {
//       return res.status(400).json(error);
//     }
// }