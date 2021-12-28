const express = require('express')
const User = require("../models/User");
const Nafs = require("../models/Nafs");
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
        return res.status(200).json(({data:UserList,msg:"User listed Successfully."}));
    } catch (error) {
      return res.status(400).json(error);
    }
     
};

exports.registerUser = async (req, res) => {

    const { error } = registrationvalidation(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) return res.status(200).json({msg:"Email already Exists"});

    // Hash Password

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        user_role: req.body.user_role,
        token: 'null',
        mobile_number: req.body.mobile_number,
        birthday:req.body.birthday,
        password: req.body.password,
        resetPasswordExpires:'null',
        resetPasswordToken:'',
        profile_image:'',
        address:req.body.address
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    try {
        const saveduser = await user.save();
        return res.status(200).json(({data:saveduser,msg:"User Registered Successfully."}));
    } catch (error) {
      return res.status(400).json(error);
    }
};

exports.login = async (req, res) => {

  // return res.json('heyyy I am here');

  const { error } = loginValidation(req.body);

  if (error) return res.status(400).json(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({msg:"Email or password is not correct"});

  const valid_password = bcrypt.compareSync(req.body.password, user.password);

  if (!valid_password) return res.status(400).json({msg:"Password is incorrect."});

  // Create token

  const token = jwt.sign({ _id: user._id,role:user.user_role }, process.env.TOKEN_SECRET);
  // res.header("auth-token", token).json({auth_token:token,msg:"Login successfully"});
  return res.status(200).json({auth_token:token,msg:"Login successfully"});

  
};

exports.resetPassword = async (req, res) => {

  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(req.body.new_password, salt);
  const user = await User.findOne({ _id: req.params._id });

  try {
    if (req.body.new_password === req.body.confirm_password) {
      const updatedUser = await User.updateOne(
        { _id: req.params._id },
        { $set: { password: hasedPassword } }
      );
      return res.json({data:updatedUser,msg:"Password Reset Successfull"});
    } else {
      return res.status(400).json({msg:"Password Not Matched!!"});
    }
  } catch (error) {
    return res.status(400).json(error);
  }

};

exports.createPin = async (req, res) => {

  try {
    if (req.body.token === req.body.confirm_token) {
      const updatedToken = await User.updateOne(
        { _id: req.params._id },
        { $set: { token: req.body.token } }
      );

      return res.json({data:updatedToken,msg:"token created successfully"});
    } else {
      return res.json({msg:"Token Not matched"});
    }
  } catch (error) {
    return res.status(400).json(error);
  }

};

exports.loginByPin = async (req, res) => {

    const pinExist = await User.findOne({ token: req.body.token });
 
    try {
        if (pinExist) {
          return res.status(200).json(({msg:"Hey You logged in!!"}));
        } else {
          return res.status(400).json(({msg:"Token Not matched !"}));
        }
      } catch (error) {
        return res.status(400).json(error);
      }
}


exports.forgetPassword = async (req, res) => {

    const emailExist = await User.findOne({ email: req.body.email });

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
    const Link = "<a href='http://islamic.nvinfobase.com/#/reset/?id="+ emailExist._id +"&&token=" + token + "'>Click Here</a>";
    const message = 'Please click on the following link,'  + Link + ' or paste this into your browser to complete the process:\n\n' 
    'If you did not request this, please ignore this email and your password will remain unchanged.\n';
    transporter.sendMailFunction(req.body.email,'Reset Password Link',message);
    return res.status(200).json({msg:"reset link send successfully"});

}

exports.me = async (req,res) => {
  
  var authorization = req.header('auth-token');
  if (authorization) {
      try {
          var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
      } catch (e) {
          console.log(e);
          return res.status(401).json('unauthorized');
      }
      var userId = decoded._id;
     const user = await User.findOne({ _id: userId });
     return res.status(200).json(user);
  }
  return res.json('Server Error');

}

exports.editProfile = async (req,res) => {

  const user = await User.findOne({ _id: req.params._id });
  return res.status(200).json(({data:user,msg:"User data Successfully."}));
}

exports.updateProfile = async (req,res) => {

  try {
      const updatedUser =  await User.findByIdAndUpdate(req.params._id, req.body, { new: true });
      return res.json({data:updatedUser,msg:"User updated successfully"});
   
  } catch (error) {
    return res.status(400).json(error);
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
      return res.json(err);
  } else {
    
      req.files.forEach( async function(item) {
        
          const updatedUser = await User.updateOne(
            { _id: req.params._id },
            { $set: { profile_image: item.originalname} }
          );
          if(updatedUser) 
          {
            return res.status(200).json({msg:"User profile uploaded"})
          }else{
            return res.status(500).json({msg:"Image not upload"})
          }
      });
      
  }
});
  
}

exports.checkResetToken = async (req,res) => {

  const user = await User.findOne({ resetPasswordToken: req.params.token });
  const currentTime = Date.now();
  const DbTime = user.resetPasswordExpires;
  if(DbTime < currentTime){
    const msg = false;
    return res.status(200).json(msg)
  }else{
    const msg = true;
    return res.status(200).json(msg)
  }
  
}

exports.chnagePassword = async (req, res) => {

  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(req.body.new_password, salt);
  const user = await User.findOne({ _id: req.params._id });
  const valid_password = bcrypt.compareSync(req.body.current_password, user.password);
  if (!valid_password) return res.status(400).json({msg:"Incorrect Password"});

  try {
    if (req.body.new_password === req.body.confirm_password) {
      const updatedUser = await User.updateOne(
        { _id: req.params._id },
        { $set: { password: hasedPassword } }
      );
      res.json({data:updatedUser,msg:"Password changed Successfull"});
    } else {
      return res.status(400).json({msg:"Password Not Matched!!"});
    }
  } catch (error) {
    return res.status(400).json(error);
  }

};

exports.forgetPin = async (req, res) => {

  const emailExist = await User.findOne({ email: req.body.email });

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
  const Link = "<a href='http://islamic.nvinfobase.com/#/reset-pin/?id="+ emailExist._id +"&&token=" + token + "'>Click Here</a>";
  const message = 'Please click on the following link,'  + Link + ' or paste this into your browser to complete the process:\n\n' 
  'If you did not request this, please ignore this email and your pin will remain unchanged.\n';
  transporter.sendMailFunction(req.body.email,'Reset Pin Link',message);
  return res.status(200).json({msg:"Reset Pin link send successfully"});

}

exports.resetPin = async (req, res) => {

  try {
    if (req.body.new_token === req.body.confirm_token) {
      const updatedToken = await User.updateOne(
        { _id: req.params._id },
        { $set: { token: req.body.new_token } }
      );

      return res.json({data:updatedToken,msg:"Pin reset successfully",new_token:req.body.new_token,confirm_token:req.body.confirm_token});
    } else {
      return res.status(400).json({msg:"Pin Not matched"});
    }
  } catch (error) {
    return res.status(400).json(error);
  }

};

exports.changePin = async (req, res) => {


  const user = await User.findOne({ _id: req.params._id });
  var validPin = req.body.old_pin == user.token ? true:false;
  if (!validPin) return res.status(400).json({msg:"Incorrect Pin"});
  try {
    if (req.body.token === req.body.confirm_token) {
      const updatedToken = await User.updateOne(
        { _id: req.params._id },
        { $set: { token: req.body.token } }
      );

      return res.json({data:updatedToken,msg:"token changed successfully"});
    } else {
      return res.json({msg:"Token Not matched"});
    }
  } catch (error) {
    return res.status(400).json(error);
  }

};

exports.contactUs = (req,res) => {

  const subject = 'Contact Us';
  const message = `<p><b>Name:</b> ${req.body.name}</p> 
  <p><b>Email:</b> ${req.body.email}</p> 
  <p><b>Subject:</b> ${req.body.subject}</p> 
  <p><b>Message:</b> ${req.body.message}</p> 
  `;
  transporter.sendMailFunction(req.body.email,subject,message);
  return res.json({msg:"Mail send successfully."});
}

exports.feedback = (req,res) => {

  
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
            cb(null, './uploads/feedback');
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
      return res.json(err);
  } else {
    const filename = req.files[0].originalname;
  const subject = 'Feedback';
  const message = `
  <p><b>Subject:</b> ${req.body.subject}</p> 
  <p><b>Message:</b> ${req.body.message}</p> 
  `;
  transporter.sendFeedbackFunction('developer1607@gmail.com',subject,message,filename);
  return res.json({msg:"Mail send successfully."});
      
  }
});

}


exports.createNafs = async(req,res) => {
  try {
    
    const nafs = new Nafs({
      name:req.body.name,
      description:req.body.description,
    });

    const saveNafs = await nafs.save();
    return res.status(200).json({data:saveNafs,msg:"Nafs save successfully"})

  } catch (error) {
  return res.json(error);
    
  }
}

exports.updateNafs = async(req,res) =>{
  try {
    const nafs =  await Nafs.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.json({data:nafs,msg:"nafs updated successfully"});
 
} catch (error) {
  return res.status(400).json(error);
}
}

exports.viewNafs = async(req,res) => {
  try {
    const nafs =  await Nafs.findOne({_id:req.params._id});
    return res.status(200).json({data:nafs})
  } catch (error) {
    return res.status(400).json(error)
  }
}