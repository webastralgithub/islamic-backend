const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
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
    created_at:{
        type:Date,
       default:Date.now
    },
    updated_at:{
        type:Date,
       default:Date.now
    },
});

module.exports = mongoose.model('Journel',JournalSchema)