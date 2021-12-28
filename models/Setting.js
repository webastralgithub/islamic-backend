const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
   
     city:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    go_to:{
        type:String,
        required:true,
    },
    timing:{
        type:String,
        required:true,
    },
    high_lat_method:{
        type:String,
        required:true,
    },
    prayer_method:{
        type:String,
        required:true,
    },
    asr_method:{
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

module.exports = mongoose.model('Settings',SettingsSchema)