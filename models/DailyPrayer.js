const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DailyPrayerSchema = new mongoose.Schema({
 
    prayer:{
        type: Schema.ObjectId,
        ref:  'Prayer',
    },
    type:{
        type: Schema.ObjectId,
        ref:  'DailyIbadahTypes',
    },
    options:{
        type:Object,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
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

module.exports = mongoose.model('DailyPrayer',DailyPrayerSchema)