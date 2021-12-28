const express = require('express')
const InformationModel = require("../models/Information.js");
const jwt = require("jsonwebtoken");


exports.create = async (req,res) => {
    const information = new InformationModel({
        title:req.body.title,
        description:req.body.description,
    })
    try {
        const saveinformation = await information.save();
        return res.status(200).json(saveinformation)
    } catch (error) {
        return res.status(400).json(error)
    }
}

exports.view = async (req,res) => {
    try {
        const informationData = await InformationModel.findOne({_id:req.params._id});
        // console.log(informationData);
        if(!informationData) return res.status(404).json('No Information Found');
        return res.status(200).json({data:informationData})
    } catch (error) {
        return res.status(400).json(error)
    }
}

exports.update = async (req,res) =>{
    InformationModel.findByIdAndUpdate(req.params._id, {
        title: req.body.title,
        description: req.body.description,
      
      }, {new: true})
      .then(info => {
          if(!info) {
              return res.status(404).send({
                  message: "info not found with id " + req.params._id
              });
          }
          return res.status(200).json({data:info,msg:"info updated successfully."});
      });
}

exports.list = async(req,res) => {
    try {
        const listing = await InformationModel.find();
        return res.status(200).json({data:listing,msg:"info listing successfully."});
    } catch (error) {
        return res.status(400).json(error)
    }
}

exports.delete = async (req,res) => {

    InformationModel.findByIdAndRemove(req.params._id)
    .then(info => {
        if(!info) {
            return res.status(404).send({
                message: "info not found with id " + req.params._id
            });
        }
        res.send({message: "info deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "info not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete info with id " + req.params._id
        });
    });
  }
