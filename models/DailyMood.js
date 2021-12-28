const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DailyMoodSchema = new mongoose.Schema({
    moods:[{
        type: Schema.ObjectId,
        ref:'Mood',
    }],
    rating:[{
        type:Number,
        required:true,
    }],
    user_id:{
        type:String,
        required:true,
    },
    work:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    user_mood:{
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

module.exports = mongoose.model('DailyMood',DailyMoodSchema)