const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DailyUpdateSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        min:4,
    },
    consumed_hrs:{
        type:Number,
        required:true,
    },
    activitycategories:{
        type: Schema.ObjectId,
        ref:'ActivityCategory',
    },
    user_id:{
        type:String,
        required:true,
    },
    date:{
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

module.exports = mongoose.model('DailyUpdate',DailyUpdateSchema)