const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SetGoalSchema = new mongoose.Schema({
    age:{
        type: Schema.ObjectId,
        ref:'UserIncome',
    },
    user_id:{
        type:String,
        required:true,
    },
    goals:[{
        type: Schema.ObjectId,
        ref:'Goal',
    }],
    financial_needed:{
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

module.exports = mongoose.model('SetGoal',SetGoalSchema)