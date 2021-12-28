const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DailyMuhasbahActionSchema = new mongoose.Schema({
    mood_action:[{
        type: Schema.ObjectId,
        ref:'Mood',
    }],
    mood_prosecutor:[{
        type: Schema.ObjectId,
        ref:'Mood',
    }],
    mood_judge:[{
        type: Schema.ObjectId,
        ref:'Mood',
    }],
    rating:{
        type:Number,
        required:true,
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

module.exports = mongoose.model('MuhasbahAction',DailyMuhasbahActionSchema)