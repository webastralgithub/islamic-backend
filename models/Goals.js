const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    required_money:{
        type:Number,
        required:true,
    },
    steps:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    progress:{
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

module.exports = mongoose.model('Goal',GoalSchema)