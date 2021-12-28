const express = require('express')
const Biography = require("../models/Biography");
const jwt = require("jsonwebtoken");
exports.list = async (req, res) => {
console.log('heryyy');
    try {
        var authorization = req.header('auth-token');
        if (authorization) {
        var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
        var userId = decoded._id;
        }
        const biography = await Biography.find({user_id:userId});
        res.status(200).json(({data:biography,msg:"Biography listed Successfully."}));
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.create = async (req, res) => {

    var authorization = req.header('auth-token');
    if (authorization) {
    var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    var userId = decoded._id;
    }

    const biography = new Biography({
        title:req.body.title,
        description:req.body.description,
        year:req.body.year,
        age:req.body.age,
        user_id: userId
    });


    try {
        const saveBiography = await biography.save();
        res.status(200).json(saveBiography);
    } catch (error) {
        res.status(400).send(error);
    }
}


exports.edit = (req,res) =>{

    Biography.findById(req.params._id)
    .then(biography => {
        if(!biography) {
            return res.status(404).send({
                message: "biography not found with id " + req.params._id
            });
        }
        res.json(biography);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "biography not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find biography with id " + req.params._id
        });
    });
}


exports.update = (req,res) =>{

    // Find note and update it with the request body
    Biography.findByIdAndUpdate(req.params._id, {
        title: req.body.title || false,
        description: req.body.description || false,
    }, {new: true})
    .then(biography => {
        if(!biography) {
            return res.status(404).send({
                message: "biography not found with id " + req.params._id
            });
        }
        res.send(biography);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "biography not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating biography with id " + req.params._id
        });
    });
}



exports.delete = async (req,res) => {

    Biography.findByIdAndRemove(req.params._id)
    .then(biography => {
        if(!biography) {
            return res.status(404).send({
                message: "biography not found with id " + req.params._id
            });
        }
        res.send({message: "biography deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "biography not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete biography with id " + req.params._id
        });
    });
  }