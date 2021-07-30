const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6
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
        type: Date
     },
    mobile_number:{
        type:String,
        required:true,
        min:6
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
    }
});

module.exports = mongoose.model('User',UserSchema)