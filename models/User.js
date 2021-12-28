const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        min:6
    },
    gender:{
        type:String,
        required:true,
    },
    user_role:{
        type:String,
    },
    token:{
        type:String,
    },
    birthday: { 
        type: String,
     },
    mobile_number:{
        type:String,
        required:true,
        min:6
    },
    address:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    date:{
        type:Date,
       default:Date.now
    },
    resetPasswordExpires:{
        type:String,
        default:'null'
    },
    resetPasswordToken:{
        type:String,
        default:'null'
    },
    status:{
        type:Boolean,
        default:0
    },
    profile_image:{
        type:String,
        default:'null'
    },
    subscription_type:{
        type:String,
        default:'null'
    },
    subscription_status:{
        type:String,
        default:0
    },
    subscription_date:{
        type:Date
    },
});

module.exports = mongoose.model('User',UserSchema)