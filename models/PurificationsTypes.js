const mongoose = require('mongoose');

const PurificationsTypesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    icons:{
        type:String,
        required:true,
    },
    order:{
        type:Number,
        required:true,
    },
    info:{
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

module.exports = mongoose.model('PurificationsTypes',PurificationsTypesSchema)