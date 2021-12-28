const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserIncomeSchema = new mongoose.Schema({
    age:{
        type:Number,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    income:{
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

module.exports = mongoose.model('UserIncome',UserIncomeSchema)