const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:4,
        max:255
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

module.exports = mongoose.model('Mood',MoodSchema)