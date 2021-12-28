const express = require('express')
const User = require("../../models/User");
const verified = require("../../routes/verify-token");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require('../../transports/transport.js');
const path = require("path")
var multer = require('multer');
const { registrationvalidation, loginValidation } = require("../../validation");
const saltRounds = 10;
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());   


exports.UserList = async (req, res) => {

    try {
        const UserList = await User.find({user_role:'user'});
        // res.send(UserList);
        res.status(200).json(({data:UserList,msg:"User listed Successfully."}));
    } catch (error) {
        res.status(400).send(error);
    }
     
};



exports.login = async (req, res) => {

    const { error } = loginValidation(req.body);
  
    if (error) return res.status(400).send(error.details[0].message);
  
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) return res.status(400).json({msg:"Email or password is not correct"});
    if (user.user_role === 'user') return res.status(400).json({msg:"You are not allowed to logged in here."});
  
    const valid_password = bcrypt.compareSync(req.body.password, user.password);
  
    if (!valid_password) return res.status(400).send("Incorrect Password");
  
    // Create token
  
    const token = jwt.sign({ _id: user._id,role:user.user_role }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).json({auth_token:token,msg:"Login successfully"});
  
    
  };

  exports.changeStatus = async (req,res) =>{

    const checkStatus = await User.findOne({ _id: req.params._id });
    // console.log(checkStatus.status);
    var status = checkStatus.status == false ? true :false;

    // Find note and update it with the request body
    User.findByIdAndUpdate(req.params._id, {
        status: status || false
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });
        }
        res.json({user:'user status changed'});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params._id
        });
    });
  }

  exports.delete = async (req,res) => {

    User.findByIdAndRemove(req.params._id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params._id
        });
    });
  }

  exports.viewUser = async (req,res) => {

    User.findById(req.params._id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });
        }
        res.json(user);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find user with id " + req.params._id
        });
    });
  }