const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const GeneralOptionsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    generals:{
        type: Schema.ObjectId,
        ref:  'General',
    },
    type:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    order:{
        type:Number,
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

module.exports = mongoose.model('GeneralOptions',GeneralOptionsSchema)