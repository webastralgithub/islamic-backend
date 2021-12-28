const mongoose = require('mongoose');

const TvSchema = new mongoose.Schema({
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
    video:{
        type:String,
        required:true,
    },
    thumbnailPath:{
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

module.exports = mongoose.model('Tv',TvSchema)