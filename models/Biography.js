const mongoose = require('mongoose');

const BiographySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:4,
        max:255
    },
    description:{
        type:String,
        required:true,
        min:4,
    },
    year:{
        type:Number,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    user_id:{
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

module.exports = mongoose.model('Biography',BiographySchema)