const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DailyMuhasbahConflictSchema = new mongoose.Schema({
    myfeeling:[{
        type: Schema.ObjectId,
        ref:'Mood',
    }],
    allah_feeling:[{
        type: Schema.ObjectId,
        ref:'Mood',
    }],
    // user_feeling:[{
    //     type: Schema.ObjectId,
    //     ref:'Mood',
    // }],
    rating:{
        type:Number,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    person_name:{
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

module.exports = mongoose.model('MuhasbahConflict',DailyMuhasbahConflictSchema)