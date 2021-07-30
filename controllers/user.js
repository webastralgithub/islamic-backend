const express = require('express')
const User = require("../models/User");
const verified = require("../routes/verify-token");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require('../transports/transport.js');
const path = require("path")
var multer = require('multer');
const { registrationvalidation, loginValidation } = require("../validation");
const saltRounds = 10;
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());   

exports.UserList = async (req, res) => {

    try {
        const UserList = await User.find();
        // res.send(UserList);
        res.status(200).json(({data:UserList,msg:"User listed Successfully."}));
    } catch (error) {
        res.status(400).send(error);
    }
     
};

exports.registerUser = async (req, res) => {

    const { error } = registrationvalidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) return res.status(400).send("Email already Exists");

    // Hash Password

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        user_role: req.body.user_role,
        token: req.body.token,
        mobile_number: req.body.mobile_number,
        birthday:req.body.birthday,
        password: req.body.password,
        resetPasswordExpires:'null',
        resetPasswordToken:'',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    try {
        const saveduser = await user.save();
        res.status(200).json(({data:saveduser,msg:"User Registered Successfully."}));
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.login = async (req, res) => {

  const { error } = loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({msg:"Email or password is not correct"});

  const valid_password = bcrypt.compareSync(req.body.password, user.password);

  if (!valid_password) return res.status(400).send("Incorrect Password");

  // Create token

  const token = jwt.sign({ _id: user._id,role:user.user_role }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).json({auth_token:token,msg:"Login successfully"});

  
};

exports.resetPassword = async (req, res) => {

  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(req.body.new_password, salt);
  const user = await User.findOne({ _id: req.params._id });
  // const valid_password = bcrypt.compareSync(req.body.current_password, user.password);
  // if (!valid_password) return res.status(400).json({msg:"Incorrect Password"});

  // console.log(valid_password);return;

  try {
    if (req.body.new_password === req.body.confirm_password) {
      const updatedUser = await User.updateOne(
        { _id: req.params._id },
        { $set: { password: hasedPassword } }
      );
      res.json({data:updatedUser,msg:"Password Reset Successfull"});
    } else {
      res.status(400).json({msg:"Password Not Matched!!"});
    }
  } catch (error) {
    res.status(400).send(error);
  }

};

exports.createPin = async (req, res) => {

  try {
    if (req.body.token === req.body.confirm_token) {
      const updatedToken = await User.updateOne(
        { _id: req.params._id },
        { $set: { token: req.body.token } }
      );

      res.json({data:updatedToken,msg:"token created successfully"});
    } else {
      res.json({msg:"Token Not matched"});
    }
  } catch (error) {
    res.status(400).send(error);
  }

};

exports.loginByPin = async (req, res) => {

    const pinExist = await User.findOne({ token: req.body.token });

    try {
        if (pinExist) {
        //   res.json({"msg": "Hey You logged in!!",'status':200});
          res.status(200).json(({msg:"Hey You logged in!!"}));
        } else {
        //   res.send("Token Not matched");
          res.status(400).json(({msg:"Token Not matched !"}));
        }
      } catch (error) {
        res.status(400).send(error);
      }
}


exports.forgetPassword = async (req, res) => {

    const emailExist = await User.findOne({ email: req.body.email });
    // console.log(emailExist._id);

    if (!emailExist) return res.status(400).json({msg: "Email not found in db"});

    const token = crypto.randomBytes(20).toString('hex');
    const update =await User.updateOne(
        {email: req.body.email},
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 360000,
          }
        }
      );
    console.log(update);
    const Link = "<a href='http://112.196.64.119:4200/reset/?id="+ emailExist._id +"&&token=" + token + "'>Click Here</a>";
    const message = 'Please click on the following link,'  + Link + ' or paste this into your browser to complete the process:\n\n' 
    'If you did not request this, please ignore this email and your password will remain unchanged.\n';
    transporter.sendMailFunction(req.body.email,'Reset Password Link',message);
    res.status(200).json({msg:"reset link send successfully"});

}

exports.me = async (req,res) => {
  
  var authorization = req.header('auth-token');
  if (authorization) {
      try {
          var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
          console.log(decoded);
      } catch (e) {
          return res.status(401).send('unauthorized');
      }
      var userId = decoded._id;
      // Fetch the user by id 
     const user = await User.findOne({ _id: userId });
     res.status(200).json(user);
  }
  return res.send('Server Error');

}

exports.editProfile = async (req,res) => {

  const user = await User.findOne({ _id: req.params._id });
  res.status(200).json(user);
}

exports.updateProfile = async (req,res) => {

  try {
      const updatedUser =  await User.findByIdAndUpdate(req.params._id, req.body, { new: true });
      console.log(updatedUser);
      res.json(updatedUser);
   
  } catch (error) {
    res.status(400).send(error);
  }
  
}


exports.updateUserImage = async (req,res) => {

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
            cb(null, './uploads/users');
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
});
var upload = multer({
  storage: storage
}).any();

upload(req, res, function(err) {
  if (err) {
      console.log(err);
      return res.end('Error');
  } else {
      console.log(req.body);
      req.files.forEach(function(item) {
          console.log(item);
          // move your file to destination
      });
      // res.end('File uploaded');
      res.status(200).json({msg:"File uploaded"})
  }
});
  
}

exports.checkResetToken = async (req,res) => {

  const user = await User.findOne({ resetPasswordToken: req.params.token });
  const currentTime = Date.now();
  // const msg;
  const DbTime = user.resetPasswordExpires;
  // console.log(user.resetPasswordExpires);
  if(DbTime < currentTime){
    const msg = false;
    res.status(200).json(msg)
  }else{
    const msg = true;
    res.status(200).json(msg)
  }
  
}

exports.chnagePassword = async (req, res) => {

  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(req.body.new_password, salt);
  const user = await User.findOne({ _id: req.params._id });
  const valid_password = bcrypt.compareSync(req.body.current_password, user.password);
  if (!valid_password) return res.status(400).json({msg:"Incorrect Password"});

  // console.log(valid_password);return;

  try {
    if (req.body.new_password === req.body.confirm_password) {
      const updatedUser = await User.updateOne(
        { _id: req.params._id },
        { $set: { password: hasedPassword } }
      );
      res.json({data:updatedUser,msg:"Password changed Successfull"});
    } else {
      res.status(400).json({msg:"Password Not Matched!!"});
    }
  } catch (error) {
    res.status(400).send(error);
  }

};

exports.forgetPin = async (req, res) => {

  const emailExist = await User.findOne({ email: req.body.email });
  // console.log(emailExist._id);

  if (!emailExist) return res.status(400).json({msg: "Email not found in db"});

  const token = crypto.randomBytes(20).toString('hex');
  const update =await User.updateOne(
      {email: req.body.email},
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000,
        }
      }
    );
  console.log(update);
  const Link = "<a href='http://112.196.64.119:4200/reset-pin/?id="+ emailExist._id +"&&token=" + token + "'>Click Here</a>";
  const message = 'Please click on the following link,'  + Link + ' or paste this into your browser to complete the process:\n\n' 
  'If you did not request this, please ignore this email and your pin will remain unchanged.\n';
  transporter.sendMailFunction(req.body.email,'Reset Pin Link',message);
  res.status(200).json({msg:"Reset Pin link send successfully"});

}

exports.resetPin = async (req, res) => {

  try {
    if (req.body.new_token === req.body.confirm_token) {
      const updatedToken = await User.updateOne(
        { _id: req.params._id },
        { $set: { token: req.body.new_token } }
      );

      res.json({data:updatedToken,msg:"Pin reset successfully",new_token:req.body.new_token,confirm_token:req.body.confirm_token});
    } else {
      res.status(400).json({msg:"Pin Not matched"});
    }
  } catch (error) {
    res.status(400).send(error);
  }

};