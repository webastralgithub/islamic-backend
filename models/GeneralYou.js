const mongoose = require('mongoose');

const GeneralSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    text1:{
        type:String,
        required:true,
    },
    text2:{
        type:String,
        required:true,
    },
    text3:{
        type:String,
        required:true,
    },
    text4:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
       default:Date.now
    },
    updated_at:{
        type:Date,
       default:Date.now
    },
});

module.exports = mongoose.model('General',GeneralSchema)